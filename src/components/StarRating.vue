<template>
    <div class="star-rating">
      <span 
        v-for="star in 5" 
        :key="star" 
        @click="setRating(star)" 
        @mouseover="hover = star"
        @mouseleave="hover = 0"
        class="star"
        :class="{ 'filled': star <= (hover || modelValue) }"
      >
        ★
      </span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StarRating',
    props: {
      modelValue: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        hover: 0
      };
    },
    methods: {
      setRating(rating) {
        this.$emit('update:modelValue', rating);
      }
    }
  }
  </script>
  
  <style scoped>
  .star-rating {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  .star {
    font-size: 24px;
    color: #dddddd;
    cursor: pointer;
    margin-right: 5px;
    transition: color 0.2s ease;
  }
  .star.filled {
    color: #ff6b48; /* Orange-red color as shown in screenshots */
  }
  </style>