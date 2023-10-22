const BudgetRange = () => {
  return (
    <>
      <label htmlFor="customRange3" className="form-label">
        Example range
      </label>
      <input
        type="range"
        className="form-range"
        min="1"
        max="10"
        step="1"
        id="customRange3"
      ></input>
    </>
  );
};

export default BudgetRange;
