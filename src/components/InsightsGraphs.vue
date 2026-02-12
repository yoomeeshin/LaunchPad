<template>
  <div class="insights-grid">
    <!-- 1) Internship to Full‑Time Success (DUMMY DATA) -->
    <div class="insight-card">
      <h3 class="insight-title">Internship to Full‑Time Success</h3>
      <div class="chart-container">
        <Pie :data="successData" :options="successOptions" />
      </div>
    </div>

    <!-- 2) How Hard is it to Get This Job? (Bar chart) -->
    <div class="insight-card">
      <h3 class="insight-title">Offer Rate by Job Title</h3>
      <div class="chart-container">
        <Bar :data="offerRateData" :options="offerRateOptions" />
      </div>
    </div>

    <!-- 3) Candidate Gender Distribution (DUMMY DATA) -->
    <div class="insight-card">
      <h3 class="insight-title">Candidate Gender Distribution</h3>
      <div class="chart-container">
        <Pie :data="genderData" :options="genderOptions" />
      </div>
    </div>

    <!-- 4) Top Skills Employers Want -->
    <div class="insight-card">
      <h3 class="insight-title">Top Skills Employers Want</h3>
      <div class="chart-container">
        <Pie :data="skillsData" :options="skillsOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import { db } from '../firebase.js'
import { collection, getDocs } from 'firebase/firestore'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
)

// Receive props
const props = defineProps({
  insightStats: {
    type: Object,
    required: true,
    validator: o => typeof o.companyName === 'string'
  }
})

//
// 1) Dummy Internship Success Pie
//
const randomSuccessValues = (() => {
  const a = Math.random(), b = Math.random()
  const sum = a + b
  const s = Math.round((a / sum) * 100)
  return [s, 100 - s]
})()

const successData = computed(() => ({
  labels: ['Successful','Unsuccessful'],
  datasets: [{
    data: randomSuccessValues,
    backgroundColor: ['#f67c51','#ccc']
  }]
}))

const successOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: ctx => `${ctx.label}: ${ctx.parsed}%`
      }
    },
    legend: { position: 'top' }
  }
}

//
// 2) Offer Rate by Job Title (Horizontal Bar Chart)
//
const jobOfferData = ref([
  { title: 'Software Engineer', applied: 10, offered: 3, rate: 30 },
  { title: 'Data Scientist', applied: 12, offered: 2, rate: 17 },
  { title: 'UX Designer', applied: 8, offered: 1, rate: 13 },
  { title: 'Product Manager', applied: 15, offered: 1, rate: 7 }
]);

// Function to generate deterministic random number based on company name and seed
const getRandomNumberForCompany = (companyName, seed, min, max) => {
  if (!companyName) return Math.floor(min + (Math.random() * (max - min)));
  
  // Create a hash from the company name and seed
  let hash = 0;
  const text = companyName + seed;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Use the hash to generate a number between min and max
  const normalizedHash = Math.abs(hash) / 2147483647; // Normalize to 0-1 range
  return Math.floor(min + (normalizedHash * (max - min)));
};

onMounted(async () => {
  try {
    console.log("Initializing Offer Rate chart data");
    
    // Make sure we have a valid company name
    const companyName = props.insightStats?.companyName;
    if (!companyName) {
      console.log("No company name available, using default data");
      return; // Use default data
    }
    
    console.log(`Generating data for company: ${companyName}`);
    
    // Generate company-specific jobs as a fallback right away
    const fallbackJobs = generateCompanySpecificJobs(companyName);
    console.log("Generated fallback job data:", fallbackJobs);
    
    // Only set if we got something valid
    if (fallbackJobs && fallbackJobs.length > 0) {
      jobOfferData.value = fallbackJobs;
    }

    // Try to get real data if possible
    const target = companyName.toLowerCase().trim();
    console.log(`Fetching reviews for: ${target}`);
    const snap = await getDocs(collection(db,'reviews'));
    
    // Group reviews by job titles
    const jobTitles = {};
    let foundRoles = false;
    
    snap.forEach(doc => {
      const d = doc.data();
      if ((d.companyName || '').toLowerCase().trim() === target) {
        // Skip if no role specified
        if (!d.role) return;
        
        foundRoles = true;
        console.log(`Found role from reviews: ${d.role}`);
        
        // Initialize job title data if not exists
        if (!jobTitles[d.role]) {
          // Generate random applied and offered counts based on company name
          const applied = getRandomNumberForCompany(target, d.role + 'applied', 5, 50);
          const offered = getRandomNumberForCompany(target, d.role + 'offered', 1, applied);
          jobTitles[d.role] = { 
            applied, 
            offered,
            rate: Math.round((offered / applied) * 100)
          };
        }
      }
    });
    
    if (foundRoles) {
      console.log("Using roles from reviews");
      // Convert to array and sort
      const dataFromRoles = Object.entries(jobTitles).map(([title, stats]) => ({
        title,
        ...stats
      })).sort((a, b) => b.rate - a.rate);
      
      if (dataFromRoles.length > 0) {
        jobOfferData.value = dataFromRoles;
        console.log("Set job data from reviews:", dataFromRoles);
      }
    }
  } catch (error) {
    console.error('Error loading offer rate data:', error);
    // Already loaded fallback data at the beginning
  }
});

// Function to generate company-specific job titles and stats
const generateCompanySpecificJobs = (companyName) => {
  if (!companyName) return jobOfferData.value; // Return default data
  
  const normalizedName = companyName.toLowerCase().trim();
  console.log(`Generating job data for ${normalizedName}`);
  
  // Different job title sets based on industry hints in the company name
  const techJobs = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'];
  const financeJobs = ['Financial Analyst', 'Investment Banking Analyst', 'Risk Analyst', 'Portfolio Manager', 'Compliance Officer'];
  const healthcareJobs = ['Clinical Researcher', 'Medical Technician', 'Healthcare Analyst', 'Regulatory Affairs Specialist', 'Biomedical Engineer'];
  const retailJobs = ['Retail Manager', 'Store Operations Lead', 'Merchandising Specialist', 'Supply Chain Analyst', 'Inventory Manager'];
  const consultingJobs = ['Business Analyst', 'Management Consultant', 'Strategy Consultant', 'Operations Consultant', 'Technology Consultant'];
  
  // Select job pool based on company name
  let jobPool = techJobs; // Default
  
  if (normalizedName.includes('bank') || normalizedName.includes('capital') || normalizedName.includes('financial') || normalizedName.includes('invest')) {
    jobPool = financeJobs;
    console.log("Using finance job pool");
  } else if (normalizedName.includes('health') || normalizedName.includes('care') || normalizedName.includes('medical') || normalizedName.includes('bio')) {
    jobPool = healthcareJobs;
    console.log("Using healthcare job pool");
  } else if (normalizedName.includes('retail') || normalizedName.includes('store') || normalizedName.includes('shop')) {
    jobPool = retailJobs;
    console.log("Using retail job pool");
  } else if (normalizedName.includes('consult') || normalizedName.includes('advisory') || normalizedName.includes('group')) {
    jobPool = consultingJobs;
    console.log("Using consulting job pool");
  } else {
    console.log("Using tech job pool (default)");
  }
  
  // Always use 4 jobs for consistency
  const jobCount = Math.min(4, jobPool.length);
  const result = [];
  
  // Generate a simple deterministic sequence rather than complex randomization
  for (let i = 0; i < jobCount; i++) {
    const jobIndex = (normalizedName.length + i) % jobPool.length;
    const title = jobPool[jobIndex];
    
    // Generate deterministic stats
    const seed = normalizedName.length + title.length; 
    const baseApplied = 5 + (seed % 46); // 5-50 range
    const baseOffered = 1 + (seed % (baseApplied - 1)); // 1 to baseApplied-1
    
    result.push({
      title,
      applied: baseApplied,
      offered: baseOffered,
      rate: Math.round((baseOffered / baseApplied) * 100)
    });
  }
  
  // Sort by offer rate (highest first)
  return result.sort((a, b) => b.rate - a.rate);
};

const offerRateData = computed(() => {
  // Ensure we have data to display
  if (!jobOfferData.value || jobOfferData.value.length === 0) {
    // Default data if nothing is available
    return {
      labels: ['Software Engineer', 'Data Scientist', 'UX Designer', 'Product Manager'],
      datasets: [{
        label: 'Offer Rate (%)',
        data: [30, 17, 13, 7],
        backgroundColor: '#f67c51',
        borderColor: '#e65c31',
        borderWidth: 1
      }]
    };
  }
  
  // Limit to top 10 roles if there are too many
  const data = jobOfferData.value.slice(0, 10);
  
  return {
    labels: data.map(job => job.title),
    datasets: [{
      label: 'Offer Rate (%)',
      data: data.map(job => job.rate),
      backgroundColor: '#f67c51',
      borderColor: '#e65c31',
      borderWidth: 1
    }]
  };
});

const offerRateOptions = {
  indexAxis: 'y', // Horizontal bar chart
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 1000 // Slower animation to ensure rendering
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => {
          // Ensure we have data for this index
          if (!jobOfferData.value || !jobOfferData.value[ctx.dataIndex]) {
            return [`Offer Rate: ${ctx.raw}%`];
          }
          
          const job = jobOfferData.value[ctx.dataIndex];
          return [
            `Offer Rate: ${job.rate}%`,
            `Applications: ${job.applied}`,
            `Offers: ${job.offered}`
          ];
        }
      }
    }
  },
  scales: {
    x: { 
      beginAtZero: true,
      title: { display: true, text: 'Offer Rate (%)' },
      max: 100,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    y: { 
      title: { display: false },
      grid: {
        display: false
      }
    }
  }
};

//
// 3) Dummy Gender Distribution Pie with % tooltips
//
const randomGenderValues = (() => {
  const [a,b,c] = [Math.random(),Math.random(),Math.random()]
  const sum = a+b+c
  return [
    Math.round((a/sum)*100),
    Math.round((b/sum)*100),
    Math.round((c/sum)*100)
  ]
})()

const genderData = computed(() => ({
  labels: ['Male','Female','Non‑binary'],
  datasets: [{
    data: randomGenderValues,
    backgroundColor: ['#f67c51','#fdc1a1','#bbb']
  }]
}))

const genderOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: ctx => `${ctx.label}: ${ctx.parsed}%`
      }
    },
    legend: { position: 'top' }
  }
}

//
// 4) Top Skills Pie (real data, % tooltips)
//
const skills = props.insightStats.topSkills || {}
const skillLabels = Object.keys(skills).length
  ? Object.keys(skills)
  : ['No Data']
const skillValues = skillLabels.map(l => Number(skills[l])||0)
const totalSkills = skillValues.reduce((a,b)=>a+b,0) || 1

const skillsData = computed(() => ({
  labels: skillLabels,
  datasets: [{
    data: skillValues,
    backgroundColor: ['#f67c51','#fdc1a1','#bbb','#a1c4fd','#ff9a9e']
  }]
}))

const skillsOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: ctx => {
          const pct = ((ctx.parsed/totalSkills)*100).toFixed(1)
          return `${ctx.label}: ${pct}%`
        }
      }
    },
    legend: { position: 'top' }
  }
}
</script>

<style scoped>
.insights-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 2rem;
  margin-top: 2rem;
}
.insight-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.insight-title {
  font-size: 1.1rem;
  color: #f67c51;
  text-align: center;
  margin-bottom: 1rem;
}
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  position: relative;
}
canvas {
  max-width: 100%;
  height: auto !important;
}

@media (max-width: 768px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>


