<template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
      <div v-if="showNoDataMessage" class="noData">
        No gender data available
      </div>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  import { ref, onMounted, watch, computed } from 'vue';
  
  Chart.register(...registerables);
  
  export default {
    name: 'GenderRadialChart',
    props: {
      genderData: {
        type: Object,
        required: true,
        validator: (value) => {
          return 'male' in value && 'female' in value && 'nonBinary' in value;
        }
      }
    },
    setup(props) {
      const chartCanvas = ref(null);
      let chartInstance = ref(null);
  
      const showNoDataMessage = computed(() => {
        return props.genderData.male === 0 && 
               props.genderData.female === 0 && 
               props.genderData.nonBinary === 0;
      });
  
      const calculatePercentages = (data) => {
        const total = data.male + data.female + data.nonBinary;
        if (total === 0) {
          // dummy data
          return { male: 53.3, female: 20.4, nonBinary: 27.3 };
        }
        
        return {
          male: (data.male / total) * 100,
          female: (data.female / total) * 100,
          nonBinary: (data.nonBinary / total) * 100
        };
      };
  
      const initChart = () => {
        if (!chartCanvas.value) return;
  
        // Destroy previous instance if exists
        if (chartInstance.value) {
          chartInstance.value.destroy();
        }
  
        const percentages = calculatePercentages(props.genderData);
        
        const ctx = chartCanvas.value.getContext('2d');
        chartInstance.value = new Chart(ctx, {
          type: 'polarArea',
          data: {
            labels: ['Male', 'Female', 'Non-binary'],
            datasets: [{
              label: 'Gender Distribution',
              data: [percentages.male, percentages.female, percentages.nonBinary],
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(153, 102, 255, 0.7)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const labelText = showNoDataMessage.value 
                      ? 'Sample data' 
                      : context.label;
                    return `${labelText}: ${context.raw.toFixed(1)}%`;
                  }
                }
              },
              title: {
                display: true,
                text: showNoDataMessage.value 
                  ? 'Gender Distribution (Sample Data)' 
                  : 'Gender Distribution',
                font: {
                  size: 16
                }
              }
            },
            scales: {
              r: {
                ticks: {
                  display: false,
                  backdropColor: 'transparent'
                },
                pointLabels: {
                  display: true
                },
                suggestedMin: 0,
                suggestedMax: 100
              }
            }
          }
        });
      };
  
      onMounted(initChart);
  
      watch(() => props.genderData, (newVal) => {
        if (chartInstance.value) {
          const percentages = calculatePercentages(newVal);
          chartInstance.value.data.datasets[0].data = [
            percentages.male, 
            percentages.female, 
            percentages.nonBinary
          ];
          
          // Update chart title based on data availability
          chartInstance.value.options.plugins.title.text = showNoDataMessage.value
            ? 'Gender Distribution (Sample Data)'
            : 'Gender Distribution';
            
          chartInstance.value.update();
        }
      }, { deep: true });
  
      return {
        chartCanvas,
        showNoDataMessage
      };
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 300px;
    width: 100%;
  }
  
  .no-data-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
    z-index: 10;
  }
  </style>