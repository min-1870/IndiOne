import "./App.css";
import BudgetRange from "./components/Budget";
import DateForm from "./components/DateForm";
import Transportation from "./components/Transportation";
import "bootstrap/dist/css/bootstrap.css";
import StartLocation from "./components/StarLocation";
import Duration from "./components/Duration";
import UserInput from "./components/UserInput";

function App() {
  return (
    <>
      <div>
        <UserInput></UserInput>
      </div>
      <div>
        <Transportation></Transportation>
      </div>

      <div className="budget_range_container">
        <BudgetRange></BudgetRange>
      </div>

      <DateForm></DateForm>
      {/* <StartLocation></StartLocation> */}
      {/* <div id="appMap">
        <SampleMap></SampleMap>
      </div> */}
      <div className="budget_range_container">
        <Duration></Duration>
      </div>
    </>
  );
}

export default App;
