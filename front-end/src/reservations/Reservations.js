import React, { useState } from "react";
import { useHistory } from "react-router";
import { cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Reservations.css";
import Button from "react-bootstrap/Button";

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
        <div className="reservation text-center">
          <h2 className="reservation-name">
            {reservation.first_name} {reservation.last_name}
          </h2>
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p>Reservation Date: {reservation.reservation_date}</p>
          <p>Reservation Time: {reservation.reservation_time}</p>
          <p>People: {reservation.people}</p>
          <p data-reservation-id-status={`${reservation.reservation_id}`}>
            Status: {reservation.status}
          </p>
          <div className="reservation-btns">
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <Button>Edit</Button>
            </a>
            {reservation.status === "booked" && (
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <Button>Seat</Button>
              </a>
            )}
            <Button
              onClick={() => handleCancel(reservation.reservation_id)}
              data-reservation-id-cancel={`${reservation.reservation_id}`}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
