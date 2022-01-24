import React from "react";
import { useHistory } from "react-router";

export default function Form({
    initialFormData,
    handleFormChange,
    handleSubmit,
}) {
    const history = useHistory();
    const handleCancle = () => {
        history.goBack();
    }

    return (
        initialFormData && (
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>
                        Guest Information
                    </legend>
                    <div>
                        <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="First Name"
                        value={initialFormData?.first_name}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
                        <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Last Name"
                        value={initialFormData?.last_name}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
                        <input
                        type="tel"
                        name="mobile_number"
                        id="mobile_number"
                        placeholder="Mobile Number"
                        value={initialFormData?.mobile_number}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
                        <input
                        type="number"
                        name="people"
                        id="people"
                        placeholder="Number of Guests"
                        value={initialFormData?.people}
                        onChange={handleFormChange}
                        required
                        min="1"
                        />
                    </div>
                    <div>
                        <input
                        type="date"
                        name="reservation_date"
                        id="reservation_date"
                        placeholder="YYYY-MM-DD"
                        value={initialFormData?.reservation_date}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    <div>
                        <input
                        type="time"
                        name="reservation_time"
                        id="reservation_time"
                        placeholder="HH:MM"
                        value={initialFormData?.reservation_time}
                        onChange={handleFormChange}
                        required
                        />
                    </div>
                    </fieldset>
                    <div>
                        <button type="submit">
                            Submit
                        </button>
                        <button type="button" onClick={handleCancle}>
                            Cancel
                        </button>
                    </div>
            </form>
        )
    );
}