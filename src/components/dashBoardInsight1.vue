<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

Chart.register(...registerables);

export default {
  name: 'InsightChart',
  props: {
    statToDisplay: {
      type: String,
      default: 'internshipSuccessRate',
      validator: value => ['internshipSuccessRate', 'jobDifficultyRate'].includes(value)
    },
    firebaseCollection: {
      type: String,
      default: 'reviews'
    }
  },
  data() {
    return {
      chart: null,
      statsHistory: [],
      unsubscribe: null
    };
  },
  mounted() {
    this.initChart();
    this.setupFirestoreListener();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.unsubscribe) {
      this.unsubscribe(); // Clean up Firestore listener
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d');
      
      const whiteTextOptions = {
        color: '#FFFFFF',
        font: {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        }
      };

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: this.getChartLabel(),
            data: [],
            borderColor: '#FFA500', // Orange line
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            borderWidth: 2,
            tension: 0.4, // Smoother curve
            fill: false,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#FFA500',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: whiteTextOptions
            },
            tooltip: {
              bodyColor: '#FFFFFF',
              titleColor: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderColor: 'rgba(255, 165, 0, 0.5)',
              borderWidth: 1,
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: whiteTextOptions,
              title: {
                display: true,
                text: 'Percentage (%)',
                ...whiteTextOptions
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: whiteTextOptions,
              title: {
                display: true,
                text: 'Date',
                ...whiteTextOptions
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    },
    getChartLabel() {
      return {
        internshipSuccessRate: 'Internship Success Rate',
        jobDifficultyRate: 'Job Difficulty Rate'
      }[this.statToDisplay] || this.statToDisplay;
    },
    setupFirestoreListener() {
      const db = getFirestore();
      const reviewsCollection = collection(db, this.firebaseCollection);
      
      this.unsubscribe = onSnapshot(reviewsCollection, (snapshot) => {
        const reviews = [];
        snapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        this.processNewData(reviews);
      });
    },
    processNewData(reviews) {
      const currentStats = this.calculateStats(reviews);
      const currentValue = currentStats[this.statToDisplay];
      
      // Add timestamp for proper time-based sorting
      const now = new Date();
      this.statsHistory.push({
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: now.getTime(),
        value: currentValue
      });
      
      // Sort by timestamp and keep only last 30 entries
      this.statsHistory.sort((a, b) => a.timestamp - b.timestamp);
      if (this.statsHistory.length > 30) {
        this.statsHistory = this.statsHistory.slice(-30);
      }
      
      this.updateChart();
    },
    calculateStats(reviews) {
      if (!reviews.length) {
        return {
          internshipSuccessRate: 0,
          jobDifficultyRate: 0
        };
      }

      const interns = reviews.filter(r => 
        r.role && typeof r.role === 'string' && r.role.toLowerCase().includes('intern')
      );
      const internSuccess = interns.filter(r => (r.recommendationRating || 0) >= 3);
      const internshipSuccessRate = interns.length > 0 
        ? (internSuccess.length / interns.length) * 100 
        : 0;

      const hardToGet = reviews.filter(r => (r.rating || 0) <= 2);
      const jobDifficultyRate = reviews.length > 0
        ? (hardToGet.length / reviews.length) * 100
        : 0;

      return {
        internshipSuccessRate,
        jobDifficultyRate
      };
    },
    updateChart() {
      if (!this.chart) return;
      
      this.chart.data.labels = this.statsHistory.map(item => item.date);
      this.chart.data.datasets[0].data = this.statsHistory.map(item => item.value);
      this.chart.data.datasets[0].label = this.getChartLabel();
      this.chart.update();
    }
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  background-color: transparent;
}

canvas {
  background-color: tran;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 165, 0, 0.2);
}
</style>
