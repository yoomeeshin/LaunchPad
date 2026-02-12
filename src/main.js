import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import VueApexCharts from 'vue3-apexcharts';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

let app;

onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.use(VueApexCharts);
    app.component('apexchart', VueApexCharts);
    app.mount('#app');
  }

  const currentPath = router.currentRoute.value.path;

  // ✅ Only redirect if the user is on the home or signin page
  if (user && (currentPath === '/' || currentPath === '/signin')) {
    router.push('/companies');
  }
});
