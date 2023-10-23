import { useState } from "react";

const BudgetRange = () => {
  const [currentBudget, setCurrentBudget] = useState("-1");

  const changeBudget = (event: any) => {
    const budgetSelected = event.target.value;
    switch (budgetSelected) {
      case "0":
        setCurrentBudget("0");
        break;
      case "1":
        setCurrentBudget("1");
        break;
      case "2":
        setCurrentBudget("2");
        break;
      case "3":
        setCurrentBudget("3");
        break;
      case "4":
        setCurrentBudget("4");
        break;
    }
  };

  return (
    <div
      className="btn-group"
      role="group"
      aria-label="Basic radio toggle button group"
    >
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio0"
        autoComplete="off"
        onClick={changeBudget}
        value="0"
      ></input>
      <label className="btn btn-outline-primary" htmlFor="btnradio0">
        $
      </label>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio1"
        autoComplete="off"
        onClick={changeBudget}
        value="1"
      ></input>
      <label className="btn btn-outline-primary" htmlFor="btnradio1">
        $$
      </label>

      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio2"
        autoComplete="off"
        onClick={changeBudget}
        value="2"
      ></input>
      <label className="btn btn-outline-primary" htmlFor="btnradio2">
        $$$
      </label>

      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio3"
        autoComplete="off"
        onClick={changeBudget}
        value="3"
      ></input>
      <label className="btn btn-outline-primary" htmlFor="btnradio3">
        $$$$
      </label>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio4"
        autoComplete="off"
        onClick={changeBudget}
        value="4"
      ></input>
      <label className="btn btn-outline-primary" htmlFor="btnradio4">
        $$$$$
      </label>
    </div>
  );
};

export default BudgetRange;
