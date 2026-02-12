// src/utils/auth.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { userProfile } from '@/store/userProfile'

/**
 * Check if the provided email is a university email
 * @param {string} email - The email to validate
 * @returns {boolean} - True if it's a university email
 */
export const isUniversityEmail = (email) => {
  // Special exception for test account
  if (email.toLowerCase() === 'testuser@test.com') {
    return true
  }
  
  // This is a basic check - customize with more specific university domains
  const uniDomains = [
    '@u.nus.edu', 
    '@e.ntu.edu.sg', 
    '@smu.edu.sg', 
    '@sutd.edu.sg',
    '@u.duke.nus.edu',
    '@yale-nus.edu.sg',
    '@u.nus.edu.sg',
    '@e.ntu.edu',
    '@students.suss.edu.sg',
    '@sim.edu.sg'
  ]
  
  return uniDomains.some(domain => email.toLowerCase().endsWith(domain))
}

/**
 * Check if password is strong enough
 * @param {string} password - Password to validate
 * @param {string} email - User's email (optional)
 * @returns {boolean} - True if password meets requirements
 */
export const isStrongPassword = (password, email) => {
  // Special exception for test account
  if (email && email.toLowerCase() === 'testuser@test.com' && password === '123456') {
    return true
  }
  
  // At least 8 characters, at least one uppercase, one lowercase, one number
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password)
}

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - User credential promise
 */
export const registerUser = async (email, password) => {
  if (!isUniversityEmail(email)) {
    throw new Error('Please use a university email address')
  }
  
  if (!isStrongPassword(password, email)) {
    throw new Error('Password must be at least 8 characters and include uppercase, lowercase, and numbers')
  }
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  // Special handling for test user - bypass email verification
  if (email.toLowerCase() === 'testuser@test.com') {
    // For the test user, we can't directly set emailVerified to true
    // in the client SDK, but we handle it through conditional checks
    console.log('Test user created - email verification bypassed')
    return userCredential
  }
  
  // For all other users, send verification email
  await sendEmailVerification(userCredential.user)
  
  return userCredential
}

/**
 * Save user profile data to Firestore
 * @param {string} uid - User ID
 * @param {object} profileData - User profile data
 * @returns {Promise} - Promise for the database operation
 */
export const saveUserProfile = async (uid, profileData) => {
  return setDoc(doc(db, 'users', uid), {
    ...profileData,
    createdAt: new Date()
  })
}

/**
 * Get user profile from Firestore
 * @param {string} uid - User ID
 * @returns {Promise} - Promise with user data
 */
export const getUserProfile = async (uid) => {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}

/**
 * Login with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - User credential promise
 */
export const loginUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Log out the current user
 * @returns {Promise} - Promise for the sign out operation
 */
export const logoutUser = async () => {
  return signOut(auth)
}

/**
 * Send a password reset email
 * @param {string} email - User's email
 * @returns {Promise} - Promise for the password reset operation
 */
export const resetPassword = async (email) => {
  return sendPasswordResetEmail(auth, email)
}

/**
 * Update a user's display name or photo
 * @param {object} user - User object
 * @param {object} profileData - Profile data to update
 * @returns {Promise} - Promise for the profile update
 */
export const updateUserProfile = async (user, profileData) => {
  return updateProfile(user, profileData)
}

/**
 * Change the user's password
 * @param {object} user - User object
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Promise for the password change operation
 */
export const changePassword = async (user, currentPassword, newPassword) => {
  // First reauthenticate
  const credential = EmailAuthProvider.credential(
    user.email, 
    currentPassword
  )
  
  await reauthenticateWithCredential(user, credential)
  
  // Then update password
  return updatePassword(user, newPassword)
}

/**
 * Set up an auth state listener
 * @param {function} callback - Function to call when auth state changes
 * @returns {function} - Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Load the user's profile and update the userProfile store
 * @param {string} uid - User ID
 */
export const loadUserProfile = async (uid) => {
  try {
    const profile = await getUserProfile(uid)
    if (profile) {
      // Update reactive user profile object
      Object.assign(userProfile, {
        university: profile.university || '',
        major: profile.major || '',
        year: profile.year || '',
        gpa: profile.gpa || '',
        skills: profile.skills || ''
      })
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

/**
 * Send email verification to user
 * @param {object} user - User object
 * @returns {Promise} - Promise for the email verification operation
 */
export const sendEmailVerification = (user) => {
  return firebaseSendEmailVerification(user)
} 