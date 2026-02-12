<template>
  <div class="background">
    <div class="text-overlay">
      <header class="main-title">
        Your LaunchPad to Success.
        <h2>Browse internships, review companies, and take your career to the stars. 🚀</h2>
      </header>

      <!-- SEARCH BAR -->
      <div class="search-container">
        <searchBar @search="handleSearch" />
      </div>

      <!-- LOADING STATE -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading companies...</p>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchCompanies" class="retry-btn">Try Again</button>
      </div>

      <!-- MAIN CONTENT AREA -->
      <div v-else class="main-content">
        <!-- Filter Search (Left) -->
        <div class="left-container">
          <filterSearch @filter-changed="handleFilterChange" />
        </div>

        <!-- Scrolling Profiles (Center) -->
        <div class="center-container">
          <ScrollingProfiles :companies="companiesList" />
          <p v-if="!companiesList.length">No companies match your search.</p>
        </div>

        <!-- Right Side Widgets -->
        <div class="right-container">
          <div class="widget">
            <recommendationWidget />
          </div>
          <div class="widget">
            <reviewWidget />
          </div>
        </div>
      </div>
    </div>

    <!-- BACKGROUND IMAGE + GRADIENT -->
    <div class="gradient"></div>
    <img class="bg-img" src="../assets/pexels-pixabay-47367.jpg" alt="moon image" />
  </div>
</template>

<script>
import CompanySummary from '@/components/CompanySummary.vue';
import searchBar from '../components/searchbar.vue';
import contactFooter from '../components/contactFooter.vue';
import FeedbackForm from '../components/FeedbackForm.vue';
import reviewWidget from '../components/reviewWidget.vue';
import recommendationWidget from '@/components/recommendationWidget.vue';
import filterSearch from '@/components/filterSearch.vue';
import ScrollingProfiles from './ScrollingProfiles.vue';
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '@/firebase';
import { seedCompanies } from '@/utils/seedCompanies';

export default {
  name: 'Companies',
  components: {
    searchBar,
    contactFooter,
    FeedbackForm,
    reviewWidget,
    recommendationWidget,
    filterSearch,
    ScrollingProfiles
  },
  setup() {
    const companiesList = ref([]);
    const allCompanies = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const showFeedbackForm = ref(false);
    const isAuthenticated = ref(false);

    onMounted(async () => {
      if (auth.currentUser) {
        isAuthenticated.value = true;
      }
      
      // First, seed companies to ensure we have company logos
      try {
        console.log('Seeding companies database...');
        const seedResult = await seedCompanies();
        console.log('Seed result:', seedResult);
      } catch (error) {
        console.error('Error seeding companies:', error);
      }
      
      // Then fetch companies as usual
      fetchCompanies();
    });

    // Generate a static AI summary for a company based on its reviews
    const generateStaticAISummary = (company, reviews) => {
      // No reviews case
      if (!reviews || reviews.length === 0) {
        return `No reviews available for ${company.name} yet. Be the first to share your experience!`;
      }
      
      // Calculate average rating
      const reviewCount = reviews.length;
      const avgRating = parseFloat(company.rating);
      const formattedRating = avgRating.toFixed(1);
      
      // Count positive, neutral, and negative reviews
      const positive = reviews.filter(r => (r.rating || 0) >= 4).length;
      const neutral = reviews.filter(r => (r.rating || 0) >= 3 && (r.rating || 0) < 4).length;
      const negative = reviews.filter(r => (r.rating || 0) < 3).length;
      
      // Calculate percentages
      const positivePercentage = Math.round((positive / reviewCount) * 100);
      const neutralPercentage = Math.round((neutral / reviewCount) * 100);
      const negativePercentage = Math.round((negative / reviewCount) * 100);
      
      // Collect skills if available
      const skillsCount = {};
      reviews.forEach(review => {
        if (review.skills && Array.isArray(review.skills)) {
          review.skills.forEach(skill => {
            skillsCount[skill] = (skillsCount[skill] || 0) + 1;
          });
        }
      });
      
      const topSkills = Object.entries(skillsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
        
      // Extract roles for more personalized summaries
      const roles = [...new Set(reviews.map(r => r.role).filter(Boolean))].slice(0, 3);
      const roleText = roles.length > 0 ? `for roles like ${roles.join(', ')}` : '';
      
      // Generate deterministic "random" response time between 1-5 weeks based on company name
      // This ensures the same company always gets the same number across different pages
      const generateDeterministicRandom = (companyName) => {
        // Create a hash from the company name
        let hash = 0;
        for (let i = 0; i < companyName.length; i++) {
          hash = ((hash << 5) - hash) + companyName.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }
        // Use the hash to generate a number between 1 and 5
        const normalizedHash = Math.abs(hash) / 2147483647; // Normalize to 0-1 range
        return (1 + (normalizedHash * 4)).toFixed(1);
      };
      
      const responseWeeks = generateDeterministicRandom(company.name);
      
      // Generate response time text
      const responseTimeText = `Candidates typically hear back within ${responseWeeks} weeks after applying.`;
      
      // Get common interview process stages
      const interviewStages = ['phone screen', 'technical interview', 'behavioral interview', 'coding test', 'system design', 'onsite'];
      const mentionedStages = [];
      
      interviewStages.forEach(stage => {
        const mentioned = reviews.some(r => 
          r.fullReview && r.fullReview.toLowerCase().includes(stage)
        );
        if (mentioned) {
          mentionedStages.push(stage);
        }
      });
      
      let interviewProcessText = '';
      if (mentionedStages.length > 0) {
        interviewProcessText = `The interview process often includes ${mentionedStages.slice(0, 3).join(', ')}.`;
      }
      
      // Generate different summaries based on rating and review count
      if (reviewCount >= 10) {
        // Detailed summary for companies with many reviews
        return `Based on ${reviewCount} reviews, ${company.name} has an average rating of ${formattedRating}/5.0. ${positivePercentage}% of reviewers had a positive experience${roleText}. ${topSkills.length > 0 ? `Candidates with ${topSkills.join(', ')} skills tend to perform well in interviews. ` : ''}${responseTimeText} ${interviewProcessText}`;
      } else if (avgRating >= 4) {
        return `${company.name} is highly rated with an average of ${formattedRating}/5.0 across ${reviewCount} reviews. ${positivePercentage}% of candidates report a positive experience${roleText}. ${topSkills.length > 0 ? `Key skills valued: ${topSkills.join(', ')}. ` : ''}${responseTimeText}`;
      } else if (avgRating >= 3) {
        return `${company.name} has an average rating of ${formattedRating}/5.0 based on ${reviewCount} reviews. ${interviewProcessText} ${topSkills.length > 0 ? `Common skills mentioned: ${topSkills.join(', ')}. ` : ''}${responseTimeText}`;
      } else {
        return `${company.name} has an average rating of ${formattedRating}/5.0 from ${reviewCount} reviews. ${interviewProcessText} ${topSkills.length > 0 ? `Candidates recommend preparing for: ${topSkills.join(', ')}. ` : ''}${responseTimeText}`;
      }
    };

    const fetchCompanies = async () => {
      try {
        loading.value = true;
        error.value = null;

        // First, get all companies from the companies collection to use for logo matching
        const companiesCollection = collection(db, 'companies');
        const companiesSnapshot = await getDocs(companiesCollection);
        
        // Create a map of company name (lowercase) to company data for quick lookups
        const companiesLookup = new Map();
        companiesSnapshot.forEach(doc => {
          const companyData = doc.data();
          companiesLookup.set(companyData.normalizedName, companyData);
        });
        
        console.log(`Loaded ${companiesLookup.size} companies from companies collection`);

        // Then fetch reviews to build company listings
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('approved', '==', true)
        );
        const snapshot = await getDocs(reviewsQuery);

        const companyMap = new Map();
        const reviewsByCompany = new Map();

        snapshot.forEach(doc => {
          const data = doc.data();
          const name = data.companyName;
          if (!name) return;

          // Store all reviews by company for summary generation
          if (!reviewsByCompany.has(name)) {
            reviewsByCompany.set(name, []);
          }
          reviewsByCompany.get(name).push({
            ...data,
            id: doc.id
          });

          if (!companyMap.has(name)) {
            // Try to find a logo from the companies collection
            const normalizedName = name.toLowerCase();
            let companyInfo = null;
            
            // Look for exact match
            if (companiesLookup.has(normalizedName)) {
              companyInfo = companiesLookup.get(normalizedName);
              console.log('🔍 companiesLookup contents:');
              for (const [key, value] of companiesLookup.entries()) {
                console.log(`   ${key}:`, value);
              }
            } else {
              // Try to find a partial match
              for (const [key, value] of companiesLookup.entries()) {
                if (normalizedName.includes(key) || key.includes(normalizedName)) {
                  companyInfo = value;
                  break;
                }
              }
            }
            console.log("DDDDDDDDDDDDDDDD" + companyInfo);
            // Use logo from companies collection if found, otherwise use review data or default
            const logo = companyInfo?.logoURL || 
                        data.linkedCompany?.logoURL || 
                        '/company-placeholder.png';
            
            // Use industry from companies collection if found, otherwise use review data
            const industry = companyInfo?.industry || 
                           data.linkedCompany?.industry || 
                           data.industry || '';
                           
            // Use employee size from companies collection if found, otherwise use review data
            const employees = companyInfo?.employeeSize ||
                            data.linkedCompany?.employeeSize || 
                            'Unknown employee count';
                           
            companyMap.set(name, {
              name,
              role: data.role || '',
              industry,
              employees,
              logo,
              description: data.fullReview || '',
              rating: data.rating || 0,
              reviewCount: 1
            });
          } else {
            const comp = companyMap.get(name);
            comp.rating += data.rating || 0;
            comp.reviewCount++;
            
            // Update industry if current review has it and company doesn't
            if (!comp.industry && (data.linkedCompany?.industry || data.industry)) {
              comp.industry = data.linkedCompany?.industry || data.industry;
            }
          }
        });

        // Define industry categories for different companies
        const industryMapping = {
          'google': 'Technology',
          'amazon': 'Retail',
          'meta': 'Technology',
          'facebook': 'Technology',
          'microsoft': 'Technology',
          'apple': 'Technology',
          'goldman sachs': 'Financial Services',
          'jpmorgan': 'Financial Services',
          'morgan stanley': 'Financial Services',
          'deloitte': 'Consulting',
          'pwc': 'Consulting',
          'kpmg': 'Consulting',
          'ey': 'Consulting',
          'accenture': 'Consulting',
          'mckinsey': 'Consulting',
          'bcg': 'Consulting',
          'bain': 'Consulting',
          'linkedin': 'Technology',
          'netflix': 'Media & Entertainment',
          'ibm': 'Technology',
          'adobe': 'Technology',
          'salesforce': 'Technology'
        };

        // Process companies and generate AI summaries for each
        const companies = Array.from(companyMap.values()).map(c => {
          const companyReviews = reviewsByCompany.get(c.name) || [];
          const aiSummary = generateStaticAISummary(
            { ...c, rating: (c.rating / c.reviewCount).toFixed(1) },
            companyReviews
          );
          
          // Assign default industry if missing
          let industry = c.industry;
          if (!industry || industry.trim() === '') {
            // Check if company name matches any in our mapping (case insensitive)
            const lowerName = c.name.toLowerCase();
            for (const [key, value] of Object.entries(industryMapping)) {
              if (lowerName.includes(key)) {
                industry = value;
                break;
              }
            }
            // If still no match, default to Other
            if (!industry || industry.trim() === '') {
              industry = 'Other';
            }
          }
          
          return {
            ...c,
            rating: (c.rating / c.reviewCount).toFixed(1),
            industry: industry,
            aiSummary,
            reviews: companyReviews,
            logo: c.logo || c.logoURL || '/company-placeholder.png' 
          };
        });

        companiesList.value = companies;
        allCompanies.value = companies;
        localStorage.setItem('companies', JSON.stringify(companies));
      } catch (err) {
        error.value = 'Failed to fetch companies';
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = (query) => {
      const q  = query.toLowerCase();
      companiesList.value = q
      ? allCompanies.value.filter(c => c.name.toLowerCase().includes(q))
      : allCompanies.value;
    }

    const handleFilterChange = (filters) => {
      const allCompanies = JSON.parse(localStorage.getItem('companies')) || [];

      const filtered = allCompanies.filter(c => {
        const locationMatch = !filters.location || (c.role && c.role.toLowerCase().includes(filters.location.toLowerCase()));
        const jobMatch = !filters.jobTitle || (c.role && c.role.toLowerCase().includes(filters.jobTitle.toLowerCase()));
        const industryMatch = !filters.industry || (c.industry && c.industry.toLowerCase().includes(filters.industry.toLowerCase()));
        const ratingMatch = !filters.rating || parseFloat(c.rating) >= filters.rating;
        return locationMatch && jobMatch && industryMatch && ratingMatch;
      });

      console.log('Filters:', filters);
      console.log('Filtered:', filtered);

      companiesList.value = filtered;
    };

    return {
      companiesList,
      loading,
      error,
      showFeedbackForm,
      openFeedbackForm: () => showFeedbackForm.value = true,
      closeFeedbackForm: () => showFeedbackForm.value = false,
      fetchCompanies,
      handleFilterChange,
      handleSearch    };
  }
};
</script>

<style scoped>
/* General Styles */
.container {
  box-sizing: border-box;
  max-width: 100%;
}

header {
  line-height: 1.5;
  margin-top: 40px;
}

.main-title {
  transform: translate(3%, -20%);
  color: white;
  text-align: center;
}

.search-container {
  margin-top: 0px;
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: white;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ff6b48;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #ff6b48;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.retry-btn:hover {
  background-color: #e05a38;
}

/* Main Content Layout */
.main-content {
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* Ensures all sections occupy equal height */
  margin-top: 20px;
}

/* Left Container (Filter Search) */
.left-container {
  flex-basis: 20%; /* Adjust width as needed */
}

/* Center Container (Scrolling Profiles) */
.center-container {
  flex-basis: 60%; /* Adjust width as needed */
  display: flex;
  flex-direction: column;
  transform: translate(-4%, 0%);
}

.scrolling-profiles-container {
  margin-bottom: 20px; /* Adds spacing below scrolling profiles */
}

/* Right Container (Widgets) */
.right-container {
  flex-basis: 20%; /* Adjust width as needed */
  transform: translate(-4%, 0%);
}

/* Feedback Button */
.feedback-button-container {
  text-align: center;
  margin-top: 20px;
}

.feedback-btn {
  background-color: #f67c51;
  border: none;
  border-radius: 10px;
  font-family: 'League Spartan', sans-serif;
  color: white;
  font-size: 12px;
  font-weight: 'semi-bold';
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
  line-height: 1;
  padding: 0.5rem 1rem;
}

.feedback-btn:hover {
  background-color: #d4633a;
}
</style>
