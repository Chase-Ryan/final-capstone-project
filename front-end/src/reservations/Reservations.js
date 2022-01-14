import React, {useState} from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import Form from "./Form";

export default function Reservations(){
    const history = useHistory();
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
        //const errors = [];
        try {
            formData.people = Number(formData.people);
            await createReservation(formData, controller.signal);
            const date = formData.reservation_date;
            history.push(`/dashboard?date=${date}`);
        } catch (error) {
            console.log(error)
        }
        return () => controller.abort();
    }
    return (
        <>
        <Form
        initialFormData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        />
        </>
    );
}