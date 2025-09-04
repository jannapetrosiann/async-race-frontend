import React, { useState, useEffect } from 'react';
import { Car as CarIcon } from 'lucide-react';
import { Pagination } from './Pagination';
import { api } from '../api';
import type { Winner } from '../types';

interface WinnerWithCar extends Winner {
  name: string;
  color: string;
  garagePosition?: number;
}

export const Winners: React.FC = () => {
  const [winners, setWinners] = useState<WinnerWithCar[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'wins' | 'time'>('wins');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    loadWinners();
  }, [currentPage, sortBy, sortOrder]);

  const loadWinners = async () => {
    try {
      const result = await api.getWinners(currentPage, 10, sortBy, sortOrder);

      const garageData = await api.getCars(1, 1000);
      const allCars = garageData.cars;

      const winnersWithCars: WinnerWithCar[] = [];

      for (const winner of result.winners) {
        try {
          const car = await api.getCar(winner.id);

          const garageIndex = allCars.findIndex((c: any) => c.id === car.id);

          winnersWithCars.push({
            ...winner,
            name: car.name,
            color: car.color,
            garagePosition: garageIndex >= 0 ? garageIndex + 1 : undefined
          });
        } catch {
          winnersWithCars.push({
            ...winner,
            name: `Deleted Car #${winner.id}`,
            color: '#666666',
            garagePosition: undefined
          });
        }
      }

      setWinners(winnersWithCars);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to load winners:', error);
      setWinners([]);
      setTotalCount(0);
    }
  };


  const handleSort = (column: 'wins' | 'time') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('DESC');
    }
    setCurrentPage(1);
  };

  const getSortArrow = (column: 'wins' | 'time') => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'ASC' ? '↑' : '↓';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-yellow-400 mb-2">Winners ({totalCount})</h2>
        <p className="text-gray-400">Page {currentPage}</p>
      </div>

      {winners.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl text-gray-400 mb-2">No Winners Yet</h3>
          <p className="text-gray-500">Start racing to see results!</p>
        </div>
      ) : (
        <>
          <div className="bg-gray-800 rounded-lg overflow-hidden border-2 border-purple-500">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-bold">№</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Car</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Name</th>
                  <th
                    className="px-6 py-4 text-left text-white font-bold cursor-pointer hover:bg-gray-800"
                    onClick={() => handleSort('wins')}
                  >
                    Wins {getSortArrow('wins')}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-white font-bold cursor-pointer hover:bg-gray-800"
                    onClick={() => handleSort('time')}
                  >
                    Best Time (s) {getSortArrow('time')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner, index) => {
                  const pagePosition = (currentPage - 1) * 10 + index + 1;
                  const displayPosition = winner.garagePosition ?? pagePosition;

                  return (
                    <tr key={winner.id} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4 text-white font-bold">{displayPosition}</td>
                      <td className="px-6 py-4">
                        <CarIcon
                          size={32}
                          color={winner.color}
                          style={{ filter: `drop-shadow(0 0 4px ${winner.color})` }}
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">{winner.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-bold">{winner.wins}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                          {winner.time && winner.time > 0
                            ? winner.time.toFixed(2)
                            : (() => {
                              const localWinners = JSON.parse(localStorage.getItem("localWinners") || "{}");
                              const localTime = localWinners[winner.id];
                              return localTime ? localTime.toFixed(2) : "-";
                            })()}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalCount > 10 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={10}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
