import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import {
  createReservation,
  readReservation,
  updateReservation,
} from "../utils/api";
import "./Reservations.css";
import Button from "react-bootstrap/Button";

//Form for both create and edit
export default function Form() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  useEffect(() => {
    const controller = new AbortController();
    async function loadReservation() {
      try {
        if (reservation_id) {
          const response = await readReservation(
            reservation_id,
            controller.signal
          );
          setFormData(response);
        }
      } catch (err) {
        setError(err);
      }
    }
    loadReservation();

    return () => controller.abort();
  }, [reservation_id]);

  function handleFormChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleNumberInput(e) {
    setFormData({
      ...formData,
      [e.target.id]: Number(e.target.value),
    });
  }

  //if there is a reservation_id, it means the reservation already exists so it will update, otherwise create a new reservation
  async function handleSubmit(e) {
    e.preventDefault();
    const controller = new AbortController();
    try {
      if (reservation_id) {
        await updateReservation(formData, controller.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
        setFormData({ ...initialFormState });
      } else {
        await createReservation(formData, controller.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
        setFormData({ ...initialFormState });
      }
    } catch (err) {
      setError(err);
    }
    return () => controller.abort();
  }

  function handleCancel() {
    history.goBack();
  }

  return (
    <>
      {reservation_id ? (
        <h3 className="text-center create-header">Edit a Reservation</h3>
      ) : (
        <h3 className="text-center create-header">Create a Reservation</h3>
      )}
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleFormChange}
            required
            className="form-control"
          />
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleFormChange}
            required
            className="form-control"
          />
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            type="tel"
            name="mobile_number"
            id="mobile_number"
            placeholder="Mobile Number"
            value={formData.mobile_number}
            onChange={handleFormChange}
            required
            className="form-control"
          />
          <label htmlFor="people">Number of Guests</label>
          <input
            type="number"
            name="people"
            id="people"
            placeholder="Number of Guests"
            value={formData.people}
            onChange={handleNumberInput}
            required
            min="1"
            className="form-control"
          />
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            type="date"
            name="reservation_date"
            id="reservation_date"
            placeholder="YYYY-MM-DD"
            value={formData.reservation_date}
            onChange={handleFormChange}
            required
            className="form-control"
          />
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            type="time"
            name="reservation_time"
            id="reservation_time"
            placeholder="HH:MM"
            value={formData.reservation_time}
            onChange={handleFormChange}
            required
            className="form-control"
          />
        </div>
        <div className="text-center">
          <Button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="submit-btn">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
