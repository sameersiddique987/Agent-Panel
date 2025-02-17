// Define the Query and Note interfaces
export interface Note {
  text: string;
  createdAt: string;
}

export interface Query {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  notes: Note[];
}

// Define the Flight interface
export interface Flight {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  status: string;
  logo: File | null;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
}

// Define the Popup interface
export interface Popup {
  imageUrl: string;
}

// Define the API functions
export function fetchQueries(): Promise<Query[]>;
export function updateQuery(queryId: string, updates: Partial<Query>): Promise<Query>;
export function addQueryNote(queryId: string, note: Note): Promise<Query>;
export function createQuery(query: Omit<Query, '_id' | 'notes'>): Promise<Query>;

export function fetchFlights(): Promise<Flight[]>;
export function createFlight(flightData: Omit<Flight, 'id'>): Promise<Flight>;

export function uploadPopupImage(file: File): Promise<{ message: string, imageUrl: string }>;
export function fetchPopupImage(): Promise<Popup>;