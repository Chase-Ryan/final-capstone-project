import React, {useState} from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import Form from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

export default function Reservations(){
    const history = useHistory();
    const [reservationsError, setReservationsError] = useState(null);
    const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
    }
    const [formData, setFormData] = useState({...initialFormData});
    function handleFormChange(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    async function handleSubmit(e){
        e.preventDefault();
        const controller = new AbortController();
        try {
            formData.people = Number(formData.people);
            await createReservation(formData, controller.signal);
            const date = formData.reservation_date;
            history.push(`/dashboard?date=${date}`);
        } catch (error) {
            setReservationsError(error);
        }
        return () => controller.abort();
    }
    return (
        <>
        <ErrorAlert error={reservationsError} />
        <Form
        initialFormData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        />
        </>
    );
}