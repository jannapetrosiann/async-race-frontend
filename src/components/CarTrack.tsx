import React from 'react';
import { Car as CarIcon } from 'lucide-react';
import type { Car } from '../types';

interface CarTrackProps {
  car: Car;
  onStart: () => void;
  onStop: () => void;
  onSelect: () => void;
  onDelete: () => void;
  isRacing: boolean;
  progress: number;
  finished: boolean;
  disabled: boolean;
}

export const CarTrack: React.FC<CarTrackProps> = ({ 
  car, 
  onStart, 
  onStop, 
  onSelect, 
  onDelete, 
  isRacing, 
  progress, 
  finished, 
  disabled 
}) => {
  return (
    <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-4">
     
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button
          onClick={onStart}
          disabled={isRacing || disabled}
          className={`px-3 py-2 rounded font-bold text-sm ${
            isRacing || disabled
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          START
        </button>
        
        <button
          onClick={onStop}
          disabled={!isRacing || disabled}
          className={`px-3 py-2 rounded font-bold text-sm ${
            !isRacing || disabled
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          STOP
        </button>
        
        <button
          onClick={onSelect}
          disabled={disabled}
          className={`px-3 py-2 rounded font-bold text-sm ${
            disabled
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-600 text-white hover:bg-yellow-700'
          }`}
        >
          SELECT
        </button>
        
        <button
          onClick={onDelete}
          disabled={disabled}
          className={`px-3 py-2 rounded font-bold text-sm ${
            disabled
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-700 text-white hover:bg-red-800'
          }`}
        >
          DELETE
        </button>

        <div className="flex items-center gap-3">
          <span className="text-white font-bold">{car.name}</span>
          <div
            className="w-6 h-6 rounded border-2 border-white"
            style={{ backgroundColor: car.color }}
          />
        </div>
      </div>

      
      <div className="bg-grey-700 border-4 border-purple-500 rounded-lg h-20 relative overflow-hidden">
        
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-green-500" />
        
        
        <div className="absolute right-2 top-0 bottom-0 w-1 bg-red-500" />
        
        
        <div 
          className="absolute top-1/2 left-0 right-0 h-0.5"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 1px, transparent 10px, #9CA3AF 10px, #9CA3AF 20px)'
          }}
        />

       
        <div
          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-50"
          style={{
            left: `${Math.min(progress * 0.85, 85) + 5}%`
          }}
        >
          <CarIcon 
            size={32} 
            color={car.color}
            style={{
              filter: `drop-shadow(0 0 8px ${car.color})`,
              transform: isRacing ? 'translateX(2px)' : 'none'
            }}
          />
        </div>

        
        {finished && progress >= 100 && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-2xl animate-bounce">
            🏁
          </div>
        )}
      </div>

    
      <div className="mt-3 h-2 bg-gray-600 rounded-full ">
        <div
          className="h-full bg-purple-500 rounded-full transition-all duration-100"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};