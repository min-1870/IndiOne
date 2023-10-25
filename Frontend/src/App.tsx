import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import UserInput from "./components/UserInput";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Results from "./components/Results";
import Test from "./components/Test";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserInput />} />
          <Route path="/results" element={<Results />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
