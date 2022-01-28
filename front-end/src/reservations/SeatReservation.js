import React, { useEffect, useState } from "react";
import { listTables, updateTable } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import "../tables/Tables.css";
import Button from "react-bootstrap/Button";

export default function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [seatError, setSeatError] = useState(null);
  const [selectValue, setSelectValue] = useState("");

  const { reservation_id } = useParams();

  const history = useHistory();

  useEffect(() => {
    async function loadTables() {
      const controller = new AbortController();
      setSeatError(null);
      try {
        const response = await listTables(controller.signal);
        setTables(response);
      } catch (error) {
        setSeatError(error);
      }
      return () => controller.abort();
    }
    loadTables();
  }, []);

  function handleFormChange(e) {
    setSelectValue({ [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const controller = new AbortController();
    try {
      await updateTable(
        reservation_id,
        Number(selectValue.table_id),
        controller.signal
      );
      history.push("/dashboard");
    } catch (error) {
      setSeatError(error);
    }
    return () => controller.abort();
  }

  function handleCancel() {
    history.goBack();
  }

  return (
    <div>
      <h1 className="text-center create-header">Seat a Reservation</h1>
      <ErrorAlert error={seatError} />

      <form className="text-center" onSubmit={handleSubmit}>
        <p>Table name - Table capacity</p>
        {tables && (
          <div className="form-group">
            <select
              name="table_id"
              required
              onChange={handleFormChange}
              className="seat-select"
            >
              <option value=""></option>
              {tables.map((table) => (
                <option value={table.table_id} key={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
        )}
        <Button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" className="submit-btn">
          Submit
        </Button>
      </form>
    </div>
  );
}
