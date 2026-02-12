<!-- CHANGE COLOURS TO MATCH PRESETS  -->

<template>
    <section class="company-list">
      <router-link
        v-for="(company, index) in companies"
        :key="company.id || index"
        :to="{ name: 'CompanyReview', params: { companyName: company.name } }"
        class="company-card-link"
      >
        <div class="company-card">
          <div class="card-header">
            <img 
              :src="company.logoURL || company.logo || '/company-placeholder.png'" 
              :alt="company.name + ' logo'" 
              class="company-logo"
              @error="handleImageError"
            />
            <div class="header-text">
              <h2>{{ company.name }}</h2>
              <p class="sub-info">{{ formatEmployeeCount(company.employees) }}</p>
              <div class="rating">
                <span class="star-rating">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(company.rating) }">★</span>
                </span>
                <span class="rating-text">{{ formatRating(company.rating) }}</span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <!-- Industry information - always displayed -->
            <div class="company-details">
              <p class="detail-item">
                <span class="detail-label">Industry:</span> {{ normalizeIndustry(company.industry) || 'Technology' }}
              </p>
              <p v-if="company.yearFounded" class="detail-item">
                <span class="detail-label">Founded:</span> {{ company.yearFounded }}
              </p>
            </div>
            
            <!-- AI Summary -->
            <div class="ai-summary">
              <span>🤖 AI SUMMARY:</span>
              <p>{{ company.aiSummary || 'No AI summary available yet.' }}</p>
            </div>
            
            <!-- Review count indicator -->
            <div v-if="hasReviews(company)" class="review-count">
              {{ company.reviews ? company.reviews.length : 0 }} {{ company.reviews && company.reviews.length === 1 ? 'review' : 'reviews' }}
            </div>
          </div>
        </div>
      </router-link>
    </section>
  </template>
  
  <script>
  export default {
    name: "ScrollingProfiles",
    props: {
      companies: {
        type: Array,
        required: true
      }
    },
    methods: {
      // Format the rating to display with 1 decimal place
      formatRating(rating) {
        if (!rating && rating !== 0) return 'Not rated';
        return Number(rating).toFixed(1);
      },
      
      // Format employee count
      formatEmployeeCount(count) {
        if (!count || count === 'Unknown employee count') return 'Unknown employee count';
        
        // Check if count already includes the word "employees"
        if (count.toLowerCase().includes('employee')) {
          return count;
        }
        
        return `${count} employees`;
      },
      
      // Normalize industry to match new industry list
      normalizeIndustry(industry) {
        if (!industry) return 'Technology';
        
        // Map old industry names to new ones
        const industryMap = {
          'Information Technology (IT)': 'Technology',
          'Technology & E-commerce': 'Technology',
          'Technology & Social Media': 'Technology',
          'Technology & Software': 'Technology',
          'Technology & Consumer Electronics': 'Technology',
          'Technology & Consulting': 'Technology',
          'Software': 'Technology',
          'Software & CRM': 'Technology',
          'Social Media': 'Technology',
          'Professional Services': 'Consulting',
          'Energy': 'Oil & Gas',
          'Entertainment': 'Media & Entertainment',
          'Transportation': 'Transportation & Logistics',
          'Hospitality': 'Hospitality & Tourism',
          'Finance': 'Financial Services',
          'Pharmaceuticals': 'Biotechnology & Life Sciences'
        };
        
        return industryMap[industry] || industry;
      },
      
      // Handle image loading errors
      handleImageError(e) {
        e.target.src = '/company-placeholder.png';
      },
      
      // Check if company has reviews
      hasReviews(company) {
        return company.reviews && Array.isArray(company.reviews);
      }
    }
  }
  </script>
  
  <style scoped>
  h2 {
    font-family: 'League Spartan', sans-serif;
    font-weight: 'semi-bold';
    font-size: 20px;
    line-height: 0.5;
  }
  
  .company-list {
    /* Set a max-height to enable vertical scrolling if the list is long */
    max-height: 70vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .company-card-link {
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s;
  }
  
  .company-card-link:hover {
    transform: translateY(-5px);
  }
  
  /* Each company card */
  .company-card {
    background-color: #fff;
    color: #333;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    text-align: left;
    transition: box-shadow 0.2s;
  }
  
  .company-card:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  /* Header layout for the company card */
  .card-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 15px;
  }
  
  /* Company logo styling */
  .company-logo {
    width: 70px;
    height: 70px;
    object-fit: contain;
    border-radius: 12px;
    background-color: #f8f8f8;
    padding: 5px;
  }
  
  /* Text container in the header */
  .header-text h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
  
  .sub-info {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  /* Rating styling */
  .rating {
    display: flex;
    align-items: center;
  }
  
  .star-rating {
    display: inline-flex;
  }
  
  .star {
    color: #ddd;
    font-size: 18px;
    line-height: 0px;
  }
  
  .star.filled {
    color: #f67c51;
  }
  
  .rating-text {
    font-weight: bold;
    color: #f67c51;
  }
  
  /* Card body styling */
  .card-body p {
    margin: 0;
    line-height: 1;
    color: #333;
  }
  
  /* AI summary styling */
  .ai-summary {
    margin-top: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .ai-summary span {
    font-weight: bold;
    color: #ff914d;
    display: block;
    margin-bottom: 5px;
  }
  
  .ai-summary p {
    font-style: italic;
    color: #555;
  }
  
  /* Company details styling */
  .company-details {
    margin: 12px 0;
    padding: 8px 0;
    font-size: 0.95rem;
    color: #444;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  
  .detail-item {
    margin: 5px 0;
    line-height: 1.4;
  }
  
  .detail-label {
    font-weight: bold;
    color: #555;
    margin-right: 4px;
  }
  
  /* Review count */
  .review-count {
    margin-top: 15px;
    background-color: #f67c51;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    display: inline-block;
  }
  </style>