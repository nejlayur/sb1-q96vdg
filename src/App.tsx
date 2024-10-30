import React from 'react';
import Simulation from './components/Simulation';
import { SimulationProvider } from './context/SimulationContext';

function App() {
  return (
    <SimulationProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Hareket Simülasyonu
        </h1>
        <Simulation />
      </div>
    </SimulationProvider>
  );
}

export default App;