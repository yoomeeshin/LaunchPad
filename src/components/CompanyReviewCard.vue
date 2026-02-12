<script setup>
import { ref, computed } from 'vue';

// Props for the review card
const props = defineProps({
  review: {
    type: Object,
    required: true
  }
});

// Log review data for debugging
console.log('CompanyReviewCard received:', 
  props.review?.id || 'no-id', 
  props.review?.rating || 'no-rating',
  'createdAt:', props.review?.createdAt);

// Generate stars array for a rating
const stars = computed(() => {
  return Array(5)
    .fill(null)
    .map((_, index) => index < Math.floor(props.review?.rating || 0));
});

// Format date helper function
const formatDate = (date) => {
  if (!date) return '';
  
  // Handle different date formats
  let validDate;
  
  if (date instanceof Date) {
    validDate = date;
  } else {
    try {
      validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        return 'Invalid Date';
      }
    } catch (e) {
      return 'Invalid Date';
    }
  }
  
  return validDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="review-card">
    <div class="review-header">
      <div class="review-rating">
        {{ review?.rating ? review.rating.toFixed(1) : '0.0' }}
        <span class="stars-display ml-2">
          <span v-for="(filled, index) in stars" :key="index" 
            class="star" :class="{ filled }">★</span>
        </span>
      </div>
      <div class="review-date">
        {{ formatDate(review?.createdAt) }}
      </div>
    </div>
    
    <h2 class="review-title">{{ review?.role || 'Unnamed Role' }}</h2>
    
    <p class="review-text">
      {{ review?.fullReview || 'No review content available.' }}
    </p>
    
    <!-- Skills section if available -->
    <div v-if="review?.skills && review.skills.length > 0" class="skills-section">
      <div class="skills-header">
        <h3 class="skills-heading">Skills</h3>
      </div>
      <div class="skills-tags">
        <span v-for="(skill, index) in review.skills" :key="index" class="skill-tag">
          {{ skill }}
        </span>
      </div>
    </div>
    
    <!-- Interview info if available -->
    <div v-if="review?.interviewDuration || review?.responseTime || review?.salary" class="interview-info">
      <div v-if="review?.interviewDuration" class="interview-meta">
        <span class="meta-label">Interview duration:</span>
        {{ review.interviewDuration.replace('_', ' ') }}
      </div>
      <div v-if="review?.responseTime" class="interview-meta">
        <span class="meta-label">Response time:</span>
        {{ review.responseTime.replace('_', ' ') }}
      </div>
      <div v-if="review?.salary" class="interview-meta">
        <span class="meta-label">Salary:</span>
        {{ review.salary }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(200, 200, 200, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Global fix for any blue background */
.review-card :deep(.skills-label),
.review-card :deep(.skills-heading),
.review-card :deep(.skills-section h3) {
  background-color: transparent !important;
  color: #333 !important;
}

.review-card:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-rating {
  font-weight: bold;
  color: #f67c51;
  font-size: 1.1rem;
}

.stars-display {
  font-size: 1.1rem;
}

.star {
  color: #d1d1d1;
  font-size: 18px;
}

.star.filled {
  color: #ff6b48;
}

.review-date {
  font-size: 0.9rem;
  color: #777;
}

.review-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.review-text {
  margin: 0 0 1.5rem 0;
  line-height: 1.7;
  font-size: 0.95rem;
  color: #444;
}

.skills-section {
  margin-bottom: 1.5rem;
  background-color: transparent;
  padding: 0;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  display: inline-block;
  background-color: rgba(255, 107, 72, 0.2);
  color: #e85d39;
  border-radius: 50px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background-color: rgba(255, 107, 72, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.skills-heading {
  color: #333;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  border-bottom: 2px solid #f67c51;
  margin-bottom: 12px;
  padding-bottom: 3px;
  background-color: transparent;
}

.review-card h3.skills-heading {
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 0 12px 0 !important;
}

.interview-info {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.interview-meta {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 0.6rem;
  display: flex;
  align-items: baseline;
}

.meta-label {
  font-weight: 700;
  color: #f67c51;
  margin-right: 0.5rem;
  min-width: 130px;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.skills-header {
  background-color: transparent;
  padding: 0;
  margin-bottom: 8px;
}
</style> 