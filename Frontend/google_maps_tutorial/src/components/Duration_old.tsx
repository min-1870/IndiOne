import "./Duration.css";
import React, { useState } from "react";

const Duration: React.FC = () => {
  const [guestCount, setGuestCount] = useState(1);
  function increaseGuest() {
    setGuestCount((prevCount) => {
      if (prevCount == 10) return 10;
      else return prevCount + 1;
    });
  }

  function decreaseGuest() {
    setGuestCount((prevCount) => {
      if (prevCount == 1) return 1;
      else return prevCount - 1;
    });
  }

  return (
    <div className="guestContainer">
      <div className="guestContainer-title">Duration In Hours</div>
      <div className="guestContainer-btnContainer">
        <button
          type="button"
          className="btn btn-light"
          onClick={decreaseGuest}
          id="minus"
        >
          -
        </button>
        <div>{guestCount}</div>
        <button
          type="button"
          className="btn btn-light"
          onClick={increaseGuest}
          id="plus"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Duration;
