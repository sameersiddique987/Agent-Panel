import React, { useState, useEffect } from "react";
import { createFlight, fetchFlights } from "../api"; 

// 🛫 Define Flight Type
interface Flight {
  _id: string;
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  duration: string;
  price: number;
  logoUrl?: string;
}

// 📝 Define Form Data Type
interface FlightFormData {
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  duration: string;
  price: number;
  logo: File | null;
}

const FlightManagement: React.FC = () => {
  const [formData, setFormData] = useState<FlightFormData>({
    airline: "",
    flight_number: "",
    departure_airport: "",
    arrival_airport: "",
    departure_time: "",
    arrival_time: "",
    status: "",
    duration: "",
    price: 0,
    logo: null,
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>("");

  // 🖊 Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📤 Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
    }
  };

  // ✈ Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFlight(formData); // ✅ Ensure it's FlightFormData
      setResponseMessage("Flight added successfully!");
      setFormData({
        airline: "",
        flight_number: "",
        departure_airport: "",
        arrival_airport: "",
        departure_time: "",
        arrival_time: "",
        status: "",
        duration: "",
        price: 0,
        logo: null,
      });
      loadFlights(); // Load flights after adding
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred, please try again.");
    }
  };

  // 🔄 Fetch Flights
  const loadFlights = async () => {
    try {
      const data: Flight[] = await fetchFlights(); // ✅ Ensure it's Flight[]
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  return (
    <div>
      <h1>Flight Management</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="airline" placeholder="Airline Name" value={formData.airline} onChange={handleInputChange} required />
        <input type="text" name="flight_number" placeholder="Flight Number" value={formData.flight_number} onChange={handleInputChange} required />
        <input type="text" name="departure_airport" placeholder="Departure Airport" value={formData.departure_airport} onChange={handleInputChange} required />
        <input type="text" name="arrival_airport" placeholder="Arrival Airport" value={formData.arrival_airport} onChange={handleInputChange} required />
        <input type="datetime-local" name="departure_time" value={formData.departure_time} onChange={handleInputChange} required />
        <input type="datetime-local" name="arrival_time" value={formData.arrival_time} onChange={handleInputChange} required />
        <input type="text" name="status" placeholder="Status" value={formData.status} onChange={handleInputChange} required />
        <input type="text" name="duration" placeholder="Duration" value={formData.duration} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
        <input type="file" name="logo" onChange={handleFileChange} />
        <button type="submit">Add Flight</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}

      <h2>All Flights</h2>
      <table>
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Airline</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Logo</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight._id}>
              <td>{flight.flight_number}</td>
              <td>{flight.airline}</td>
              <td>{flight.departure_airport}</td>
              <td>{flight.arrival_airport}</td>
              <td>{new Date(flight.departure_time).toLocaleString()}</td>
              <td>{new Date(flight.arrival_time).toLocaleString()}</td>
              <td>{flight.status}</td>
              <td>{flight.duration}</td>
              <td>${flight.price.toFixed(2)}</td>
              <td>{flight.logoUrl && <img src={`http://localhost:5000${flight.logoUrl}`} alt="Airline Logo" width="50" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightManagement;
