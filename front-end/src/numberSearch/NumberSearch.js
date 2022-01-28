import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsList from "../reservations/ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";
import "./NumberSearch.css";
import Button from 'react-bootstrap/Button';

export default function NumberSearch() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  function handleChange(e) {
    setPhoneNumber(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const controller = new AbortController();
    setError(null);
    setNoResults(false);
    try {
      const data = await listReservations(
        { mobile_number: phoneNumber },
        controller.signal
      );
      setReservations(data);
      setNoResults(true);
      setPhoneNumber("");
    } catch (err) {
      setError(err);
    }
    return () => controller.abort();
  }

  return (
    <>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="text-center">
        <h2 className="search-header">Search by Phone Number</h2>
          <input
            type="text"
            name="mobile_number"
            value={phoneNumber}
            onChange={handleChange}
            placeholder="Number"
            required
            className="search-input"
          />
          <Button type="submit">
            Search
          </Button>
      </form>
      {reservations.length > 0 && (
        <ReservationsList reservations={reservations} />
      )}
      {noResults && reservations.length === 0 ? (
        <h3 className="text-center">No reservations found</h3>
      ) : (
        ""
      )}
    </>
  );
}
