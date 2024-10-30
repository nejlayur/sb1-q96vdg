import React, { createContext, useState, useEffect, useCallback } from 'react';

interface SimulationContextType {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  speed: number;
  setSpeed: (value: number) => void;
  position: number;
  velocityData: any;
  distanceData: any;
  currentTime: number;
  currentDistance: number;
  resetSimulation: () => void;
}

export const SimulationContext = createContext<SimulationContextType>({
  isRunning: false,
  setIsRunning: () => {},
  speed: 0,
  setSpeed: () => {},
  position: 0,
  velocityData: null,
  distanceData: null,
  currentTime: 0,
  currentDistance: 0,
  resetSimulation: () => {},
});

const MAX_DATA_POINTS = 100;

export const SimulationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [position, setPosition] = useState(0);
  const [time, setTime] = useState<number[]>([]);
  const [velocities, setVelocities] = useState<number[]>([]);
  const [distances, setDistances] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setPosition(0);
    setTime([]);
    setVelocities([]);
    setDistances([]);
    setCurrentTime(0);
    setCurrentDistance(0);
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdate) / 1000;
      setLastUpdate(now);

      setPosition(prev => {
        const newPos = prev + (speed * deltaTime * 0.1);
        return newPos > 100 ? 0 : newPos;
      });

      setCurrentTime(prev => prev + deltaTime);
      setCurrentDistance(prev => prev + (speed * deltaTime));

      setTime(prev => {
        const newTime = [...prev, prev.length ? prev[prev.length - 1] + deltaTime : 0];
        return newTime.slice(-MAX_DATA_POINTS);
      });

      setVelocities(prev => {
        const newVelocities = [...prev, speed];
        return newVelocities.slice(-MAX_DATA_POINTS);
      });

      setDistances(prev => {
        const newDistance = prev.length ? prev[prev.length - 1] + (speed * deltaTime) : 0;
        const newDistances = [...prev, newDistance];
        return newDistances.slice(-MAX_DATA_POINTS);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, speed, lastUpdate]);

  const velocityData = {
    labels: time.map(t => t.toFixed(1)),
    datasets: [{
      label: 'Hız (m/s)',
      data: velocities,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.1
    }]
  };

  const distanceData = {
    labels: time.map(t => t.toFixed(1)),
    datasets: [{
      label: 'Yol (m)',
      data: distances,
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.1
    }]
  };

  return (
    <SimulationContext.Provider value={{
      isRunning,
      setIsRunning,
      speed,
      setSpeed,
      position,
      velocityData,
      distanceData,
      currentTime,
      currentDistance,
      resetSimulation,
    }}>
      {children}
    </SimulationContext.Provider>
  );
};