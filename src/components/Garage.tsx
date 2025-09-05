import React, { useState, useEffect, useRef } from 'react';
import { CarForm } from './CarForm';
import { CarTrack } from './CarTrack';
import { Pagination } from './Pagination';
import { api, saveWinner } from '../api';
import { generateRandomCar } from '../utils';
import type { Car } from '../types';

export const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [raceWinner, setRaceWinner] = useState<{ car: Car; time: number; garagePosition: number } | null>(null);
  const [raceStates, setRaceStates] = useState<Record<number, any>>({});
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const intervals = useRef<Record<number, number | null>>({})

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
    await api.createCar(name, color);
    await loadCars();
  };

  const updateCar = async (name: string, color: string) => {
    if (!selectedCar || isRacing) return;
    await api.updateCar(selectedCar.id, name, color);
    setSelectedCar(null);
    await loadCars();
  };

  const deleteCar = async (id: number) => {
    if (isRacing) return;
    await api.deleteCar(id);
    await api.deleteWinner(id);
    await loadCars();
  };

  const generateCars = async () => {
    if (isRacing) return;
    for (let i = 0; i < 100; i++) {
      const car = generateRandomCar();
      await api.createCar(car.name, car.color);
    }
    await loadCars();
  };

  const stopEngine = async (car: Car) => {
    await api.stopEngine(car.id);
    setRaceStates(prev => ({
      ...prev,
      [car.id]: { isRacing: false, progress: 0, finished: false }
    }));
  };

  const animateCar = (car: Car, duration: number, garagePosition: number, winnerTaken: { value: boolean }) => {
    const startTime = Date.now();

    intervals.current[car.id] = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      setRaceStates(prev => ({
        ...prev,
        [car.id]: { ...prev[car.id], progress, isRacing: progress < 100, finished: progress >= 100 }
      }));

      if (progress >= 100) {
        clearInterval(intervals.current[car.id]!);

        if (!winnerTaken.value) {
          winnerTaken.value = true;


          Object.values(intervals.current).forEach(i => i && clearInterval(i));

          intervals.current = {}
          setRaceStates(prev => {
            const updated: Record<number, any> = {};
            Object.keys(prev).forEach(id => {
              updated[+id] = { ...prev[+id], finished: true, isRacing: false };
            });
            return updated;
          });
          
          saveWinner(car.id, elapsed / 1000, garagePosition);
          setRaceWinner({ car, time: elapsed / 1000, garagePosition });
          setShowWinnerPopup(true);
          setIsRacing(false);
        }
      }
    }, 50);
  };


  const startRace = async () => {
    setRaceStates({});
    setIsRacing(true);
    setRaceWinner(null);

    const winnerTaken = { value: false };
    const engines = await Promise.all(cars.map(car => api.startEngine(car.id)));

    engines.forEach((engineInfo, index) => {
      const car = cars[index];
      if (!car) return;
      const duration = engineInfo.distance / engineInfo.velocity;
      animateCar(car, duration, index + 1, winnerTaken);
    });
  };

  const startEngine = async (car: Car, garagePosition: number) => {
    if (raceStates[car.id]?.isRacing) return;

    const engineInfo = await api.startEngine(car.id);
    const duration = engineInfo.distance / engineInfo.velocity;

    animateCar(car, duration, garagePosition, { value: !!raceWinner });
  };

  const resetRace = async () => {
    setIsRacing(false);
    setRaceWinner(null);


    await Promise.all(cars.map(car => stopEngine(car)));
    setRaceStates({});
  };


  useEffect(() => {
    (async () => {
      await loadCars();
    })();
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if(intervals.current) {
        Object.values(intervals.current).forEach((interval) => interval && clearInterval(interval))
        intervals.current = {}
      }
    }
  }, []);

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
              onStart={() =>  startEngine(car, index + 1)}
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
