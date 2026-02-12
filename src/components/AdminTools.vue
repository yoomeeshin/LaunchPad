<template>
  <div class="admin-tools">
    <h2>Admin Tools</h2>
    
    <div class="admin-section">
      <h3>Database Management</h3>
      
      <div class="button-group">
        <button @click="seedCompanies" :disabled="loading.seed" class="admin-button">
          {{ loading.seed ? 'Seeding Companies...' : 'Seed Autocomplete Companies' }}
        </button>
        <span v-if="messages.seed" :class="{'success-message': !errors.seed, 'error-message': errors.seed}">
          {{ messages.seed }}
        </span>
      </div>
      
      <div class="help-text">
        <p>This will add {{ companiesCount }} top companies to the database for autocomplete suggestions when users fill out review forms.</p>
      </div>
    </div>
    
    <div class="stats-section" v-if="stats.companies || stats.reviews">
      <h3>Database Stats</h3>
      <ul>
        <li>Companies: {{ stats.companies || 0 }}</li>
        <li>Reviews: {{ stats.reviews || 0 }}</li>
      </ul>
      
      <div v-if="stats.companies > 0" class="companies-preview">
        <h4>Sample Companies</h4>
        <div class="companies-list">
          <div v-for="(company, index) in previewCompanies" :key="index" class="company-preview-item">
            <img 
              v-if="company.logoURL" 
              :src="company.logoURL" 
              class="company-preview-logo"
              @error="$event.target.src = '/company-placeholder.png'"
            >
            <div class="company-preview-details">
              <span class="company-preview-name">{{ company.name }}</span>
              <span v-if="company.industry" class="company-preview-industry">{{ company.industry }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { seedCompanies } from '@/utils/seedCompanies';
import { db } from '@/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import topCompanies from '@/utils/companiesData';

export default {
  name: 'AdminTools',
  setup() {
    const loading = ref({
      seed: false,
      stats: false
    });
    
    const messages = ref({
      seed: ''
    });
    
    const errors = ref({
      seed: false
    });
    
    const stats = ref({
      companies: 0,
      reviews: 0
    });
    
    const previewCompanies = ref([]);
    
    const companiesCount = computed(() => {
      return topCompanies.length;
    });
    
    // Seed the database with companies for autocomplete
    const handleSeedCompanies = async () => {
      try {
        loading.value.seed = true;
        messages.value.seed = '';
        errors.value.seed = false;
        
        const result = await seedCompanies();
        
        if (result.success) {
          messages.value.seed = result.message;
        } else {
          messages.value.seed = `Error: ${result.message}`;
          errors.value.seed = true;
        }
        
        // Refresh stats
        fetchStats();
      } catch (error) {
        console.error('Error seeding companies:', error);
        messages.value.seed = `Error: ${error.message || 'Failed to seed companies'}`;
        errors.value.seed = true;
      } finally {
        loading.value.seed = false;
      }
    };
    
    // Get database stats and preview data
    const fetchStats = async () => {
      try {
        loading.value.stats = true;
        console.log('Fetching database stats...');
        
        // Get company count
        console.log('Counting companies in Firestore...');
        const companiesSnapshot = await getDocs(collection(db, 'companies'));
        stats.value.companies = companiesSnapshot.size;
        console.log(`Found ${companiesSnapshot.size} companies in Firestore`);
        
        // Get company preview data (first 5 companies)
        if (companiesSnapshot.size > 0) {
          const previewQuery = query(collection(db, 'companies'), limit(5));
          const previewSnapshot = await getDocs(previewQuery);
          const companies = [];
          
          previewSnapshot.forEach(doc => {
            companies.push(doc.data());
          });
          
          previewCompanies.value = companies;
        }
        
        // Get review count
        console.log('Counting reviews in Firestore...');
        const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
        stats.value.reviews = reviewsSnapshot.size;
        console.log(`Found ${reviewsSnapshot.size} reviews in Firestore`);
      } catch (error) {
        console.error('Error fetching stats:', error);
        console.error('Error details:', error.code, error.message);
      } finally {
        loading.value.stats = false;
      }
    };
    
    onMounted(() => {
      fetchStats();
    });
    
    return {
      loading,
      messages,
      errors,
      stats,
      previewCompanies,
      companiesCount,
      seedCompanies: handleSeedCompanies
    };
  }
};
</script>

<style scoped>
.admin-tools {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  margin: 20px auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

h3 {
  color: #555;
  font-size: 1.1rem;
  margin-top: 20px;
  margin-bottom: 10px;
}

.admin-section {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.admin-button {
  background-color: #f67c51;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.admin-button:hover:not(:disabled) {
  background-color: #e05a38;
}

.admin-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  color: #4caf50;
}

.error-message {
  color: #f44336;
}

.stats-section {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

.stats-section ul {
  list-style-type: none;
  padding-left: 0;
  margin: 10px 0;
}

.stats-section li {
  margin-bottom: 5px;
  font-weight: bold;
}

.companies-preview {
  margin-top: 20px;
}

.companies-preview h4 {
  margin-top: 15px;
  margin-bottom: 10px;
  color: #444;
}

.companies-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.company-preview-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.company-preview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.company-preview-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
  margin-right: 12px;
}

.company-preview-details {
  display: flex;
  flex-direction: column;
}

.company-preview-name {
  font-weight: bold;
  font-size: 14px;
}

.company-preview-industry {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.help-text {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #f67c51;
}
</style> 