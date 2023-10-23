import "./DateForm.css";
import { useState } from "react";

const DateForm = () => {
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");

  const handleStartTime = (event: any) => {
    const time = event.target.value;
    setCurrentStartTime(time);
  };

  const handleEndTime = (event: any) => {
    const time = event.target.value;
    setCurrentEndTime(time);
  };

  return (
    <div className="dateContainer">
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-secondary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          id="eachButton"
        >
          {!currentStartTime ? "Start Time" : currentStartTime}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <select
            className="form-select"
            aria-label="Size 3 select example"
            value={currentStartTime}
            onChange={handleStartTime}
          >
            <option>Time</option>
            <option value="0">0 AM</option>
            <option value="1">1 AM</option>
            <option value="2">2 AM</option>
            <option value="3">3 AM</option>
            <option value="4">4 AM</option>
            <option value="5">5 AM</option>
            <option value="6">6 AM</option>
            <option value="7">7 AM</option>
            <option value="8">8 AM</option>
            <option value="9">9 AM</option>
            <option value="10">10 AM</option>
            <option value="11">11 AM</option>
            <option value="12">12 PM</option>
            <option value="13">13 PM</option>
            <option value="14">14 PM</option>
            <option value="15">15 PM</option>
            <option value="16">16 PM</option>
            <option value="17">17 PM</option>
            <option value="18">18 PM</option>
            <option value="19">19 PM</option>
            <option value="20">20 PM</option>
            <option value="21">21 PM</option>
            <option value="22">22 PM</option>
            <option value="23">23 PM</option>
            <option value="24">24 PM</option>
          </select>
        </ul>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-secondary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          id="eachButton"
        >
          {!currentEndTime ? "End Time" : currentEndTime}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <select
            className="form-select"
            aria-label="Size 3 select example"
            value={currentEndTime}
            onChange={handleEndTime}
          >
            <option>Time</option>
            <option value="0">0 AM</option>
            <option value="1">1 AM</option>
            <option value="2">2 AM</option>
            <option value="3">3 AM</option>
            <option value="4">4 AM</option>
            <option value="5">5 AM</option>
            <option value="6">6 AM</option>
            <option value="7">7 AM</option>
            <option value="8">8 AM</option>
            <option value="9">9 AM</option>
            <option value="10">10 AM</option>
            <option value="11">11 AM</option>
            <option value="12">12 PM</option>
            <option value="13">13 PM</option>
            <option value="14">14 PM</option>
            <option value="15">15 PM</option>
            <option value="16">16 PM</option>
            <option value="17">17 PM</option>
            <option value="18">18 PM</option>
            <option value="19">19 PM</option>
            <option value="20">20 PM</option>
            <option value="21">21 PM</option>
            <option value="22">22 PM</option>
            <option value="23">23 PM</option>
            <option value="24">24 PM</option>
          </select>
        </ul>
      </div>
    </div>
  );
};
export default DateForm;
