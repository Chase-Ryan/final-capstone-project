import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";

export default function TableForm() {
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

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
    const controller = new AbortController();
    try {
      await createTable(formData, controller.signal);
      setFormData({ ...initialFormState });
      history.push("/dashboard");
    } catch (error) {
      setTablesError(error);
    }
    return () => controller.abort();
  }
  const handleCancle = () => {
    history.goBack();
}
  return (
    <div>
      <h2>Create a table</h2>
      <ErrorAlert error={tablesError} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="table_name">Table Name</label>
          <input
            type="text"
            name="table_name"
            id="table_name"
            placeholder="Table Name"
            value={formData.table_name}
            onChange={handleFormChange}
            minLength={2}
            required
          />
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            placeholder="Number of guests"
            min={1}
            value={formData.capacity}
            onChange={handleNumberInput}
            required
          />
        </div>
        <button onClick={handleCancle}>
          Cancel
        </button>
        <button type="submit" >
          Submit
        </button>
      </form>
    </div>
  );
}
