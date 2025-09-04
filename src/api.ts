const API_BASE = 'http://127.0.0.1:3000';

export const getCars = async (page = 1, limit = 7) => {
  const response = await fetch(`${API_BASE}/garage?_page=${page}&_limit=${limit}`);
  const cars = await response.json();
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
  return { cars, totalCount };
};


export const getCar = async (id: number) => {
  const response = await fetch(`${API_BASE}/garage/${id}`);
  return response.json();
};

export const createCar = async (name: string, color: string) => {
  const response = await fetch(`${API_BASE}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return response.json();
};


export const updateCar = async (id: number, name: string, color: string) => {
  const response = await fetch(`${API_BASE}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return response.json();
};


export const deleteCar = async (id: number) => {
  await fetch(`${API_BASE}/garage/${id}`, { method: 'DELETE' });
};


export const startEngine = async (id: number) => {
  const response = await fetch(`${API_BASE}/engine?id=${id}&status=started`, { 
    method: 'PATCH' 
  });
  return response.json();
};


export const stopEngine = async (id: number) => {
  const response = await fetch(`${API_BASE}/engine?id=${id}&status=stopped`, { 
    method: 'PATCH' 
  });
  return response.json();
};


export const driveCar = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/engine?id=${id}&status=drive`, { 
      method: 'PATCH' 
    });
    return { success: response.ok };
  } catch{
    return { success: false };
  }
};


export const getWinners = async (page = 1, limit = 10, sort = 'wins', order = 'DESC') => {
  const url = `${API_BASE}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;
  const response = await fetch(url);
  const winners = await response.json();
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
  return { winners, totalCount };
};

export const saveWinner = async (id: number, time: number, garagePosition: number) => {
  try {
   const response = await fetch(`${API_BASE}/winners/${id}`);
    if (response.ok) {
      const winner = await response.json();
      await fetch(`${API_BASE}/winners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wins: winner.wins + 1,
          time: Math.min(winner.time, time)
        }),
      });
    } else {
      
      await fetch(`${API_BASE}/winners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, wins: 1, time }),
      });
    }
  } catch (error) {
    console.error('Failed to save winner:', error);
  }
};


export const deleteWinner = async (id: number) => {
   await fetch(`${API_BASE}/winners/${id}`, { method: 'DELETE' });
  };

export const api = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  startEngine,
  stopEngine,
  driveCar,
  getWinners,
  saveWinner,
  deleteWinner,
}; 