<template>
  <div class="filter-search">
    <div class="header">
      <h1>
        <img src="../assets/logos/magnifying.png" alt="icon" class="icon">
        Explore Companies
      </h1>
      <h2>Filter Companies</h2>
      <h3>1-999 results</h3>
    </div>

    <div class="input">
      <h4>Location</h4>
      <select
        v-model="filters.location"
        @change="emitSearch"
        class="search-input"
        placeholder="Select Location"
      >
      <option value="">All Locations</option>
      <option value="Remote">Remote</option>
      <option value="On-Site">On-Site</option>
      <option value="Hybrid">Hybrid</option>
      <option value="Singapore">United Kingdom</option>
      <option value="United States">United States</option>
      <option value="Canada">Canada</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Australia">Australia</option>
      <option value="Germany">Germany</option>
      <option value="France">France</option>
      <option value="India">India</option>
      <option value="China">China</option>
      <option value="Japan">Japan</option>
      <option value="South Korea">South Korea</option>
      </select>
    </div>

    <div class="input">
      <h4>Job Title</h4>
      <input
        v-model="filters.jobTitle"
        @input="emitSearch"
        class="search-input"
        placeholder="Enter Title"
      />
    </div>

    <div class="input">
      <h4>Industries</h4>
      <select
        v-model="filters.industry"
        @change="emitSearch"
        class="search-input"
      >
        <option value="">All Industries</option>
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
        <option value="Other">Other</option>
      </select>
    </div>

    <div class="input">
      <h4>Rating</h4>
      <div class="star-rating rating"> <!-- added class="rating" here -->
        <i
          class="fas fa-star"
          v-for="star in 5"
          :key="star"
          :class="{'checked': star <= filters.rating}"
          @click="setRating(star)"
        ></i>
      </div>
    </div>

    <div class="input">
      <button class="search-btn" @click="emitSearch">
        Search
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        location: '',
        jobTitle: '',
        industry: '',
        rating: 0
      }
    };
  },
  methods: {
    setRating(star) {
      this.filters.rating = star;
      this.emitSearch();
    },
    emitSearch() {
      this.$emit('filter-changed', { ...this.filters });
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.filter-search {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 320px;
    height: 310px;
    text-align: left;
    align-items: left;
    z-index: 10;
    margin: 20px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h1 {
  font-size: 24px;
  font-family: 'League Spartan', sans-serif;
  font-weight: 'semi-bold';
}

h2 {
  font-size: 20px;
  font-family: 'League Spartan', sans-serif;
  font-weight: 'semi-bold';
}

h3 {
  font-size: 16px;
  font-family: 'Karla', sans-serif;
  color: #a0aec0;
}

h4 {
  font-size: 16px;
  font-family: 'Karla', sans-serif;
  color: white;
}

.input {
  font-size: 16px;
  font-family: 'Karla', sans-serif;
  color: white;
  align-items: left;
  margin-bottom: 10px;
}

.search-input {
  flex: 1;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  border: none;
  opacity: 0.8;
  font-size: 12px;
  font-family: 'Karla', sans-serif;
  color: #2d3748;
  background-color: #e2e8f0;
}

.star-rating {
  display: flex;
  justify-content: left;
}

.rating .fa-star {
  font-size: 1rem;
  color: #ddd;
  cursor: pointer;
}

.rating .fa-star.checked {
  color: #f5b301;
}

.rating .fa-star:hover,
.rating .fa-star:hover ~ .fa-star {
  color: #ddd; /* reset all after hovered */
}

.rating .fa-star:hover {
  color: #f5b301;
}

.rating .fa-star:hover ~ .fa-star {
  color: #ddd; /* dim later stars */
}

/* highlight all before hovered star */
.rating .fa-star:hover ~ .fa-star,
.rating .fa-star:hover ~ .fa-star.checked {
  color: #ddd;
}

.icon {
  margin-bottom: -40px;
  width: 65px;
  height: 92px;
}
.search-btn {
  background-color: #f67c51;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-family: 'League Spartan', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #e0a800;
}

</style>
