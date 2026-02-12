<script setup>
import { ref, watch } from 'vue';
import CompanyReviewCard from '@/components/CompanyReviewCard.vue';

// Props for the reviews section
const props = defineProps({
  reviews: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Sort options
const sortOption = ref('recent');
const reviews = ref([]);

// Watch for changes in the reviews prop
watch(
  () => props.reviews,
  (newReviews) => {
    reviews.value = [...newReviews];
    changeSortOrder(sortOption.value);
  },
  { immediate: true }
);

// Change sort order
function changeSortOrder(option) {
  sortOption.value = option;
  if (option === 'recent') {
    reviews.value.sort((a, b) => {
      const dateA =
        a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
      const dateB =
        b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  } else if (option === 'highest') {
    reviews.value.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    reviews.value.sort((a, b) => (a.rating || 0) - (b.rating || 0));
  }
}
</script>

<template>
  <div class="reviews-section mb-8">
    <!-- header + sort -->
    <div class="review-top flex justify-between items-center mb-4">
      <h3 class="review-count text-lg font-bold text-orange-500">
        {{ reviews.length }} {{ reviews.length === 1 ? 'Review' : 'Reviews' }}
        <span
          v-if="reviews.length === 0"
          style="font-size:0.8rem; color:#aaa;"
        >
          (No reviews found)
        </span>
      </h3>
      <div class="sort-by">
        <span>Sort by: </span>
        <select
          class="sort-select"
          v-model="sortOption"
          @change="changeSortOrder(sortOption)"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>
    </div>

    <!-- no reviews -->
    <div v-if="reviews.length === 0" class="no-reviews">
      <p>No reviews available for this company yet.</p>
    </div>

    <!-- scrollable list -->
    <div v-else class="reviews-list-wrapper">
      <div class="reviews-list">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="review-container mb-8 border-b border-gray-700 pb-4"
        >
          <CompanyReviewCard :review="review" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviews-section {
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 0;
}

.review-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-count {
  font-weight: bold;
  color: #f67c51;
  font-size: 1.1rem;
}

.sort-by {
  color: #a0aec0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.sort-select {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
  outline: none;
}

.sort-select option {
  background-color: #1a1a1a;
  color: white;
}

/* UPDATED: force wrapper to be tall enough for ~3 cards, then scroll */
.reviews-list-wrapper {
  max-height: 900px;    /* ~3 cards tall — tweak if your cards differ */
  overflow-y: auto;
  padding-right: 0.5rem; /* avoid content hiding under scrollbar */
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-container {
  width: 100%;
}

.no-reviews {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  background: rgba(30, 30, 40, 0.7);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}
</style>
