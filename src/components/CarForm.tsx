import React, { useState, useEffect } from 'react';
import { generateRandomCar } from '../utils';
import type { Car } from '../types';

interface CarFormProps {
  car?: Car;
  onSubmit: (name: string, color: string) => void;
  onCancel?: () => void;
  isUpdate?: boolean;
}

export const CarForm: React.FC<CarFormProps> = ({ 
  car, 
  onSubmit, 
  onCancel, 
  isUpdate = false 
}) => {
  const [name, setName] = useState(car?.name || '');
  const [color, setColor] = useState(car?.color || '#3B82F6');
  const [error, setError] = useState('');

  useEffect(() => {
    if (car) {
      setName(car.name);
      setColor(car.color);
    }
  }, [car]);


  const handleSubmit = (e :React.FormEvent ) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
  
    if (!trimmedName) {
      setError('Car name cannot be empty');
      return;
    }
    
    if (trimmedName.length > 50) {
      setError('Car name too long (max 50 characters)');
      return;
    }
    
    setError('');
    onSubmit(trimmedName, color);
    

    if (!isUpdate) {
      setName('');
      setColor('#3B82F6');
    }
  };


  const handleGenerate = () => {
    const randomCar = generateRandomCar();
    setName(randomCar.name);
    setColor(randomCar.color);
    setError('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500">
      <form onSubmit={handleSubmit} className="flex gap-4 items-center flex-wrap">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Car name"
          className={`flex-1 min-w-48 px-4 py-3 bg-gray-700 border-2 rounded-lg text-white ${
            error ? 'border-red-500' : 'border-purple-500'
          }`}
        />
        
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 border-2 border-purple-500 rounded-lg cursor-pointer"
          />
          <span className="text-grey-400 font-mono text-sm">{color}</span>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
        >
          {isUpdate ? 'UPDATE' : 'CREATE'}
        </button>

        {!isUpdate && (
          <button
            type="button"
            onClick={handleGenerate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            GENERATE
          </button>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
          >
            CANCEL
          </button>
        )}
      </form>
      
      {error && (
        <div className="text-red-400 text-sm mt-3 font-bold">
          {error}
        </div>
      )}
    </div>
  );
};