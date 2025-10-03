export interface Split {
  number: number;
  duration: number;
  distance: number;
  avgSpeed: number;
  pace: string;
  coordinates: [number, number][];
  startTime: number;
}

export interface Activity {
  id: string;
  userId: string;
  username: string;
  type: 'corrida' | 'caminhada' | 'ciclismo' | 'treino-tiro';
  date: string;
  duration: number; // seconds
  distance: number; // km
  pace: string;
  speed: number;
  calories?: number;
  coordinates: [number, number][];
  splits?: Split[]; // for sprint training
  photo?: string;
  feeling?: string;
  notes?: string;
}

export interface User {
  name: string;
  username: string;
  email: string;
  photo: string | null;
  friends: string[]; // array of usernames
}
