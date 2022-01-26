import React, { useState, useEffect } from "react";
import { listReservations, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

export default function TableList({ table, loadDashboard }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory()
  useEffect(() => {
    listReservations().then(setReservations);
  }, []);

  const foundRes = reservations.find(
    (reservation) =>
      Number(reservation.reservation_id) === Number(table.reservation_id)
  );

  return (
    <>
      <ErrorAlert error={error} />
      <h3>Name: {table.table_name}</h3>
      <p>Capacity: {table.capacity}</p>
      <p data-table-id-status={`${table.table_id}`}>
        Status: {table.reservation_id ? <span>Occupied by </span> : <span>Free</span>}
        {foundRes && (
          <span>
            {foundRes.first_name} {foundRes.last_name}
          </span>
        )}
      </p>
    </>
  );
};
