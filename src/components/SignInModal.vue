<template>
    <div v-if="show" class="modal-overlay">
      <div class="modal-content">
        <h2>Sign In</h2>
        <form @submit.prevent="signIn">
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" class="sign-btn" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          <p class="forgot-password" @click="forgotPassword">Forgot Password?</p>
        </form>
        <p @click="needAccount">Need an account? Sign Up</p>
        <button @click="closeModal" class="close-btn">Close</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { loginUser, resetPassword } from '@/utils/auth'
  
  const props = defineProps(['show'])
  const emit = defineEmits(['close', 'needAccount', 'loggedIn'])
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)
  
  const closeModal = () => {
    emit('close')
    // Reset form state
    email.value = ''
    password.value = ''
    error.value = ''
  }
  
  const signIn = async () => {
    error.value = ''
    loading.value = true
    
    try {
      const userCredential = await loginUser(email.value, password.value)
      // Check if email is verified, skip for test user
      if (!userCredential.user.emailVerified && email.value.toLowerCase() !== 'testuser@test.com') {
        error.value = 'Please verify your email before signing in.'
        loading.value = false
        return
      }
      
      // Emit successful login event
      emit('loggedIn', userCredential.user)
      closeModal()
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        error.value = 'Invalid email or password. Please try again.'
      } else if (err.code === 'auth/too-many-requests') {
        error.value = 'Too many failed login attempts. Please try again later.'
      } else {
        error.value = err.message
      }
      loading.value = false
    }
  }
  
  const needAccount = () => {
    closeModal()
    emit('needAccount')
  }
  
  const forgotPassword = async () => {
    if (!email.value) {
      error.value = 'Please enter your email address.'
      return
    }
    
    loading.value = true
    try {
      await resetPassword(email.value)
      error.value = ''
      alert('Password reset email sent! Check your inbox.')
    } catch (err) {
      error.value = 'Failed to send reset email. Please try again.'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  /* Modal Overlay Styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  /* Modal Content Styling */
  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    font-family: 'League Spartan', sans-serif;
    color: black;
  }
  
  .modal-content h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: black;
  }
  
  .modal-content input {
    width: 100%;
    padding: 0.5rem;
    margin: 10px 0;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  .modal-content .sign-btn {
    background-color: #f67c51;
    color: white;
    padding: 0.75rem 2rem;
    font-weight: bold;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .modal-content .sign-btn:hover {
    background-color: #d4633a;
  }
  
  .modal-content .sign-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .modal-content .close-btn {
    background-color: transparent;
    color: #f67c51;
    padding: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    border: none;
  }
  
  .modal-content p {
    color: #007bff;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .modal-content p:hover {
    text-decoration: underline;
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .forgot-password {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-align: center;
    margin-top: 0.5rem;
    cursor: pointer;
  }
  
  .forgot-password:hover {
    color: #f67c51;
  }
  </style>
  