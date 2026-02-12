<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

import Signup from '@/components/Signup.vue';
import SignInModal from '@/components/SignInModal.vue';
import UserProfileModal from '@/components/UserProfileModal.vue';

const showSignInModal = ref(false);
const showSignup = ref(false);
const showProfileForm = ref(false);

const router = useRouter();
const route = useRoute();

function handleSignedUp() {
  showSignup.value = false;
  showProfileForm.value = true;
}

const isHome = computed(() => route.path === '/');

// ✅ Redirect to /companies if already signed in
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user && route.path === '/') {
      router.push('/companies');
    }
  });
});
</script>

<template>
  <div>
    <!-- GLOBAL BACKGROUND -->
    <div class="gradient"></div>
    <img class="bg-img" src="@/assets/pexels-pixabay-47367.jpg" alt="moon image" />

    <!-- MAIN CONTENT (ONLY ON HOME PAGE) -->
    <div class="main-content">
      <h1>Your Career. <br /> Your Mission.</h1>
      <p>
        Embark on a journey beyond the ordinary. Read reviews, get insights, and chart your path to success.
        Your next great career move starts here.
      </p>
      <button class="start-mission-btn" @click="showSignInModal = true">Start Your Mission</button>
    </div>

    <!-- MODALS -->
    <SignInModal
      v-if="showSignInModal"
      :show="showSignInModal"
      @close="showSignInModal = false"
      @needAccount="showSignup = true"
    />

    <Signup
      :show="showSignup"
      @close="showSignup = false"
      @signedUp="handleSignedUp"
    />

    <UserProfileModal
      :show="showProfileForm"
      @close="showProfileForm = false"
    />
  </div>
</template>

<style scoped>
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
</style>
