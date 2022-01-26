import React, {useState} from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

export default function Reservations({ reservation }){

    const history = useHistory();
    const [error, setError] = useState(null);
    function handleCancel() {
        history.goBack();
    }
    
    return (
        <>
        <ErrorAlert error={error} />
            <div>
                <h2>{reservation.first_name} {reservation.last_name}</h2>
                <p>Mobile Number: {reservation.mobile_number}</p>
                <p>Reservation Date:{" "} {reservation.reservation_date}</p>
                <p>Reservation Time: {reservation.reservation_time}</p>
                <p>People: {reservation.people}</p>
                <p data-reservation-id-status={`${reservation.reservation_id}`}>
                    Status: {reservation.status}
                </p>
                <div>
                    {reservation.status === "booked" && (
                        <a href={`/reservations/${reservation.reservation_id}/seat`}>
                            <button>
                                Seat
                            </button>
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}