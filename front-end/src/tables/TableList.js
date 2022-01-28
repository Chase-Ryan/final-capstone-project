import React, { useState, useEffect } from "react";
import { listReservations, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import "./Tables.css";
import Button from 'react-bootstrap/Button';

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
    <div className="table">
      <ErrorAlert error={error} />
      <h4 className="table-name text-center">Name: {table.table_name}</h4>
      <hr />
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
        <Button
          type="submit"
          data-table-id-finish={`${table.table_id}`}
          onClick={() => handleFinish(table.table_id)}
        >
          Finish
        </Button>
      )}
    </div>
  );
}
