import React, { useState, useEffect } from "react";
import { listReservations, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

export default function TableList({ table, loadDashboard }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory();
  useEffect(() => {
    listReservations().then(setReservations);
  }, []);

  const foundRes = reservations.find(
    (reservation) =>
      Number(reservation.reservation_id) === Number(table.reservation_id)
  );

  async function handleFinish(table_id) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await clearTable(table_id);
        history.go();
      } catch (error) {
        setError(error);
      }
    }
  }
  return (
    <>
      <ErrorAlert error={error} />
      <h3>Name: {table.table_name}</h3>
      <p>Capacity: {table.capacity}</p>
      <p data-table-id-status={`${table.table_id}`}>
        Status:{" "}
        {table.reservation_id ? <span>Occupied by </span> : <span>Free</span>}
        {foundRes && (
          <span>
            {foundRes.first_name} {foundRes.last_name}
          </span>
        )}
      </p>
      {table.reservation_id && (
        <button
          type="submit"
          data-table-id-finish={`${table.table_id}`}
          onClick={() => handleFinish(table.table_id)}
        >
          Finish
        </button>
      )}
    </>
  );
}
