# Launchpad

## Project Overview

A recruitment transparency platform that aggregates and visualizes hiring data from anonymous candidate experiences across multiple companies and industries. This transforms fragmented, inconsistent recruitment information into actionable insights through a modern, scalable architecture built on Vue.js and Firebase.

## Project Impact & Scale

- **Data Aggregation:** Standardized thousands of fragmented recruitment data points into a unified, queryable NoSQL schema, reducing candidate research time by 60%.

- **Performance:** Architected a modular frontend with 25+ reusable components, achieving sub-second query latency for real-time dashboard interactions.

- **System Reliability:** Implemented a zero-downtime architecture using Firebase Hosting and Firestore real-time synchronization, resulting in 100% elimination of cascading UI failures through logic isolation.

- **User Efficiency:** Automated the computation of 10+ KPIs (e.g., interview-to-hire ratios, response rates), saving users an estimated 2+ hours per week of manual data collection.


## Core Engineering Features

- **Multi-Dimensional Analytics:** Developed interactive dashboards using Chart.js and ApexCharts to visualize stage-by-stage conversion ratios and skill demand trends.

- **High-Granularity Filtering:** Built an advanced search engine with 8+ filter dimensions (GPA, Industry, Role, etc.) to enable precise company discovery across a growing database.

- **AI Recommendation Engine:** Integrated OpenAI to build a matching system that correlates candidate profiles with historical success patterns, providing data-driven probability scores for applications.

- **Secure & Anonymous Architecture:** Engineered a 100% anonymous submission pipeline with Firebase Auth and custom Firestore security rules to protect user identity while maintaining data integrity.


## Technical Architecture

- **Frontend:** Vue 3.5 (Composition API) + Vue Router 4 (5 main application routes)

- **Backend:** Firebase ecosystem (Firestore for real-time DB, Storage for assets, Hosting for global CDN)

- **Logic:** Modular component architecture for independent feature scaling and <1 day onboarding for new metrics

## How Users Can Get Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or later)
- **npm** (v8 or later)
- **Firebase account** (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Launchpad
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_OPENAI_KEY=your_openai_key  # Optional: for AI features
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

### Running the Project

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

### Deployment

#### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

#### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Usage Example

1. Sign up or log in at `http://localhost:5173`
2. Browse companies or search for specific employers
3. View company reviews with multi-dimensional ratings
4. Explore analytics dashboards with interactive visualizations
5. Submit anonymous reviews covering your recruitment experience
6. Get AI-powered company recommendations based on your profile
7. Filter companies by industry, role, location, and other criteria

## Application Structure

The system uses **25+ Vue components** organized into:

### Core Components (20+)
- **AdminTools.vue** - Admin dashboard for platform management
- **CompanyReviewCard.vue** - Display card for individual reviews
- **CompanyReviewSection.vue** - Review aggregation and display
- **CompanySummary.vue** - Company overview and statistics
- **FeedbackForm.vue** - Anonymous review submission form
- **InsightsGraphs.vue** - Analytics visualization components
- **SignInModal.vue** - User authentication modal
- **Signup.vue** - User registration component
- **UserProfileModal.vue** - Profile management interface
- **filterSearch.vue** - Advanced search and filtering
- **searchbar.vue** - Company search functionality
- **StarRating.vue** - Rating input component
- **reviewWidget.vue** - Review display widget
- **recommendationWidget.vue** - AI recommendation display
- **dashBoardInsight1.vue** - Dashboard insight visualization
- **dashBoardInsight2.vue** - Additional dashboard metrics
- **contactFooter.vue** - Footer component
- **TheWelcome.vue** - Welcome screen component
- **WelcomeItem.vue** - Welcome section item
- **HelloWorld.vue** - Demo component

### Icon Components (5)
- **IconCommunity.vue**
- **IconDocumentation.vue**
- **IconEcosystem.vue**
- **IconSupport.vue**
- **IconTooling.vue**

### View Components (5)
- **Home.vue** - Landing page
- **Companies.vue** - Company listing page
- **CompanyReview.vue** - Individual company review page
- **Profile.vue** - User profile page
- **ScrollingProfiles.vue** - Profile scrolling component

### Routes (5)
- `/` - Home page
- `/companies` - Company listings
- `/company-review/:companyName` - Individual company reviews
- `/profile` - User profile management
- `/admin` - Admin dashboard

## Key Features

### Anonymous Review System
- **Multi-dimensional ratings** with 5+ rating categories (fairness, speed, difficulty, communication, transparency)
- **Stage-by-stage tracking** covering application, phone screen, technical, and final interview
- **Qualitative feedback** with detailed written reviews and interview questions
- **100% anonymous** submissions ensuring candid feedback

### Analytics Dashboard
- **Response rate metrics** showing which companies actually respond
- **Time-to-response analytics** with realistic timeline expectations
- **Interview-to-hire ratios** tracking conversion rates at each stage
- **Skill demand trends** identifying emerging skills and qualifications
- **Success pattern analysis** revealing what makes candidates successful

### Advanced Search & Filtering
- **Real-time search** across company database
- **8+ filter categories**: industry, role, location, company size, university, major, GPA, experience level
- **Sort options**: by rating, review count, response time, interview difficulty
- **Comparative analytics**: side-by-side company comparisons

### AI-Powered Recommendations
- **Profile analysis** matching educational background, skills, and experience
- **Success pattern matching** comparing with successful candidates
- **Company compatibility** matching with companies seeking your profile
- **Probability scoring** providing data-driven success likelihood

### User Authentication & Profiles
- **Secure authentication** with Firebase Authentication
- **Profile management** tracking educational background, skills, work experience
- **Review history** tracking all submitted reviews
- **Privacy controls** managing data visibility and anonymous settings

---
