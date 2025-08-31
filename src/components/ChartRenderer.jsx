// ChartRenderer.js
import React, { useRef } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { authActions } from '../redux/authSlice';
import ThreePieChart from './ThreePieChart';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Title
);

// A reusable, styled container for charts with animations
const ChartContainer = ({ title, children, onSave, onDelete }) => (
  <div className="bg-black/70 backdrop-blur-sm shadow-2xl rounded-2xl p-4 sm:p-6 my-6 transition-all duration-500 hover:shadow-cyan-400/20 transform hover:-translate-y-1">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="flex items-center gap-2">
        {onSave && (
          <button
            onClick={onSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            aria-label="Save chart as PNG"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Save PNG</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
            aria-label="Delete chart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
      </div>
    </div>
    {children}
  </div>
);


const ChartRenderer = ({ data, xKey, yKey, type, uploadId, chartId }) => {
  const piechartRef = useRef(null);
  const barchartRef = useRef(null);
  const linechartRef = useRef(null);
  const scatterchartRef = useRef(null);
  const dispatch = useDispatch();
    const BACKEND_URL = import.meta.env.VITE_BACKEND;
  if (!data || data.length === 0 || !xKey || !yKey) {
    return (
      <div className="text-center p-8 bg-white/10 rounded-lg shadow-md">
        <p className="text-yellow-400 font-medium text-lg">No data available to display for this chart.</p>
      </div>
    );
  }

  const handleSaveChartJS = (ref, filename) => {
    if (!ref.current) return;
    const base64Image = ref.current.toBase64Image();
    const a = document.createElement('a');
    a.href = base64Image;
    a.download = filename;
    a.click();
  };

  const deleteHandler = async (uploadId, chartId) => {
    try {
      const res = await axios.delete(`/api/excel/upload/${uploadId}/deletechart/${chartId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(authActions.updateChart({ uploadId, charts: res.data.updatedCharts }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const labels = data.map(item => item[xKey]);
  const yValuesRaw = data.map(item => item[yKey]);
  const isYString = typeof yValuesRaw[0] === 'string';

  let valueMap = {};
  let values = [];

  if (isYString) {
    let uniqueValues = [...new Set(yValuesRaw)];
    uniqueValues.forEach((val, idx) => {
      valueMap[val] = idx + 1;
    });
    values = yValuesRaw.map(val => valueMap[val]);
  } else {
    values = yValuesRaw;
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#E5E7EB' } },
      title: { display: false }, // Title is handled by ChartContainer
    },
    scales: {
      x: {
        ticks: { color: '#D1D5DB' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: '#D1D5DB' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  switch (type) {
    case 'bar':
    case 'line': {
      const chartData = {
        labels,
        datasets: [{
          label: yKey,
          data: values,
          backgroundColor: type === 'bar' ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
          borderColor: '#3B82F6',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6',
          pointRadius: 4,
          tension: 0.4 // For smoother line charts
        }]
      };

      const axisOptions = isYString ? {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            beginAtZero: true,
            ticks: {
              ...commonOptions.scales.y.ticks,
              callback: (value) => Object.keys(valueMap).find(key => valueMap[key] === value) || value,
            }
          }
        }
      } : commonOptions;

      const chartRef = type === 'bar' ? barchartRef : linechartRef;
      const ChartComponent = type === 'bar' ? Bar : Line;

      return (
        <ChartContainer
          title={`${type.charAt(0).toUpperCase() + type.slice(1)} Chart`}
          onSave={() => handleSaveChartJS(chartRef, `${type}_chart_${chartId}.png`)}
          onDelete={() => deleteHandler(uploadId, chartId)}
        >
          <div style={{ height: '400px' }}>
            <ChartComponent data={chartData} ref={chartRef} options={axisOptions} />
          </div>
        </ChartContainer>
      );
    }

    case 'pie': {
      let pieLabels = [];
      let pieValues = [];

      if (isYString) {
        const frequencyMap = yValuesRaw.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});
        pieLabels = Object.keys(frequencyMap);
        pieValues = Object.values(frequencyMap);
      } else {
        pieLabels = labels;
        pieValues = values;
      }

      const backgroundColor = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
      const chartData = {
        labels: pieLabels,
        datasets: [{
          label: yKey,
          data: pieValues,
          backgroundColor: pieLabels.map((_, i) => backgroundColor[i % backgroundColor.length]),
          borderColor: '#1F2937', // Darker border for contrast
          borderWidth: 2
        }]
      };

      return (
        <ChartContainer
          title="Pie Chart"
          onSave={() => handleSaveChartJS(piechartRef, `pie_chart_${chartId}.png`)}
          onDelete={() => deleteHandler(uploadId, chartId)}
        >
          <div className="flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="w-full md:w-1/2" style={{ height: '400px' }}>
              <Pie data={chartData} ref={piechartRef} options={commonOptions} />
            </div>
            <div className="w-full md:w-1/2" style={{ height: '400px' }}>
              <ThreePieChart
                data={{
                  labels: pieLabels,
                  values: pieValues,
                  colors: pieLabels.map((_, i) => backgroundColor[i % backgroundColor.length])
                }}
              />
            </div>
          </div>
        </ChartContainer>
      );
    }

    case 'scatter': {
      const scatterPoints = labels.map((label, index) => ({
        x: typeof label === 'number' ? label : index,
        y: values[index],
        ...(isYString && { stringLabel: yValuesRaw[index] })
      }));

      const scatterData = {
        datasets: [{
          label: yKey,
          data: scatterPoints,
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      };
      
      const scatterOptions = { ...commonOptions };
      if (isYString) {
        scatterOptions.plugins.tooltip = {
          callbacks: {
            label: (context) => `x: ${context.raw.x}, y: ${context.raw.stringLabel}`
          }
        };
        scatterOptions.scales.y.ticks.callback = (value) => Object.keys(valueMap).find(key => valueMap[key] === value) || '';
      }

      return (
        <ChartContainer
          title="Scatter Chart"
          onSave={() => handleSaveChartJS(scatterchartRef, `scatter_chart_${chartId}.png`)}
          onDelete={() => deleteHandler(uploadId, chartId)}
        >
          <div style={{ height: '400px' }}>
            <Scatter ref={scatterchartRef} data={scatterData} options={scatterOptions} />
          </div>
        </ChartContainer>
      );
    }

    default:
      return (
        <div className="text-center p-8 bg-white/10 rounded-lg shadow-md">
          <p className="text-red-500 font-semibold text-lg">
            Unsupported chart type: <strong>{type}</strong>
          </p>
        </div>
      );
  }
};

export default ChartRenderer;
