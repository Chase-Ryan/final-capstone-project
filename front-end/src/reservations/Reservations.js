import React, { useState } from "react";
import { useHistory } from "react-router";
import { cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Reservations({ reservation }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  async function handleCancel(reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await cancelReservation(reservation_id);
        history.go();
      } catch (err) {
        setError(err);
      }
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      {reservation.status !== "finished" && (
        <div>
          <h2>
            {reservation.first_name} {reservation.last_name}
          </h2>
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p>Reservation Date: {reservation.reservation_date}</p>
          <p>Reservation Time: {reservation.reservation_time}</p>
          <p>People: {reservation.people}</p>
          <p data-reservation-id-status={`${reservation.reservation_id}`}>
            Status: {reservation.status}
          </p>
          <div>
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button>Edit</button>
            </a>
            {reservation.status === "booked" && (
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <button>Seat</button>
              </a>
            )}
            <button
              onClick={() => handleCancel(reservation.reservation_id)}
              data-reservation-id-cancel={`${reservation.reservation_id}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
