import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
import ReservationsList from "../reservations/ReservationsList";
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
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

  function handlePreviousDate() {
    setDate((date) => previous(date));
    history.push(`dashboard?date=${previous(date)}`);
  };

  function handleNextDate() {
    setDate((date) => next(date));
    history.push(`dashboard?date=${next(date)}`);
  };

  function handleToday() {
    setDate(today());
    history.push(`dashboard?date=${today()}`)
  }
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        <button onClick={handlePreviousDate}>
          Previous
        </button>
        <button onClick={handleToday}>
          Today
        </button>
        <button onClick={handleNextDate}>
          Next
        </button>
      </div>
      <ErrorAlert error={error} />
      <ReservationsList reservations={reservations} />
      <h2>Tables</h2>
      {tables && (
        <div>
          {tables.map((table) => (
            <TableList
              key={table.table_id}
              table={table}
              loadDashboard={loadDashboard}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Dashboard;
