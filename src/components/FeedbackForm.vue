<template>
    <div class="review-form">
      <!-- Step 1: Basic Company Information -->
      <div v-if="currentStep === 1" class="form-step">
        <div class="form-group">
          <h3>Company Name</h3>
          <div class="autocomplete-container">
            <input 
              type="text" 
              placeholder="Search for a company"
              v-model="companySearchTerm"
              @input="searchCompanies"
              @focus="showCompanySuggestions = true"
              @blur="delayHideCompanySuggestions"
              @keydown="handleKeyDown"
            >
            <div v-if="showCompanySuggestions && companySuggestions.length > 0" class="autocomplete-results">
              <div 
                v-for="(company, index) in companySuggestions" 
                :key="company.normalizedName"
                class="autocomplete-item"
                :class="{ 'highlighted': index === selectedSuggestionIndex }"
                @mousedown="selectCompany(company)"
                @mouseover="selectedSuggestionIndex = index"
              >
                <div class="company-suggestion-item">
                  <img 
                    v-if="company.logoURL" 
                    :src="company.logoURL" 
                    class="company-suggestion-logo"
                    @error="handleLogoError"
                  >
                  <div class="company-suggestion-details">
                    <span class="company-suggestion-name">{{ company.name }}</span>
                    <span v-if="company.industry" class="company-suggestion-industry">{{ company.industry }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <h3>Industry</h3>
          <select v-model="formData.industry" required>
            <option value="" disabled selected>Select an industry</option>
            <option value="Agriculture & Farming">Agriculture & Farming</option>
            <option value="Forestry & Logging">Forestry & Logging</option>
            <option value="Fishing & Aquaculture">Fishing & Aquaculture</option>
            <option value="Mining & Quarrying">Mining & Quarrying</option>
            <option value="Oil & Gas">Oil & Gas</option>
            <option value="Utilities">Utilities</option>
            <option value="Construction">Construction</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale & Distribution">Wholesale & Distribution</option>
            <option value="Transportation & Logistics">Transportation & Logistics</option>
            <option value="Hospitality & Tourism">Hospitality & Tourism</option>
            <option value="Food & Beverage Services">Food & Beverage Services</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Legal Services">Legal Services</option>
            <option value="Consulting">Consulting</option>
            <option value="Telecommunications">Telecommunications</option>
            <option value="Media & Entertainment">Media & Entertainment</option>
            <option value="Sports & Recreation">Sports & Recreation</option>
            <option value="Personal Services">Personal Services</option>
            <option value="Technology">Technology</option>
            <option value="Biotechnology & Life Sciences">Biotechnology & Life Sciences</option>
            <option value="Aerospace & Defense">Aerospace & Defense</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Data & Analytics">Data & Analytics</option>
            <option value="Government & Public Administration">Government & Public Administration</option>
            <option value="Non-Profit & NGOs">Non-Profit & NGOs</option>
            <option value="Research & Development">Research & Development</option>
            <option value="Arts & Culture">Arts & Culture</option>
            <option value="Environmental Services">Environmental Services</option>
            <option value="Startups / Venture Capital">Startups / Venture Capital</option>
            <option value="Think Tanks & Policy Institutes">Think Tanks & Policy Institutes</option>
          </select>
        </div>
        
        <div class="form-group">
          <h3>Role</h3>
          <input 
            type="text" 
            placeholder="Enter role name"
            v-model="formData.role"
          >
        </div>
        
        <div class="form-group">
          <h3>Rating</h3>
          <div class="rating-container">
          <StarRating v-model="formData.rating" />
        </div>
        </div>
        
        <div class="form-group">
          <h3>Salary/Allowance $SGD/Month (Optional)</h3>
          <input 
            type="number" 
            placeholder="Enter a number e.g. $500"
            v-model="formData.salary"
          >
        </div>
        
        <div class="form-group">
          <h3>Full Review</h3>
          <textarea 
            placeholder="Tell us what you think (limit 500 words)"
            v-model="formData.fullReview"
          ></textarea>
        </div>
        
        <div class="step-indicator">
          <span>1/3</span>
          <button @click="nextStep" class="next-btn">→</button>
        </div>
      </div>
      
      <!-- Step 2: Interview Details -->
      <div v-if="currentStep === 2" class="form-step">
        <div class="form-group">
          <h3>How long was the interview process?</h3>
          <select v-model="formData.interviewDuration">
            <option disabled value="">Enter...</option>
            <option value="1_week">Less than a week</option>
            <option value="2_weeks">1-2 weeks</option>
            <option value="1_month">3-4 weeks</option>
            <option value="2_months">1-2 months</option>
          </select>
        </div>
        
        <div class="form-group">
          <h3>How long did {{ formData.companyName || "XX Company" }} take to respond?</h3>
          <select v-model="formData.responseTime">
            <option disabled value="">Enter...</option>
            <option value="same_day">Same day</option>
            <option value="few_days">Few days</option>
            <option value="one_week">One week</option>
            <option value="two_weeks">Two weeks</option>
          </select>
        </div>
        
        <div class="form-group">
          <h3>Current stage of application? (Optional)</h3>
          <select v-model="formData.applicationStage">
            <option disabled value="">Enter...</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div class="form-group">
          <h3>Your skill sets relevant to this role:</h3>
          <input 
            type="text" 
            placeholder="Add a skill name..."
            v-model="newSkill"
            @keyup.enter="addSkill"
          >
          <div class="skills-container">
            <span v-for="(skill, index) in formData.skills" :key="index" class="skill-tag">
              {{ skill }}
              <button @click="removeSkill(index)" class="remove-btn">×</button>
            </span>
          </div>
        </div>
        
        <div class="step-indicator">
          <button @click="prevStep" class="back-btn">← BACK</button>
          <span>2/3</span>
          <button @click="nextStep" class="next-btn">→</button>
        </div>
      </div>
          
      <!-- Step 3: Rating Questions -->
      <div v-if="currentStep === 3" class="form-step">
        <div class="form-group">
          <h3>How fair was the interview process?</h3>
          <div class="rating-container">
          <StarRating v-model="formData.fairnessRating" /></div>
        </div>
        
        <div class="form-group">
          <h3>How likely are you to recommend this company to a friend?</h3>
          <div class="rating-container">
          <StarRating v-model="formData.recommendationRating" /> </div>
        </div>
        
        <div class="form-group">
          <h3>How difficult was the interview?</h3>
          <div class="rating-container">
          <StarRating v-model="formData.difficultyRating" /> </div>
        </div>
        
        <div class="step-indicator">
          <button @click="prevStep" class="back-btn">← BACK</button>
          <button @click="submitForm" :disabled="submitting" class="submit-btn">
            {{ submitting ? 'SUBMITTING...' : 'SUBMIT' }}
          </button>
        </div>
      </div>
      
      <!-- Success Screen -->
      <div v-if="currentStep === 4" class="success-screen">
        <div class="success-icon">
          <img src="@/assets/logos/telescope_final.png" alt="Success" />
        </div>
        <h2>All set!</h2>
        <p>Your review will be sent for approval. Thank you for your contribution!</p>
        <button @click="finishReview" class="finish-btn">FINISH & CLOSE</button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script>
  import StarRating from './StarRating.vue';
  import { useRouter } from 'vue-router';
  import { db, auth } from '@/firebase';
  import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
  import { searchCompanies, seedCompanies } from '@/utils/seedCompanies';
  
  export default {
    name: 'FeedbackForm',
    components: {
      StarRating
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    data() {
      return {
        currentStep: 1,
        newSkill: '',
        submitting: false,
        errorMessage: '',
        // Company autocomplete data
        companySearchTerm: '',
        companySuggestions: [],
        showCompanySuggestions: false,
        selectedSuggestionIndex: -1,
        searchTimeout: null,
        // Form data
        formData: {
          companyName: '',
          companyData: null, // Will store linked company data
          industry: '',
          role: '',
          rating: 0,
          salary: '',
          fullReview: '',
          interviewDuration: '',
          responseTime: '',
          applicationStage: '',
          skills: [],
          fairnessRating: 0,
          recommendationRating: 0,
          difficultyRating: 0
        }
      };
    },
    watch: {
      // Automatically update formData.companyName when companySearchTerm changes
      companySearchTerm(val) {
        this.formData.companyName = val;
      }
    },
    mounted() {
      // Check if companies collection has data when component mounts
      this.checkCompaniesCollection();
    },
    methods: {
      // Company autocomplete methods
      async searchCompanies() {
        // Clear previous timeout
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }

        console.log(`Autocomplete: Searching for '${this.companySearchTerm}'`);

        // Set a small timeout to avoid too many searches while typing
        this.searchTimeout = setTimeout(async () => {
          if (this.companySearchTerm.length >= 2) {
            try {
              console.log(`Autocomplete: Making search request for '${this.companySearchTerm}'`);
              const results = await searchCompanies(this.companySearchTerm);
              console.log(`Autocomplete: Got ${results.length} results`, results);
              
              this.companySuggestions = results;
              this.selectedSuggestionIndex = results.length > 0 ? 0 : -1;
              
              // Make sure suggestions are visible if we have results
              if (results.length > 0) {
                this.showCompanySuggestions = true;
              }
            } catch (error) {
              console.error('Error searching companies:', error);
              this.companySuggestions = [];
            }
          } else {
            console.log('Autocomplete: Query too short, clearing suggestions');
            this.companySuggestions = [];
          }
        }, 300);
      },
      
      selectCompany(company) {
        console.log('Selecting company:', company);
        this.companySearchTerm = company.name;
        this.formData.companyName = company.name;
        
        // Set industry if available - ensure it matches one of the options in the dropdown
        if (company.industry) {
          console.log('Setting industry to:', company.industry);
          
          // List of industries in the dropdown
          const industries = [
            'Agriculture & Farming', 'Forestry & Logging', 'Fishing & Aquaculture', 
            'Mining & Quarrying', 'Oil & Gas', 'Utilities', 'Construction',
            'Manufacturing', 'Retail', 'Wholesale & Distribution', 
            'Transportation & Logistics', 'Hospitality & Tourism', 
            'Food & Beverage Services', 'Real Estate', 'Education', 'Healthcare',
            'Financial Services', 'Legal Services', 'Consulting', 
            'Telecommunications', 'Media & Entertainment', 'Sports & Recreation',
            'Personal Services', 'Technology', 'Biotechnology & Life Sciences',
            'Aerospace & Defense', 'Artificial Intelligence', 'Cybersecurity',
            'Data & Analytics', 'Government & Public Administration', 'Non-Profit & NGOs',
            'Research & Development', 'Arts & Culture', 'Environmental Services',
            'Startups / Venture Capital', 'Think Tanks & Policy Institutes'
          ];
          
          // Map of common industry values to standardized dropdown options
          // This handles both exact and partial matches
          const industryMap = {
            // Information Technology
            'technology': 'Technology',
            'tech': 'Technology',
            'software': 'Technology',
            'it': 'Technology',
            'e-commerce/technology': 'Technology',
            'technology & software': 'Technology',
            'technology & consulting': 'Technology',
            'technology & consumer electronics': 'Technology',
            'software & crm': 'Technology',
            
            // Financial Services
            'finance': 'Financial Services',
            'banking': 'Financial Services',
            'financial': 'Financial Services',
            'insurance': 'Financial Services',
            
            // Healthcare
            'healthcare': 'Healthcare',
            'health': 'Healthcare',
            'medical': 'Healthcare',
            
            // Biotechnology & Life Sciences
            'pharmaceuticals': 'Biotechnology & Life Sciences',
            'pharma': 'Biotechnology & Life Sciences',
            'biotech': 'Biotechnology & Life Sciences',
            'biotechnology': 'Biotechnology & Life Sciences',
            
            // Education
            'education': 'Education',
            'school': 'Education',
            'university': 'Education',
            'colleges': 'Education',
            
            // Retail
            'retail': 'Retail',
            'e-commerce': 'Retail',
            
            // Manufacturing
            'manufacturing': 'Manufacturing',
            
            // Automotive
            'automotive': 'Automotive',
            'automotive/energy': 'Automotive',
            
            // Media & Entertainment
            'entertainment': 'Media & Entertainment',
            'media': 'Media & Entertainment',
            'social media': 'Media & Entertainment',
            'entertainment & technology': 'Media & Entertainment',
            
            // Transportation & Logistics
            'transportation': 'Transportation & Logistics',
            'logistics': 'Transportation & Logistics',
            
            // Hospitality & Tourism
            'hospitality': 'Hospitality & Tourism',
            'hotel': 'Hospitality & Tourism',
            'tourism': 'Hospitality & Tourism',
            
            // Food & Beverage Services
            'food': 'Food & Beverage Services',
            'restaurant': 'Food & Beverage Services',
            'food delivery': 'Food & Beverage Services',
            
            // Real Estate
            'real estate': 'Real Estate',
            
            // Energy
            'energy': 'Oil & Gas',
            
            // Consulting
            'consulting': 'Consulting',
            'professional services': 'Consulting',
            
            // Telecommunications
            'telecommunications': 'Telecommunications',
            'telecom': 'Telecommunications',
            'communications': 'Telecommunications',
            
            // Aerospace & Defense
            'aerospace': 'Aerospace & Defense',
            'aerospace/defense': 'Aerospace & Defense',
            'defense': 'Aerospace & Defense',
            
            // AI and Data
            'artificial intelligence': 'Artificial Intelligence',
            'ai': 'Artificial Intelligence',
            'data': 'Data & Analytics',
            'analytics': 'Data & Analytics',
            
            // Semiconductors and specialized tech
            'semiconductors': 'Technology',
            'networking': 'Technology',
            
            // Conglomerate
            'conglomerate': 'Startups / Venture Capital'
          };
          
          // Try to find an exact match first in the main list
          if (industries.includes(company.industry)) {
            this.formData.industry = company.industry;
            console.log(`Direct match found for industry: ${company.industry}`);
          } 
          // Then check the mapping (case insensitive)
          else {
            const industryLower = company.industry.toLowerCase();
            
            // Check for direct mapping
            if (industryMap[industryLower]) {
              this.formData.industry = industryMap[industryLower];
              console.log(`Mapped industry "${company.industry}" to "${this.formData.industry}" via direct map`);
            } 
            // Check for partial matches
            else {
              let matched = false;
              
              // Check each key for inclusion
              for (const [key, value] of Object.entries(industryMap)) {
                if (industryLower.includes(key) || key.includes(industryLower)) {
                  this.formData.industry = value;
                  console.log(`Mapped industry "${company.industry}" to "${value}" based on partial match "${key}"`);
                  matched = true;
                  break;
                }
              }
              
              // If no match found, fallback to "Technology"
              if (!matched) {
                this.formData.industry = 'Technology';
                console.log(`No matching industry found for "${company.industry}", defaulting to "Technology"`);
              }
            }
          }
        } else {
          console.log('No industry found for selected company');
          this.formData.industry = ''; // Reset to empty selection
        }
        
        // Store additional company data to link with the review
        this.formData.companyData = {
          name: company.name,
          normalizedName: company.normalizedName,
          industry: company.industry || '',
          employeeSize: company.employeeSize || '',
          logoURL: company.logoURL || ''
        };
        
        this.showCompanySuggestions = false;
      },
      
      delayHideCompanySuggestions() {
        // Delay hiding to allow click to register
        setTimeout(() => {
          this.showCompanySuggestions = false;
        }, 200);
      },
      
      handleLogoError(e) {
        // Replace broken image with a placeholder
        e.target.src = '/company-placeholder.png';
      },
      
      // Keyboard navigation for company suggestions
      handleKeyDown(e) {
        if (this.companySuggestions.length === 0) return;
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            this.selectedSuggestionIndex = 
              (this.selectedSuggestionIndex + 1) % this.companySuggestions.length;
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.selectedSuggestionIndex = 
              (this.selectedSuggestionIndex - 1 + this.companySuggestions.length) % 
              this.companySuggestions.length;
            break;
          case 'Enter':
            if (this.selectedSuggestionIndex >= 0) {
              e.preventDefault();
              this.selectCompany(this.companySuggestions[this.selectedSuggestionIndex]);
            }
            break;
          case 'Escape':
            this.showCompanySuggestions = false;
            break;
        }
      },
      
      nextStep() {
        if (this.currentStep < 3) {
          this.currentStep++;
        }
      },
      prevStep() {
        if (this.currentStep > 1) {
          this.currentStep--;
        }
      },
      addSkill() {
        if (this.newSkill.trim()) {
          this.formData.skills.push(this.newSkill.trim());
          this.newSkill = '';
        }
      },
      removeSkill(index) {
        this.formData.skills.splice(index, 1);
      },
      async submitForm() {
        try {
          // Basic validation
          if (!this.formData.companyName || !this.formData.industry || !this.formData.role || this.formData.rating === 0 || !this.formData.fullReview) {
            this.errorMessage = 'Please fill out all required fields';
            return;
          }
          
          this.submitting = true;
          this.errorMessage = '';
          
          // Get current user
          const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
          
          console.log('Current auth state:', !!auth.currentUser);
          
          // Create review object 
          const reviewData = {
            companyName: this.formData.companyName,
            role: this.formData.role,
            industry: this.formData.industry || '',
            rating: this.formData.rating,
            salary: this.formData.salary || '',
            fullReview: this.formData.fullReview,
            interviewDuration: this.formData.interviewDuration || '',
            responseTime: this.formData.responseTime || '',
            applicationStage: this.formData.applicationStage || '',
            skills: this.formData.skills || [],
            fairnessRating: this.formData.fairnessRating || 0,
            recommendationRating: this.formData.recommendationRating || 0,
            difficultyRating: this.formData.difficultyRating || 0,
            userId: userId,
            approved: true, // For testing purposes
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Add linked company data if available
          if (this.formData.companyData) {
            reviewData.linkedCompany = {
              name: this.formData.companyData.name,
              normalizedName: this.formData.companyData.normalizedName,
              industry: this.formData.companyData.industry || '',
              employeeSize: this.formData.companyData.employeeSize || '',
              logoURL: this.formData.companyData.logoURL || ''
            };
          }
          
          console.log('Attempting to save review:', reviewData);
          
          // Save to localStorage as a temporary workaround for permission issues
          try {
            // First try with Firestore
            const docRef = await addDoc(collection(db, 'reviews'), reviewData);
            console.log('Document written with ID:', docRef.id);
            this.currentStep = 4;
          } catch (firebaseError) {
            console.error('Firebase error:', firebaseError);
            
            // Fallback to localStorage if Firebase fails
            const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
            reviewData.id = 'local_' + Date.now();
            existingReviews.push(reviewData);
            localStorage.setItem('reviews', JSON.stringify(existingReviews));
            console.log('Review saved to localStorage as fallback');
            
            // Show warning but proceed to success
            this.errorMessage = 'Unable to save to cloud database. Your review was saved locally and will be synced later.';
            setTimeout(() => {
              this.currentStep = 4;
            }, 1500);
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          
          // More detailed error message
          if (error.code) {
            switch(error.code) {
              case 'permission-denied':
                this.errorMessage = 'Permission denied. Your review was saved locally instead.';
                break;
              case 'unavailable':
                this.errorMessage = 'The service is currently unavailable. Please check your connection.';
                break;
              default:
                this.errorMessage = `Error: ${error.message}`;
            }
          } else {
            this.errorMessage = `Error: ${error.message || 'Unknown error'}`;
          }
        } finally {
          this.submitting = false;
        }
      },
      finishReview() {
        // Reset form and navigate to companies page
        this.resetForm();
        this.router.push('/companies');
      },
      resetForm() {
        this.currentStep = 1;
        this.errorMessage = '';
        this.formData = {
          companyName: '',
          companyData: null,
          industry: '',
          role: '',
          rating: 0,
          salary: '',
          fullReview: '',
          interviewDuration: '',
          responseTime: '',
          applicationStage: '',
          skills: [],
          fairnessRating: 0,
          recommendationRating: 0,
          difficultyRating: 0
        };
      },
      // Add this new method to check for companies
      async checkCompaniesCollection() {
        try {
          console.log('Checking if companies collection exists and has data...');
          const companiesQuery = query(collection(db, 'companies'), limit(1));
          const snapshot = await getDocs(companiesQuery);
          
          if (snapshot.empty) {
            console.log('No companies found in the database. Will use local fallback data instead.');
            // Don't show any error message to the user
            // this.errorMessage = 'Please visit the Admin page to add company data for better suggestions.';
            
            // Optional: Seed automatically if no companies exist
            // Uncomment the below code to auto-seed
            /*
            console.log('Auto-seeding companies collection...');
            const result = await seedCompanies();
            if (result.success) {
              console.log(`Successfully added ${result.count} companies to the database.`);
              this.errorMessage = '';
            }
            */
          } else {
            console.log('Companies collection exists and has data.');
          }
        } catch (error) {
          console.error('Error checking companies collection:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .review-form {
    max-width: 600px;
    margin: 20px auto;
    padding: 25px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    font-family: 'League Spartan', sans-serif;
  }
  
  .form-step {
    animation: fadeIn 0.3s;
  }
  
  .form-group {
    text-align: left;
    align-items: left;
    margin-bottom: 10px;
  }

  h2{
    color:black;;
  }

  p {
    color: black;
  }
  
  h3 {
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    color: black;
    font-family: 'League Spartan', sans-serif;
  }
  
  /* Center-align only the star rating */
  .rating-container {
    display: flex;
    justify-content: center; /* Centers the star rating */
  }
  
  input, select, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f5f5f5;
    font-family: 'League Spartan', sans-serif;
  }
  
  /* Style for the industry dropdown */
  select {
    appearance: auto; /* Show the dropdown arrow */
    cursor: pointer;
    color: #333;
  }
  
  select option {
    padding: 8px;
    background-color: white;
    color: #333;
  }
  
  select option:first-child {
    color: #999; /* Lighter color for the placeholder */
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  .step-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    font-family: 'League Spartan', sans-serif;
  }
  
  .next-btn {
    background-color: #ff6b48;
    color: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 50%;
  }
  
  .back-btn {
    background-color: transparent;
    color: #666;
  }
  
  .submit-btn {
    background-color: #ff6b48;
    color: white;
    padding: 8px 25px;
    border-radius: 25px;
  }

  .submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .success-screen {
    text-align: center;
    padding: 20px 0;
  }
  
  .success-icon {
    margin-bottom: 0px;
  }
  
  .success-icon img {
    width: 150px;
    height: 135px;
  }
  
  .finish-btn {
    background-color: #ff6b48;
    color: white;
    padding: 10px 25px;
    border-radius: 25px;
    margin-top: 20px;
  }
  
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  
  .skill-tag {
    background-color: #f0f0f0;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  .remove-btn {
    background: none;
    border: none;
    margin-left: 5px;
    cursor: pointer;
    padding: 0 5px;
    font-size: 16px;
  }
  
  .error-message {
    color: #e74c3c;
    margin-top: 15px;
    text-align: center;
    font-weight: bold;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Autocomplete Styles */
  .autocomplete-container {
    position: relative;
    width: 100%;
  }
  
  .autocomplete-results {
    position: absolute;
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }
  
  .autocomplete-item {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: #333;
  }
  
  .autocomplete-item:hover,
  .autocomplete-item.highlighted {
    background-color: #f0f4f8;
  }
  
  .company-suggestion-item {
    display: flex;
    align-items: center;
  }
  
  .company-suggestion-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    margin-right: 10px;
  }
  
  .company-suggestion-details {
    display: flex;
    flex-direction: column;
  }
  
  .company-suggestion-name {
    font-weight: bold;
    font-size: 14px;
    color: #333;
  }
  
  .company-suggestion-industry {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
  </style>