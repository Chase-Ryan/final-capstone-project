import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsList from "../reservations/ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";


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
      <h2>Search by Phone Number</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="mobile_number"
          value={phoneNumber}
          onChange={handleChange}
          placeholder="number"
          required
        />
      <button type="submit">
        Find
      </button>
      </form>
      {reservations.length > 0 && (
        <ReservationsList reservations={reservations} />
      )}
      {noResults && reservations.length === 0 ? (
        <h3>No reservations found</h3>
      ) : (
        ""
      )}
    </>
  );
};
