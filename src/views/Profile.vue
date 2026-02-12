<template>
  <div v-if="loading" class="profile-loading">
    <p>Loading profile...</p>
  </div>

  <div v-else-if="profile" class="profile-wrapper">
    <div class="profile-container">
      <h2>Your Profile</h2>
      <form class="profile-form" @submit.prevent="saveProfile">
        <div class="form-group">
          <label>University</label>
          <div class="tag-input">
            <div class="tags">
              <span v-for="(uni, index) in universityTags" :key="index" class="tag-chip">
                {{ uni }}
                <button v-if="editMode" type="button" class="remove-tag" @click="removeUniversityTag(index)">&times;</button>
              </span>
            </div>
            <input v-if="editMode" type="text" v-model="universityInput" @keyup.enter="addUniversityTag" placeholder="Add university" />
          </div>
        </div>

        <div class="form-group">
          <label>Major</label>
          <input type="text" v-model="editableProfile.major" :readonly="!editMode" />
        </div>

        <div class="form-group">
          <label>Year</label>
          <input type="text" v-model="editableProfile.year" :readonly="!editMode" />
        </div>

        <div class="form-group">
          <label>GPA</label>
          <input type="text" v-model="editableProfile.gpa" :readonly="!editMode" />
        </div>

        <div class="form-group">
          <label>Skills</label>
          <div class="tag-input">
            <div class="tags">
              <span v-for="(skill, index) in skillsTags" :key="index" class="tag-chip">
                {{ skill }}
                <button v-if="editMode" type="button" class="remove-tag" @click="removeSkillTag(index)">&times;</button>
              </span>
            </div>
            <input v-if="editMode" type="text" v-model="skillInput" @keyup.enter="addSkillTag" placeholder="Add skill" />
          </div>
        </div>

        <div class="button-group">
          <button v-if="!editMode" type="button" @click="editMode = true">Edit</button>
          <button v-else type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>

  <div v-else class="profile-not-found">
    <p>Profile not found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const profile = ref(null)
const editableProfile = ref({})
const loading = ref(true)
const editMode = ref(false)

const skillsTags = ref([])
const skillInput = ref('')
const universityTags = ref([])
const universityInput = ref('')

onMounted(async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    try {
      const docRef = doc(db, 'profiles', user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        profile.value = docSnap.data()
        editableProfile.value = { ...docSnap.data(), uid: user.uid }
        console.log('✅ Profile loaded:', profile.value)
        // Initialize tags from profile data
        if (editableProfile.value.skills) {
          if (Array.isArray(editableProfile.value.skills)) {
            skillsTags.value = [...editableProfile.value.skills]
          } else if (typeof editableProfile.value.skills === 'string') {
            skillsTags.value = editableProfile.value.skills.split(',').map(s => s.trim()).filter(s => s)
          }
        }
        if (editableProfile.value.university) {
          if (Array.isArray(editableProfile.value.university)) {
            universityTags.value = [...editableProfile.value.university]
          } else if (typeof editableProfile.value.university === 'string') {
            universityTags.value = editableProfile.value.university.split(',').map(u => u.trim()).filter(u => u)
          }
        }
      } else {
        console.warn('⚠️ No profile found in Firestore.')
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error)
    }
  } else {
    console.warn('❌ No user logged in.')
  }

  loading.value = false
})

function addSkillTag() {
  const newSkill = skillInput.value.trim()
  if (newSkill) {
    skillsTags.value.push(newSkill)
    skillInput.value = ''
  }
}
function removeSkillTag(index) {
  skillsTags.value.splice(index, 1)
}
function addUniversityTag() {
  const newUni = universityInput.value.trim()
  if (newUni) {
    universityTags.value.push(newUni)
    universityInput.value = ''
  }
}
function removeUniversityTag(index) {
  universityTags.value.splice(index, 1)
}

async function saveProfile() {
  try {
    const finalSkill = skillInput.value.trim()
    if (finalSkill && !skillsTags.value.includes(finalSkill)) {
      skillsTags.value.push(finalSkill)
      skillInput.value = ''
    }

    const finalUni = universityInput.value.trim()
    if (finalUni && !universityTags.value.includes(finalUni)) {
      universityTags.value.push(finalUni)
      universityInput.value = ''
    }

    // Sync tags with editableProfile before saving
    editableProfile.value.skills = [...skillsTags.value]
    editableProfile.value.university = [...universityTags.value]
    const docRef = doc(db, 'profiles', editableProfile.value.uid)
    await updateDoc(docRef, {
      university: editableProfile.value.university,
      major: editableProfile.value.major,
      year: editableProfile.value.year,
      gpa: editableProfile.value.gpa,
      skills: editableProfile.value.skills
    })
    profile.value = { ...editableProfile.value }
    editMode.value = false
    console.log('✅ Profile saved successfully.')
  } catch (error) {
    console.error('❌ Error saving profile:', error)
  }
}
</script>

<style scoped>
.profile-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  z-index: 2;
  padding: 2rem;
  box-sizing: border-box;
}


.profile-container {
  width: 80%; 
  max-width: 480px; 
  background: rgba(146, 145, 145, 0.019);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 2.5rem;
  color: white;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  margin-top: 80px; 
  z-index: 10;
}

@media (max-width: 600px) {
  .profile-container {
    width: 90%;
    padding: 1.5rem 1.5rem;
    margin-top: 40px;
  }
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1.8rem;
  color: white;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
}

.tag-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  color: #000;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
}

.remove-tag {
  background: none;
  padding: 0;
  border: none;
  color: #000;
  margin-left: 0.4rem;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
}

.remove-tag:hover {
  color: #d33;
}

input {
  padding: 0.7rem;
  background-color: rgba(255, 255, 255, 0.514);
  color: #000;
  border: 1px solid rgba(255, 255, 255, 0.641);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  backdrop-filter: blur(2px);
}
input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.85);
  border-color: #f67c51;
}

/* Buttons (Edit/Save) styling */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
button {
  padding: 0.6rem 1.4rem;
  background-color: #f67c51;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #d4633a;
}

/* Loading/Not found states */
.profile-loading,
.profile-not-found {
  text-align: center;
  margin-top: 100px;
  font-size: 1.2rem;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .profile-container {
    padding: 1.5rem 2rem;
  }
  h2 {
    font-size: 1.6rem;
  }
}
</style>