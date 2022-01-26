import React from "react";
import Reservation from "./Reservations";

export default function ReservationsList({ reservations }) {
  return (
    <div>
      <div className="reservations-container">
        {reservations.map((reservation) => (
          <Reservation
            key={reservation.reservation_id}
            reservation={reservation}
          />
        ))}
      </div>
    </div>
  );
};