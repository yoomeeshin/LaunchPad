<script setup>
import { ref, onMounted } from 'vue';
import { db, auth } from '@/firebase'; // Make sure auth is exported from your firebase.js
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';

const showReviewModal = ref(false);

// Profile data state
const profile = ref({
  university: "NUS",
  major: "Business Analytics",
  year: 0,
  gpa: 0,
  skills: "No Skills Listed",
});

const companies = ref([]);
const companyRec = ref({
  name: "placeholder-company",
  logo: "placeholder-logo"
});

const fallbackLogo = '/company-placeholder.png'; 

// Declare company refs
const company1 = ref(null);
const company2 = ref(null);
const company3 = ref(null);

async function fetchProfile() {
  const user = auth.currentUser;
  if (user) {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      profile.value = docSnap.data();
    } else {
      console.log("No such document!");
    }
  }
}

async function fetchCompanies() {
  const q = query(collection(db, 'companies'), orderBy('name'));
  const querySnapshot = await getDocs(q);
  companies.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

onMounted(async () => {
  console.log('Fallback logo path:', fallbackLogo); 
  await fetchProfile();
  await fetchCompanies();
  
  if (companies.value.length > 0) {
    companyRec.value = companies.value[Math.floor(Math.random() * companies.value.length)];
    const randomCompanies = [...companies.value].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    company1.value = randomCompanies[0];
    company2.value = randomCompanies[1];
    company3.value = randomCompanies[2];
  }

  profile.value = {
    ...profile.value,
    major: profile.value.major || "Undeclared",
    university: profile.value.university || "Unknown University",
    year: profile.value.year || 0,
    gpa: profile.value.gpa || 0,
    skills: profile.value.skills || "No skills listed"
  };
});


</script>

<template>
  <div class="widget">
    <h4>Since you're majoring in</h4> 
    <div class="title-header-major">
      <h1>{{ profile.major }}</h1>
    </div>
    <h4>You might be interested in</h4>
    
    <!-- COMPANY 1 -->
    <div v-if="company1" class="role-company">
      <h1>{{ company1.role || 'Business Intern' }}</h1>
      <div class="company-header flex items-center gap-4 mb-4">
        <img :src="company1.logoURL || fallbackLogo" 
        @error="e => e.target.src = fallbackLogo"
        alt="Company Logo" class="company-logo" />
        <div class="company-title">
          <h2 class="text-3xl font-bold">{{ company1.name }}</h2>
        </div>
      </div>
    </div>

    <!-- COMPANY 2 -->
    <div v-if="company2" class="role-company">
      <h1>{{ company2.role || 'Data Intern' }}</h1>
      <div class="company-header flex items-center gap-4 mb-4">
        <img :src="company2.logoURL || fallbackLogo" 
        @error="e => e.target.src = fallbackLogo"
        alt="Company Logo" class="company-logo" />
        <div class="company-title">
          <h2 class="text-3xl font-bold">{{ company2.name }}</h2>
        </div>
      </div>
    </div>

    <!-- COMPANY 3 -->
    <div v-if="company3" class="role-company">
      <h1>{{ company3.role || 'Strategy Intern' }}</h1>
      <div class="company-header flex items-center gap-4 mb-4">
        <img :src="company3.logoURL || fallbackLogo"
        @error="e => e.target.src = fallbackLogo"
        alt="Company Logo" class="company-logo" />
        <div class="company-title">
          <h2 class="text-3xl font-bold">{{ company3.name }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.widget {
  background: white;
  border-radius: 20px;
  padding: 1rem;
  width: 220px;
  height: 380px;
  position: flex;
  text-align: left;
  align-self: flex-start;
  z-index: 10;
  margin: 20px;
  margin-bottom: 20px;
}
.title-header-major {
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
}

.title-header-company {
  text-align: left;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 2px;
  gap: 0.5rem;
  
}

.role-company {
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
}
.company-header {
  color: black;
  font-family: 'League Spartan', sans-serif;
  font-size: 20px;
  line-height: 1;
  font-weight: 'semi-bold';
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  object-fit: contain;
  background-color: white;
  padding: 0.5px;
  display: flex;
}

h1 {
  font-size: 20px;
  color: #f67c51;
  font-family: 'League Spartan', sans-serif;
  line-height: 1.5;
  padding: 0 0;
  font-weight: 'semi-bold';
  text-align: left;
}

h2 {
  font-size: 20px;
  color: black;
  font-family: 'League Spartan', sans-serif;
  line-height: 1.5;
  font-weight: 'semi-bold';
  text-align: left;
}


h4 { 
  color: #000;
  font-family: 'Karla', sans-serif;
  font-size: 16px;
  text-align: left;
  align-items: left;
  line-height: 1.5;
}

</style>