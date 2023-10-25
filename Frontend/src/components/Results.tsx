import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./Results.css";

let resultData;

const Loading: React.FC = () => {
  return (
    <div className="main-container">
      <h1>Schedulling your itinerary...</h1>
      <Box sx={{ display: "flex" }}>
        <CircularProgress size={70} />
      </Box>
    </div>
  );
};

const Results: React.FC = () => {
  const [itineraryResult, setItineraryResult] = useState("loading");
  const location = useLocation();
  const userInputInfo = location.state;

  useEffect(() => {
    async function userDataBackend() {
      const port = "5000";
      const url = `http://127.0.0.1:${port}/route`; // change PORT

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputInfo),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Fetch Error!");
          }
          return response.json();
        })
        .then((data) => {
          setItineraryResult("Done");
          resultData = data["categorizedRoutes"];
          console.log("Calculating Itinerary Done!");
          console.log(resultData);
        })
        .catch((error) => console.log(error.message));
    }
    userDataBackend();
  }, []);

  return (
    <>{itineraryResult === "loading" ? <Loading></Loading> : "Success!"}</>
  );
};

export default Results;
