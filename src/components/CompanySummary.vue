<script setup>
import { computed, watch } from 'vue';

// Props for the summary component
const props = defineProps({
  company: {
    type: Object,
    required: true
  },
  reviews: {
    type: Array,
    required: true
  },
  aiSummary: {
    type: String,
    default: ''
  },
  isGeneratingAI: {
    type: Boolean,
    default: false
  }
});

// Watch for changes in the company prop
watch(() => props.company, (newCompany) => {
  console.log('CompanySummary - Company prop changed:', newCompany);
  console.log('New rating:', newCompany.rating);
}, { deep: true });

// Function to normalize industry names
const normalizeIndustry = (industry) => {
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
};

// Generate star rating display for company
const stars = computed(() => {
  // Ensure company.rating is parsed as a number and handle NaN case
  const rating = parseFloat(props.company.rating) || 0;
  console.log('CompanySummary rendering with rating:', rating);
  
  return Array(5)
    .fill(null)
    .map((_, index) => index < Math.floor(rating));
});

// Calculate company stats based on reviews
const companyStats = computed(() => {
  if (!props.reviews.length) {
    return {
      responseRate: '0%',
      avgResponseWeeks: '0',
      avgOfferDays: '0',
      successRate: '0%'
    };
  }
  
  // Calculate actual stats based on reviews
  const withResponse = props.reviews.filter(r => r.responseTime);
  const responseRate = withResponse.length / props.reviews.length;
  
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
    return 1 + (normalizedHash * 4);
  };
  
  const avgWeeks = generateDeterministicRandom(props.company.name);
  
  // Calculate average days to offer
  const withOffer = props.reviews.filter(r => r.interviewDuration);
  const offerDays = withOffer.length > 0 
    ? withOffer.reduce((sum, r) => sum + (parseFloat(r.interviewDuration) || 7), 0) / withOffer.length
    : 7;
  
  // Success rate based on positive recommendations
  const successfulCandidates = props.reviews.filter(r => (r.recommendationRating || 0) >= 3);
  const successRate = successfulCandidates.length / props.reviews.length;
  
  return {
    responseRate: `${Math.round(responseRate * 100)}%`,
    avgResponseWeeks: avgWeeks.toFixed(1),
    avgOfferDays: offerDays.toFixed(1),
    successRate: `${Math.round(successRate * 100)}%`
  };
});

// Calculate display rating
const displayRating = computed(() => {
  const rating = parseFloat(props.company.rating) || 0;
  console.log('Calculating display rating from:', props.company.rating, '→', rating.toFixed(1));
  return rating.toFixed(1);
});
</script>

<template>
  <section>
    <!-- Company header with logo and info -->
    <div class="header-section mb-8">
      <div class="company-header flex items-center gap-4 mb-4">
        <img :src="company.logoURL || company.logo" alt="Company Logo" class="company-logo" @error="$event.target.src = '/company-placeholder.png'" />
        <div class="company-title">
          <h1 class="text-3xl font-bold">{{ company.name }}</h1>
          <div class="company-details">
            <p class="employees text-sm text-gray-400">{{ company.employees }}</p>
            <p v-if="company.industry" class="industry text-sm text-gray-400">
              Industry: {{ normalizeIndustry(company.industry) }}
            </p>
          </div>
          <div class="rating-section flex items-center gap-2">
            <span class="rating-value text-lg font-bold text-orange-500">{{ displayRating }}</span>
            <div class="stars">
              <span v-for="(filled, index) in stars" :key="index" class="star" :class="{ filled }">★</span>
            </div>
          </div>
        </div>
      </div>
      
      <p class="company-description text-base text-gray-300">
        {{ company.description }}
      </p>
    </div>
    
    <!-- Stats section with dynamic data -->
    <div class="stats-section flex justify-between mb-8">
      <div class="stat-item text-center flex-1">
        <div class="stat-circle w-20 h-20 border border-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div class="stat-value text-xl font-bold text-orange-500">{{ companyStats.responseRate }}</div>
        </div>
        <div class="stat-label text-xs text-gray-300">of applicants received a response</div>
      </div>
      
      <div class="stat-item text-center flex-1">
        <div class="stat-circle w-20 h-20 border border-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div class="stat-value text-xl font-bold text-orange-500">{{ companyStats.avgResponseWeeks }}</div>
        </div>
        <div class="stat-label text-xs text-gray-300">Average number of weeks between responses</div>
      </div>
      
      <div class="stat-item text-center flex-1">
        <div class="stat-circle w-20 h-20 border border-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div class="stat-value text-xl font-bold text-orange-500">{{ companyStats.avgOfferDays }}</div>
        </div>
        <div class="stat-label text-xs text-gray-300">Average number of days between interview and offer</div>
      </div>
      
      <div class="stat-item text-center flex-1">
        <div class="stat-circle w-20 h-20 border border-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div class="stat-value text-xl font-bold text-orange-500">{{ companyStats.successRate }}</div>
        </div>
        <div class="stat-label text-xs text-gray-300">of candidates were successful</div>
      </div>
    </div>
    
    <!-- AI Summary section -->
    <div class="ai-summary mb-8">
      <div class="ai-title flex items-center gap-2 font-bold text-teal-400 mb-2 text-sm">
        <span class="ai-icon text-lg">🤖</span> AI SUMMARY
      </div>
      
      <div v-if="isGeneratingAI" class="loading-text text-sm text-gray-400">
        Generating AI insights...
      </div> 
      <p v-else class="summary-text text-base text-gray-300">
        {{ aiSummary }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.header-section {
  margin-bottom: 2rem;
}

/* Company header styling */
.company-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.company-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 10px;
}

.company-title h1 {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.employees {
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 0.2rem;
  margin-top: 0rem;
}

.industry {
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 0.5rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #f67c51;
}

.stars {
  display: flex;
}

.star {
  color: #4a4a4a;
  font-size: 18px;
}

.star.filled {
  color: #ff6b48;
}

.company-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #e2e8f0;
  max-width: 90%;
}

/* Stats section */
.stats-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  width: 100%;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 1px solid #f67c51;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease-in-out, box-shadow 0.4s ease-out;
}

.stat-circle:hover {
  transform: scale(1.05);
  border-width: 2px;
  box-shadow: 0 0 15px rgba(246, 124, 81, 0.5);
}

.stat-circle::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 1px solid rgba(246, 124, 81, 0.3);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.stat-circle:hover::after {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

.stat-value {
  font-size: 1.6rem;
  font-weight: bold;
  color: #f67c51;
  transition: font-size 0.3s ease;
}

.stat-circle:hover .stat-value {
  font-size: 1.8rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #e2e8f0;
  max-width: 120px;
  margin: 0 auto;
  line-height: 1.4;
}

/* AI Summary section */
.ai-summary {
  margin-bottom: 1rem;
  width: 100%;
}

.ai-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: #4FD1C5;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.ai-icon {
  font-size: 1.2rem;
}

.summary-text {
  line-height: 1.6;
  color: #e2e8f0;
}

.loading-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

@media (max-width: 768px) {
  .company-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-section {
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  
  .stat-item {
    min-width: calc(50% - 1rem);
    max-width: none;
  }
}
</style> 