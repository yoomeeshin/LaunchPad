<template>
  <div class="modal-backdrop" v-if="show">
    <div class="modal">
      <button class="close-btn" @click="closeModal">✕</button>

      <h2 class="modal-title">Sign Up</h2>

      <form @submit.prevent="handleSignup">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your university email"
          required
        />
        <button 
          type="button" 
          class="verify-btn" 
          @click="verifyEmail" 
          :disabled="loading || verificationSent"
        >
          {{ loading ? 'Processing...' : 'Verify' }}
        </button>

        <p v-if="verificationSent" class="message success">
          <span v-if="email.toLowerCase() === 'testuser@test.com'">
            Test user account - email verification bypassed.<br />
            <small>You can continue to the next step.</small>
          </span>
          <span v-else>
            A verification email has been sent to your email.<br />
            <a href="#" @click.prevent="resendVerification">Didn't receive it?</a><br />
            <small>Please verify your email before continuing.</small>
          </span>
        </p>

        <label>Password</label>
        <input 
          type="password" 
          v-model="password" 
          placeholder="Must include uppercase, lowercase, number (min. 8 chars) or '123456' for test user" 
          required 
        />

        <label>Confirm Password</label>
        <input 
          type="password" 
          v-model="confirmPassword" 
          placeholder="Re-enter your password"
          required 
        />

        <p v-if="error" class="error">{{ error }}</p>

        <button 
          type="submit" 
          class="verify-btn" 
          :disabled="loading || !verificationSent"
        >
          {{ loading ? 'Processing...' : 'Continue to Profile Setup' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { auth } from '@/firebase'
import { 
  registerUser, 
  isUniversityEmail, 
  isStrongPassword,
  sendEmailVerification
} from '@/utils/auth'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'signedUp', 'showProfile'])

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const verificationSent = ref(false)
let currentUser = null

const closeModal = () => {
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  error.value = ''
  verificationSent.value = false
  emit('close')
}

const verifyEmail = async () => {
  error.value = ''
  
  if (!email.value) {
    error.value = 'Please enter your email address.'
    return
  }
  
  if (!isUniversityEmail(email.value)) {
    error.value = 'Please use a valid university email.'
    return
  }
  
  // Special handling for test user
  if (email.value.toLowerCase() === 'testuser@test.com') {
    verificationSent.value = true
    return
  }
  
  loading.value = true
  
  try {
    // Use a temporary password for initial account creation
    const tempPassword = 'TempPassword' + Math.random().toString(36).slice(2) + '!1A'
    const userCredential = await registerUser(email.value, tempPassword)
    currentUser = userCredential.user
    verificationSent.value = true
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already registered. Please sign in instead.'
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

const resendVerification = async () => {
  if (!currentUser) {
    error.value = 'Please verify your email first.'
    return
  }
  
  loading.value = true
  try {
    await sendEmailVerification(currentUser)
    error.value = ''
    // Show success message
    alert('Verification email resent. Please check your inbox.')
  } catch (err) {
    error.value = 'Failed to resend verification email. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  error.value = ''
  
  if (!verificationSent.value) {
    error.value = 'Please verify your email first.'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  
  if (!isStrongPassword(password.value, email.value)) {
    error.value = 'Password must be at least 8 characters and include uppercase, lowercase, and numbers.'
    return
  }
  
  loading.value = true
  
  try {
    // Move to the profile setup step
    emit('showProfile', { email: email.value, password: password.value })
    closeModal()
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  font-family: 'League Spartan', sans-serif;
}

.modal {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  position: relative;
  text-align: center;
  font-family: 'League Spartan', sans-serif;
}

.modal-title {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: black;
}

.close-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
}

label {
  display: block;
  color: black;
  text-align: left;
  margin: 0.5rem 0 0.25rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 2px solid #ccc;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-family: 'League Spartan', sans-serif;
  color: black;
}

input::placeholder {
  font-size: 0.9rem;
  color: #888;
}

.verify-btn {
  background-color: #f67c51;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  width: 100%;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'League Spartan', sans-serif;
  margin-top: 0.5rem;
}

.verify-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.message {
  font-size: 0.9rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-family: 'League Spartan', sans-serif;
}

.success {
  color: #27ae60;
}

.message a {
  color: #f67c51;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}

.error {
  color: #e74c3c;
  margin-top: 1rem;
  font-family: 'League Spartan', sans-serif;
}
</style>
