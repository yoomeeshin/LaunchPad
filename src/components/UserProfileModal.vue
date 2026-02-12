<template>
    <div v-if="show" class="modal-backdrop">
      <div class="modal">
        <button class="close-btn" @click="close">✕</button>
        <h2>Complete Your Profile</h2>
        <form @submit.prevent="submit">
          <label>University</label>
          <input v-model="userProfile.university" placeholder="Search for a University" required />
  
          <label>Major</label>
          <input v-model="userProfile.major" placeholder="Enter your major" required />
  
          <label>Year of Study (1 - 6)</label>
          <select v-model="userProfile.year" required>
            <option disabled value="">Enter…</option>
            <option v-for="n in 6" :key="n">{{ n }}</option>
          </select>
  
          <label>GPA/CAP (Optional)</label>
          <input v-model="userProfile.gpa" placeholder="e.g. 4.5" />
  
          <label>Skills/Certifications</label>
          <input v-model="userProfile.skills" placeholder="Enter your skills (e.g., Python, SQL)" />

          <p v-if="error" class="error">{{ error }}</p>
  
          <button type="submit" class="verify-btn" :disabled="loading">
            {{ loading ? 'Creating Account...' : 'Finish & Sign Up' }}
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { userProfile } from '@/store/userProfile'
  import { saveUserProfile, registerUser } from '@/utils/auth'
  import { auth } from '@/firebase'
  
  const props = defineProps({ 
    show: Boolean,
    registrationData: Object
  })
  const emit = defineEmits(['close', 'registered'])
  
  const error = ref('')
  const loading = ref(false)
  
  const close = () => emit('close')
  
  async function submit() {
    if (!userProfile.university || !userProfile.major || !userProfile.year) {
      error.value = 'Please fill in all required fields'
      return
    }

    loading.value = true
    
    try {
      // If registrationData exists, create the user first
      if (props.registrationData) {
        const { email, password } = props.registrationData
        const userCredential = await registerUser(email, password)
        
        // Save the user profile to Firestore
        await saveUserProfile(userCredential.user.uid, {
          university: userProfile.university,
          major: userProfile.major,
          year: userProfile.year,
          gpa: userProfile.gpa || null,
          skills: userProfile.skills || '',
          email: email
        })
        
        // Emit that registration is complete
        emit('registered', userCredential.user)
      } else if (auth.currentUser) {
        // In case the user is already signed in and just updating profile
        await saveUserProfile(auth.currentUser.uid, {
          university: userProfile.university,
          major: userProfile.major,
          year: userProfile.year,
          gpa: userProfile.gpa || null,
          skills: userProfile.skills || '',
          email: auth.currentUser.email
        })
        
        emit('close')
      } else {
        error.value = 'User not found. Please try signing up again.'
        loading.value = false
        return
      }
      
      // Reset the form values for next time
      resetForm()
      
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  function resetForm() {
    userProfile.university = ''
    userProfile.major = ''
    userProfile.year = ''
    userProfile.gpa = ''
    userProfile.skills = ''
    error.value = ''
  }
  </script>
  
  <style scoped>

  h2 {
    color: black;
  }
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
    text-align: left;
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
    font-weight: bold;
    margin-top: 1rem;
    color: black;
  }
  
  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 10px;
    border: 2px solid #ccc;
    margin-top: 0.5rem;
    font-size: 1rem;
  }
  
  .verify-btn {
    background-color: #f67c51;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    width: 100%;
    margin-top: 1.5rem;
    border-radius: 10px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
  }

  .verify-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .error {
    color: #e74c3c;
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  </style>