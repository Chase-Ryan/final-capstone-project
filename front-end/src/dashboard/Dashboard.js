import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
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
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(query.get("date") || today());
  
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    //console.log(Date.now(), "date.now");
    
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
      console.log(date, "date")
    return () => abortController.abort();
  }

  const handlePreviousDate = () => {
    setDate(previous(date));
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDate = () => {
    setDate(next(date));
    history.push(`dashboard?date=${next(date)}`);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        <button onClick={() => setDate(today())}>
          Today
        </button>
        <button onClick={handlePreviousDate}>
          Previous
        </button>
        <button onClick={handleNextDate}>
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
