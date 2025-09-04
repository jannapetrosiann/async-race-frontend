const CAR_BRANDS = [
  'Tesla', 'BMW', 'Mercedes', 'Ford', 'Toyota', 
  'Honda', 'Audi', 'Porsche', 'Ferrari', 'Lamborghini',
  'Chevrolet', 'Nissan'
];

const CAR_MODELS = [
  'Model S', 'X5', 'E-Class', 'Mustang', 'Camry', 
  'Civic', 'A4', '911', 'F40', 'Aventador',
  'Corvette', 'GT-R'
];

const COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
  '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
  '#808080', '#000000', '#FFFFFF', '#8B5CF6', '#EC4899', '#06B6D4'
];

const getRandomItem = <Type>(array: Type[]): Type=> {
  return array[Math.floor(Math.random() * array.length)]!;
};

export const generateRandomCar = () => {
  const brand = getRandomItem(CAR_BRANDS);
  const model = getRandomItem(CAR_MODELS);
  const color = getRandomItem(COLORS);
  
  return {
    name: `${brand} ${model}`,
    color: color
  };
};

export const validateCarName = (name: string): string | null => {
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return 'Car name cannot be empty';
  }
  if (trimmed.length > 50) {
    return 'Car name cannot exceed 50 characters';
  }
  
  return null;
};