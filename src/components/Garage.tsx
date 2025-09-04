import React, { useState, useEffect, useRef } from 'react';
import { CarForm } from './CarForm';
import { CarTrack } from './CarTrack';
import { Pagination } from './Pagination';
import { api } from '../api';
import { generateRandomCar } from '../utils';
import type { Car } from '../types';

export const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState(106);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [raceWinner, setRaceWinner] = useState<{ car: Car; time: number; garagePosition: number } | null>(null);
  const [raceStates, setRaceStates] = useState<Record<number, any>>({});
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [winnerDeclared, setWinnerDeclared] = useState(false);

  const winnerRef = useRef(false);

  const raceStatesRef = useRef<Record<number, any>>({});
  const runningRef = useRef<Record<number, boolean>>({});
  const rafRef = useRef<Record<number, number | null>>({});

  useEffect(() => { raceStatesRef.current = raceStates; }, [raceStates]);


  useEffect(() => {
    return () => {
      Object.values(rafRef.current).forEach(id => id && cancelAnimationFrame(id));
    };
  }, []);

  useEffect(() => { 
    loadCars(); 
  }, [currentPage]);

  const loadCars = async () => {
    try {
      const result = await api.getCars(currentPage, 7);
      setCars(result.cars);
      setTotalCars(result.totalCount);
      const maxPage = Math.ceil(result.totalCount / 7) || 1;
      if (currentPage > maxPage) setCurrentPage(maxPage);
    } catch (error) {
      console.error('Failed to load cars:', error);
    }
  };

  const createCar = async (name: string, color: string) => {
    if (isRacing) return;
    try {
      await api.createCar(name, color);
      await loadCars();
    } catch (error) {
      console.error('Failed to create car:', error);
    }
  };

  const updateCar = async (name: string, color: string) => {
    if (!selectedCar || isRacing) return;
    try {
      await api.updateCar(selectedCar.id, name, color);
      setSelectedCar(null);
      await loadCars();
    } catch (error) {
      console.error('Failed to update car:', error);
    }
  };

  const deleteCar = async (id: number) => {
    if (isRacing) return;
    try {
      await api.deleteCar(id);
      await api.deleteWinner(id);
      await loadCars();
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  const generateCars = async () => {
    if (isRacing) return;
    try {
      for (let i = 0; i < 100; i++) {
        const car = generateRandomCar();
        await api.createCar(car.name, car.color);
      }
      await loadCars();
    } catch (error) {
      console.error('Failed to generate cars:', error);
    }
  };

  const stopEngine = async (car: Car) => {
    try {
      runningRef.current[car.id] = false;
      if (rafRef.current[car.id]) {
        cancelAnimationFrame(rafRef.current[car.id]!);
        rafRef.current[car.id] = null;
      }
      await api.stopEngine(car.id);
      setRaceStates(prev => ({
        ...prev,
        [car.id]: { isRacing: false, progress: 0, finished: false }
      }));
    } catch (error) {
      console.error('Failed to stop engine:', error);
    }
  };

  const startEngine = async (car: Car, garagePosition: number) => {

    if (runningRef.current[car.id]) return;

    try {
      const engine = await api.startEngine(car.id);

      runningRef.current[car.id] = true;
      raceStatesRef.current = {
        ...raceStatesRef.current,
        [car.id]: { isRacing: true, progress: 0 }
      };
      setRaceStates(prev => ({
        ...prev,
        [car.id]: { isRacing: true, progress: 0 }
      }));


      const duration = engine.distance / engine.velocity; 
      const startTime = performance.now();
      let lastUpdate = 0;

      const animate = () => {
        if (!runningRef.current[car.id]) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);


        if (now - lastUpdate > 33) {
          setRaceStates(prev => ({
            ...prev,
            [car.id]: { ...prev[car.id], progress }
          }));
          lastUpdate = now;
        }

        if (progress < 100 && runningRef.current[car.id]) {
          rafRef.current[car.id] = requestAnimationFrame(animate);
        } else {
          runningRef.current[car.id] = false;
          setRaceStates(prev => ({
            ...prev,
            [car.id]: { ...prev[car.id], progress: 100, finished: true, isRacing: false }
          }));
        }
      };

      rafRef.current[car.id] = requestAnimationFrame(animate);

      const driveResult = await api.driveCar(car.id);

      if (driveResult.success) {
        const raceTime = (performance.now() - startTime) / 1000;

        if (!winnerRef.current) {
          winnerRef.current = true;
          setWinnerDeclared(true);
          setRaceWinner({ car, time: raceTime, garagePosition });
          setShowWinnerPopup(true);

          const localWinners = JSON.parse(localStorage.getItem('localWinners') || '{}');
          localWinners[car.id] = raceTime;
          localStorage.setItem('localWinners', JSON.stringify(localWinners));

          await api.saveWinner(car.id, raceTime, garagePosition);

          cars.forEach(c => {
            if (c.id !== car.id) stopEngine(c);
          });

          setIsRacing(false);
        }
      } else {

        runningRef.current[car.id] = false;
        if (rafRef.current[car.id]) {
          cancelAnimationFrame(rafRef.current[car.id]!);
          rafRef.current[car.id] = null;
        }
        setRaceStates(prev => ({
          ...prev,
          [car.id]: { ...prev[car.id], isRacing: false }
        }));
      }
    } catch (error) {
      console.error('Failed to start engine:', error);
      runningRef.current[car.id] = false;
      if (rafRef.current[car.id]) {
        cancelAnimationFrame(rafRef.current[car.id]!);
        rafRef.current[car.id] = null;
      }
    }
  };

  const startRace = () => {
    setIsRacing(true);
    setRaceWinner(null);
    setWinnerDeclared(false);
    winnerRef.current = false;


    setRaceStates({});
    runningRef.current = {};
    Object.values(rafRef.current).forEach(id => id && cancelAnimationFrame(id));
    rafRef.current = {};

    cars.forEach((car, index) => {
      const garagePosition = index + 1;
      setTimeout(() => startEngine(car, garagePosition), index * 100);
    });
  };

  const resetRace = () => {
    setIsRacing(false);
    setRaceWinner(null);
    setWinnerDeclared(false);


    Object.values(rafRef.current).forEach(id => id && cancelAnimationFrame(id));
    rafRef.current = {};
    cars.forEach(car => {
      runningRef.current[car.id] = false;
      stopEngine(car);
    });

    setRaceStates({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Create Car</h2>
        <CarForm onSubmit={createCar} />
      </div>

      {selectedCar && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Update Car</h2>
          <CarForm
            car={selectedCar}
            onSubmit={updateCar}
            onCancel={() => setSelectedCar(null)}
            isUpdate={true}
          />
        </div>
      )}

      <div className="mb-8 flex gap-4 flex-wrap">
        <button
          onClick={startRace}
          disabled={isRacing}
          className={`px-6 py-3 rounded-lg font-bold ${
            isRacing ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          RACE
        </button>
        <button
          onClick={resetRace}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
        >
          RESET
        </button>
        <button
          onClick={generateCars}
          disabled={isRacing}
          className={`px-6 py-3 rounded-lg font-bold ${
            isRacing ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          GENERATE 100 CARS
        </button>
      </div>

 
      {showWinnerPopup && raceWinner && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-8 py-6 rounded-lg shadow-lg z-50 font-bold text-center">
          <div className="mb-4">
            🏆 Winner: {raceWinner.car.name} - {raceWinner.time.toFixed(2)}s (Garage #{raceWinner.garagePosition})
          </div>
          <button
            onClick={() => setShowWinnerPopup(false)}
            className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      )}


      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-purple-400 mb-2">Garage ({totalCars})</h2>
        <p className="text-gray-400">Page {currentPage}</p>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-2xl text-gray-400 mb-2">No Cars in Garage</h3>
          <p className="text-gray-500">Create your first car or generate random cars!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {cars.map((car, index) => (
            <CarTrack
              key={car.id}
              car={car}
              onStart={() => startEngine(car, index + 1)}
              onStop={() => stopEngine(car)}
              onSelect={() => setSelectedCar(car)}
              onDelete={() => deleteCar(car.id)}
              isRacing={raceStates[car.id]?.isRacing || false}
              progress={raceStates[car.id]?.progress || 0}
              finished={raceStates[car.id]?.finished || false}
              disabled={isRacing}
            />
          ))}
        </div>
      )}

      {totalCars > 7 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalCars}
          itemsPerPage={7}
          onPageChange={page => !isRacing && setCurrentPage(page)}
        />
      )}
    </div>
  );
};
