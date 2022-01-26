import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, readReservation } from "../utils/api";

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
        const abortController = new AbortController();
        async function loadReservation() {
          try {
            if (reservation_id) {
              const response = await readReservation(
                reservation_id,
                abortController.signal
              );
              setFormData(response);
            }
          } catch (err) {
            setError(err);
          }
        }
        loadReservation();
    
        return () => abortController.abort();
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
      async function handleSubmit(e) {
        e.preventDefault();
        const abortController = new AbortController();
        try {
            await createReservation(formData, abortController.signal);
            history.push(`/dashboard?date=${formData.reservation_date}`);
            setFormData({ ...initialFormState });
        } catch (err) {
          setError(err);
        }
        return () => abortController.abort();
      }

    function handleCancel() {
        history.goBack();
    }

    return (
        <>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>
                        Guest Information
                    </legend>
                    <div>
                        <label htmlFor="first_name">First Name</label>
                        <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name">Last Name</label>
                        <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile_number">Mobile Number</label>
                        <input
                        type="tel"
                        name="mobile_number"
                        id="mobile_number"
                        placeholder="Mobile Number"
                        value={formData.mobile_number}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
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
                        />
                    </div>
                    <div>
                        <label htmlFor="reservation_date">Reservation Date</label>
                        <input
                        type="date"
                        name="reservation_date"
                        id="reservation_date"
                        placeholder="YYYY-MM-DD"
                        value={formData.reservation_date}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="reservation_time">Reservation Time</label>
                        <input
                        type="time"
                        name="reservation_time"
                        id="reservation_time"
                        placeholder="HH:MM"
                        value={formData.reservation_time}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    </fieldset>
                    <div>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit">
                            Submit
                        </button>
                    </div>
            </form>
        </>
        )
}