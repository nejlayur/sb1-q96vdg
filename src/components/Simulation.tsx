import React, { useContext } from 'react';
import { Car, PlayCircle, PauseCircle, RotateCcw, Info } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { SimulationContext } from '../context/SimulationContext';
import QuizSection from './QuizSection';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SPEED_OPTIONS = [2, 4, 5, 10];

const Instructions = () => (
  <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8">
    <div className="flex items-start gap-3">
      <Info className="text-blue-600 w-6 h-6 mt-1 flex-shrink-0" />
      <div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Simülasyon Yönergesi</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Başlat düğmesine basarak simülasyonu çalıştırın</li>
          <li>Farklı hız seçeneklerini deneyerek aracın hareketini gözlemleyin</li>
          <li>Grafiklerden hız-zaman ve yol-zaman ilişkisini inceleyin</li>
          <li>Simülasyonu durdurmak için Durdur düğmesini kullanın</li>
          <li>Sıfırla düğmesi ile simülasyonu başlangıç konumuna getirebilirsiniz</li>
        </ol>
      </div>
    </div>
  </div>
);

const Simulation = () => {
  const {
    isRunning,
    setIsRunning,
    speed,
    setSpeed,
    position,
    velocityData,
    distanceData,
    currentTime,
    currentDistance
  } = useContext(SimulationContext);

  const chartOptions = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Instructions />
      
      {/* Kontrol Paneli */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              {isRunning ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
              {isRunning ? 'Durdur' : 'Başlat'}
            </button>
            <button
              onClick={() => setIsRunning(false)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg"
            >
              <RotateCcw size={24} />
              Sıfırla
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-lg font-medium">Hız Seçimi (m/s):</label>
            <div className="flex gap-2">
              {SPEED_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setSpeed(option)}
                  className={`px-8 py-3 rounded-lg transition-colors text-lg ${
                    speed === option
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {option} m/s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simülasyon Görünümü */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400" />
            <div className="absolute top-1/4 left-0 right-0 h-0.5">
              <div className="flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-8 h-0.5 bg-white mr-4" />
                ))}
              </div>
            </div>
            <div className="absolute top-3/4 left-0 right-0 h-0.5">
              <div className="flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-8 h-0.5 bg-white mr-4" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Araç */}
          <div 
            className="absolute top-1/4 transition-all duration-100"
            style={{ left: `${position}%` }}
          >
            <Car size={64} className="text-blue-600" />
          </div>
          
          {/* Yol zemini */}
          <div className="absolute bottom-0 w-full h-full bg-gray-600 -z-10" />
        </div>

        {/* Anlık Veriler */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Geçen Süre</h3>
            <p className="text-2xl font-bold text-blue-900">{currentTime.toFixed(1)} s</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Alınan Yol</h3>
            <p className="text-2xl font-bold text-green-900">{currentDistance.toFixed(1)} m</p>
          </div>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="h-[300px]">
              <Line 
                data={velocityData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Hız - Zaman Grafiği'
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="h-[300px]">
              <Line 
                data={distanceData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Yol - Zaman Grafiği'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Bölümü */}
      <QuizSection />
    </div>
  );
};

export default Simulation;