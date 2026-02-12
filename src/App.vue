<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Signup from '@/components/Signup.vue'
import SignInModal from '@/components/SignInModal.vue'
import UserProfileModal from '@/components/UserProfileModal.vue'
import CompanyReviewForm from '@/components/FeedbackForm.vue'
import StarRating from '@/components/StarRating.vue'
import contactFooter from '@/components/contactFooter.vue'
import { onAuthStateChange, logoutUser, loadUserProfile } from '@/utils/auth'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

const showSignInModal = ref(false)
const showSignup = ref(false)
const showProfileForm = ref(false)
const showDropdown = ref(false)
const user = ref(null)
const registrationData = ref(null)
const loading = ref(true)
const firebaseError = ref(null)
const router = useRouter()
const route = useRoute()

let dropdownTimeout

const handleMouseEnter = () => {
  clearTimeout(dropdownTimeout)
  showDropdown.value = true
}

const handleMouseLeave = () => {
  dropdownTimeout = setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

onMounted(async () => {
  try {
    console.log('Firebase initialized with config:', auth.app.options.projectId);
    console.log('Firebase auth initialized:', !!auth);
    console.log('Firebase Firestore initialized:', !!db);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    firebaseError.value = error.message;
  }

  const unsubscribe = onAuthStateChange(async (authUser) => {
    try {
      loading.value = true
      if (authUser) {
        user.value = authUser
        if (authUser.emailVerified || authUser.email.toLowerCase() === 'testuser@test.com') {
          await loadUserProfile(authUser.uid)
        }
      } else {
        user.value = null
      }
    } catch (error) {
      console.error('Auth listener error:', error)
    } finally {
      loading.value = false
    }
  })

  return () => unsubscribe()
})

function handleSignup(data) {
  showSignup.value = false
  registrationData.value = data
  showProfileForm.value = true
}

function handleProfileCompleted(userData) {
  showProfileForm.value = false
  user.value = userData
  router.push('/companies')
}

function handleLoggedIn(userData) {
  user.value = userData
  showSignInModal.value = false
  router.push('/companies')
}

async function handleLogout() {
  try {
    await logoutUser()
    user.value = null
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const isAuthenticated = computed(() => {
  if (user.value && user.value.email && user.value.email.toLowerCase() === 'testuser@test.com') {
    return true
  }
  return !!user.value && user.value.emailVerified
})
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div id = "app-logo">
    <img src="/logos/launchpad.png" alt="Logo" />
  </div>
  <div>
    <!-- BACKGROUND IMAGE -->
    <div class="gradient"></div>
    <img class="bg-img" src="@/assets/pexels-pixabay-47367.jpg" alt="moon image" />

    <!-- FIREBASE ERROR NOTIFICATION -->
    <div v-if="firebaseError" class="firebase-error">
      <p>Firebase connection error: {{ firebaseError }}</p>
      <button @click="firebaseError = null" class="close-error">×</button>
    </div>

    <!-- NAVIGATION BAR -->
    <nav id="main-nav">
      <div class="nav-container">
        <div class="nav-links">
          <!-- Show Home only if NOT signed in -->
          <router-link v-if="!isAuthenticated" to="/" exact-active-class="active-link">Home</router-link>
          <router-link to="/companies" exact-active-class="active-link">Companies</router-link>
        </div>

        <!-- PROFILE ICON & DROPDOWN -->
        <div 
          class="profile-container"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
        <img
          src="/profile-icon.png"
          alt="Profile"
          @click="isAuthenticated ? router.push('/profile') : showSignInModal = true"
          class="profile-icon"
        />
          <div v-if="isAuthenticated && showDropdown" class="profile-dropdown">
            <div class="user-info">
              <p class="user-email">{{ user?.email || 'User' }}</p>
            </div>
            <hr />
            <div class="dropdown-items">
              <div class="dropdown-item" @click="router.push('/profile')">My Profile</div>
              <div class="dropdown-item" @click="handleLogout">Logout</div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- MAIN HERO SECTION -->
    <div v-if="isHome" class="main-content">
      <h1>Your Career. <br /> Your Mission.</h1>
      <p>
        Embark on a journey beyond the ordinary. Read reviews, get insights, and chart your path to success.
        Your next great career move starts here.
      </p>
      <button 
        class="start-mission-btn" 
        @click="isAuthenticated ? router.push('/companies') : showSignInModal = true"
      >
        {{ isAuthenticated ? 'View Companies' : 'Start Your Mission' }}
      </button>
    </div>

    <!-- LOADING SPINNER -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- ROUTER VIEW -->
    <router-view />

    <!-- MODALS -->
    <SignInModal
      v-if="showSignInModal"
      :show="showSignInModal"
      @close="showSignInModal = false"
      @needAccount="showSignup = true; showSignInModal = false"
      @loggedIn="handleLoggedIn"
    />
    <Signup
      :show="showSignup"
      @close="showSignup = false"
      @showProfile="handleSignup"
    />
    <UserProfileModal
      :show="showProfileForm"
      :registration-data="registrationData"
      @close="showProfileForm = false"
      @registered="handleProfileCompleted"
    />
  </div>
</template>

<style scoped>
#main-nav {
  font-family: 'League Spartan';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  color: white;
  padding: 20px 0;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .profile-container {
    margin-top: 10px;
  }
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 5px 15px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: inline-block;
}

.nav-links a:hover, 
.nav-links a.active-link {
  color: #f67c51;
}

.profile-container {
  position: relative;
}

.profile-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  margin-top: 10px;
  overflow: hidden;
  z-index: 999;
  transition: opacity 0.2s ease;
}

.user-info {
  padding: 15px;
  background-color: #f8f9fa;
}

.user-email {
  font-size: 0.85rem;
  color: #333;
  margin: 0;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
}

.dropdown-items {
  padding: 5px 0;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  color: #333;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f67c51;
  color: white;
}

.main-content {
  text-align: center;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  color: white;
  z-index: 2;
}

.main-content h1 {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1.5;
}

.main-content p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.start-mission-btn {
  background-color: #f67c51;
  color: white;
  font-weight: bold;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.start-mission-btn:hover {
  background-color: #d4633a;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f67c51;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.firebase-error {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-error {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#app-logo {
  position: absolute;
  top: 20px;
  left: 80px;
  height: 10px;
  width: 10px;
  transform: scale(10%) rotate(45deg);
  z-index: 10000;
}
</style>
