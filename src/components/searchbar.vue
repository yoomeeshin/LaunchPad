<template>
  <div class="search-container">
    <input
      type="text"
      v-model="query"
      @input="emitSearch"
      class="search-input"
      placeholder="Search for companies by name..."
    />
    <button class="search-btn" @click="emitSearch">🔍</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')
const emit = defineEmits(['search'])

const emitSearch = () => {
  emit('search', query.value.trim())
}
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem auto;
  width: 100%;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  font-family: 'League Spartan', sans-serif;
  font-weight: 'semi-bold';
}

.search-btn {
  background-color: #f67c51;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
</style>
