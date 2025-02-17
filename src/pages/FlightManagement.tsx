import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createFlight, fetchFlights, Flight } from '../api';

const FlightManagement = () => {
  const [formData, setFormData] = useState<Flight>({
    id: '',
    airline: '',
    departure: '',
    arrival: '',
    duration: '',
    price: 0,
    departure_time: '',
    arrival_time: '',
    status: '',
    logo: null,
    flight_number: '',
    departure_airport: '',
    arrival_airport: '',
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file: File = e.target.files[0];
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createFlight({ ...formData, price: Number(formData.price) });
      setResponseMessage('Flight added successfully!');
      setFormData({
        id: '',
        airline: '',
        departure: '',
        arrival: '',
        duration: '',
        price: 0,
        departure_time: '',
        arrival_time: '',
        status: '',
        logo: null,
        flight_number: '',
        departure_airport: '',
        arrival_airport: '',
      });
      loadFlights();
    } catch (error) {
      setResponseMessage('An error occurred, please try again.');
    }
  };

  const loadFlights = async () => {
    try {
      const data = await fetchFlights();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  return (
    <div>
      <h1>Flight Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="airline"
          placeholder="Airline Name"
          value={formData.airline}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="flight_number"
          placeholder="Flight Number"
          value={formData.flight_number}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="departure_airport"
          placeholder="Departure Airport"
          value={formData.departure_airport}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="arrival_airport"
          placeholder="Arrival Airport"
          value={formData.arrival_airport}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="departure_time"
          placeholder="Departure Time"
          value={formData.departure_time}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="arrival_time"
          placeholder="Arrival Time"
          value={formData.arrival_time}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="logo"
          onChange={handleFileChange}
        />
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
          {flights.map(flight => (
            <tr key={flight.id}>
              <td>{flight.flight_number}</td>
              <td>{flight.airline}</td>
              <td>{flight.departure_airport}</td>
              <td>{flight.arrival_airport}</td>
              <td>{new Date(flight.departure_time).toLocaleString()}</td>
              <td>{new Date(flight.arrival_time).toLocaleString()}</td>
              <td>{flight.status}</td>
              <td>{flight.duration}</td>
              <td>{typeof flight.price === 'number' ? `$${flight.price.toFixed(2)}` : 'N/A'}</td>
              <td>
                {flight.logo && <img src={URL.createObjectURL(flight.logo)} alt="Airline Logo" width="50" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightManagement;