<script setup>
import { ref } from 'vue';
import FeedbackForm from './FeedbackForm.vue';

const showFeedbackForm = ref(false);
function openFeedbackForm() { showFeedbackForm.value = true; }
function closeFeedbackForm() { showFeedbackForm.value = false; }
</script>

<template>
  <!-- Widget container -->
  <div class="widget">
    <h2>Have something to add?</h2>
    <button class="review-btn" @click="openFeedbackForm">
      Write a Review
    </button>
  </div>

  <!-- Feedback Form Modal -->
  <teleport to="body">
    <div v-if="showFeedbackForm" class="feedback-modal">
      <div class="modal-overlay" @click="closeFeedbackForm"></div>
      <div class="modal-content">
        <button class="close-btn" @click="closeFeedbackForm">×</button>
        <FeedbackForm />
      </div>
    </div>
  </teleport>
</template>

<style scoped>
/* 1) The widget “box” */
.widget {
  position: relative;        /* so children absolute‑position relative to it */
  background: #fff;
  border-radius: 20px;
  padding: 1rem;
  width: 220px;
  height: 100px;             /* give a bit more height to fit the button */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* push h2 up and button down */
  margin: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
}

/* 2) Header text */
h2 {
  font-family: 'League Spartan', sans-serif;
  font-size: 1.1rem;
  margin: 0;
  color: #333;
  align-content: center;
}

/* 3) Button pinned inside the widget */
.review-btn {
  align-self: flex;      /* push to the right */
  background-color: #f67c51;
  border: none;
  border-radius: 8px;
  font-family: 'League Spartan', sans-serif;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;
}

.review-btn:hover {
  background-color: #d4633a;
}

/* 4) Full‑screen, centered modal */
.feedback-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;               /* enable centering */
  align-items: center;         /* vertical center */
  justify-content: center;     /* horizontal center */
  z-index: 9999;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.modal-content {
  position: absolute;
  z-index: 3;
  max-width: 95%;
  width: 500px; 
  max-height: calc(100% - 20px);
  overflow-y: auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 5px 20px rgba(0,0,0);
  text-align: left;
}

.close-btn {
  position: absolute;
  color: black;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 999;
}

.close-btn:hover {
  color: #ff6b48;
}
</style>