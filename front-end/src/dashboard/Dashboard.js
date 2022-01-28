import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
import { listReservations, listTables } from "../utils/api";
import ReservationsList from "../reservations/ReservationsList";
import TableList from "../tables/TableList";
import Button from "react-bootstrap/Button";


export default function Dashboard() {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(query.get("date") || today());

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }
  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  //date button functions
  function handlePreviousDate() {
    setDate((date) => previous(date));
    history.push(`dashboard?date=${previous(date)}`);
  }

  function handleNextDate() {
    setDate((date) => next(date));
    history.push(`dashboard?date=${next(date)}`);
  }

  function handleToday() {
    setDate(today());
    history.push(`dashboard?date=${today()}`);
  }
  return (
    <main>
      <div className="dashboard-header">
        <h1 className="text-center">Dashboard</h1>
        <div>
          <h3 className="mb-0 text-center">Reservations for {date}</h3>
          <div className="nav-btns">
            <Button onClick={handlePreviousDate}>Previous</Button>
            <Button onClick={handleToday}>Today</Button>
            <Button onClick={handleNextDate}>Next</Button>
          </div>
        </div>
        <ErrorAlert error={error} />
        {reservations.length > 0 ? (
          <h2 className="text-center dashboard-section-header">Reservations</h2>
        ) : (
          <div className="text-center">
          <h2 className="dashboard-section-header">No Reservations</h2>
          <a href="reservations/new">
            <Button className="primary-btn">
              Add A Reservation?
            </Button>
          </a>
        </div>
        )}
        <ReservationsList reservations={reservations} />
        <h2 className="text-center dashboard-section-header">Tables</h2>
        {tables && (
          <div className="tables-container">
            {tables.map((table) => (
              <TableList
                key={table.table_id}
                table={table}
                loadDashboard={loadDashboard}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


