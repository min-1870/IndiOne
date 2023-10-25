import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./Results.css";
import "./UserInput.css";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  GoogleMap,
  DirectionsRenderer,
  DirectionsService,
  Marker,
} from "@react-google-maps/api";
import InfoCard from "./InfoCard";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

interface location {
  lat: number;
  lng: number;
}

interface waypoingLocation {
  location: location;
  stopover: boolean;
}

interface routeInfo {
  origin: location;
  destination: location;
  waypoints: waypoingLocation[];
  provideRouteAlternatives: boolean;
  travelMode: string;
}

const Results: React.FC = () => {
  const [resultDataCasual, setresultDataCasual] = useState(null);
  const [itineraryResult, setItineraryResult] = useState("loading");
  const location = useLocation();
  const userInputInfo = location.state;

  console.log("User Input Info");
  console.log(userInputInfo); // Starting location : userInputInfo["location"]

  const CasualMap: React.FC = () => {
    const startPosition = {
      lat: Number(userInputInfo["location"].lat),
      lng: Number(userInputInfo["location"].lng),
    };
    const travelMode = userInputInfo["transportation"];
    const directionsService = new google.maps.DirectionsService();
    let casualData = resultDataCasual["categorizedRoutes"]["casual"];
    let casualDataLength = Number(casualData.length);
    let casualRouteInfo: routeInfo = {
      origin: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
      waypoints: [],
      provideRouteAlternatives: false,
      travelMode: "",
    };

    casualData.forEach((element: any, index: number) => {
      if (index === 0) {
        casualRouteInfo["origin"] = startPosition;
      } else if (index === casualDataLength - 1) {
        casualRouteInfo["destination"] = element["geometry"]["location"];
      } else if (index % 2 !== 0) {
        let temp = {
          location: element["geometry"]["location"],
          stopover: true,
        };
        casualRouteInfo["waypoints"].push(temp);
      }
    });
    if (travelMode === "walking") {
      casualRouteInfo["travelMode"] = "WALKING";
    } else if (travelMode === "private") {
      casualRouteInfo["travelMode"] = "DRIVING";
    } else {
      casualRouteInfo["travelMode"] = "DRIVING";
    }

    let temp: any = null;
    const [directionsResponse, setDirectionsResponse] = useState(temp);
    const [map, setMap] = useState(temp);
    async function getRoute() {
      const results = await directionsService.route(casualRouteInfo);
      setDirectionsResponse(results);
      console.log(casualData);
    }
    useEffect(() => {
      getRoute();
    }, []);

    return (
      <>
        <GoogleMap
          zoom={15}
          center={startPosition}
          mapContainerStyle={{
            width: "100%",
            height: "50%",
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker>
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </Marker>
        </GoogleMap>
        <div
          style={{
            overflow: "auto",
            height: window.innerHeight * 0.8 * 0.5,
            paddingTop: "10px",
          }}
        >
          {casualData.map((data: any, index: number) => (
            <InfoCard
              data={data}
              index={index}
              lastIndex={casualDataLength}
            ></InfoCard>
          ))}
        </div>
      </>
    );
  };

  const LocalSpecialtyMap: React.FC = () => {
    const startPosition = {
      lat: Number(userInputInfo["location"].lat),
      lng: Number(userInputInfo["location"].lng),
    };
    const travelMode = userInputInfo["transportation"];
    const directionsService = new google.maps.DirectionsService();
    let localSpecialtyData =
      resultDataCasual["categorizedRoutes"]["local_specialty"];
    let localSpecialtyDataLength = Number(localSpecialtyData.length);
    let localSpecialtyRouteInfo: routeInfo = {
      origin: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
      waypoints: [],
      provideRouteAlternatives: false,
      travelMode: "",
    };

    localSpecialtyData.forEach((element: any, index: number) => {
      if (index === 0) {
        localSpecialtyRouteInfo["origin"] = startPosition;
      } else if (index === localSpecialtyDataLength - 1) {
        localSpecialtyRouteInfo["destination"] =
          element["geometry"]["location"];
      } else if (index % 2 !== 0) {
        let temp = {
          location: element["geometry"]["location"],
          stopover: true,
        };
        localSpecialtyRouteInfo["waypoints"].push(temp);
      }
    });
    if (travelMode === "walking") {
      localSpecialtyRouteInfo["travelMode"] = "WALKING";
    } else if (travelMode === "private") {
      localSpecialtyRouteInfo["travelMode"] = "DRIVING";
    } else {
      localSpecialtyRouteInfo["travelMode"] = "DRIVING";
    }

    let temp: any = null;
    const [directionsResponse, setDirectionsResponse] = useState(temp);
    const [map, setMap] = useState(temp);
    async function getRoute() {
      const results = await directionsService.route(localSpecialtyRouteInfo);
      setDirectionsResponse(results);
      console.log(localSpecialtyData);
    }
    useEffect(() => {
      getRoute();
    }, []);

    return (
      <>
        <GoogleMap
          zoom={15}
          center={startPosition}
          mapContainerStyle={{
            width: "100%",
            height: "50%",
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker>
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </Marker>
        </GoogleMap>
        <div
          style={{
            overflow: "auto",
            height: window.innerHeight * 0.8 * 0.5,
            paddingTop: "10px",
          }}
        >
          {localSpecialtyData.map((data: any, index: number) => (
            <InfoCard
              data={data}
              index={index}
              lastIndex={localSpecialtyDataLength}
            ></InfoCard>
          ))}
        </div>
      </>
    );
  };

  const QualitativeMap: React.FC = () => {
    const startPosition = {
      lat: Number(userInputInfo["location"].lat),
      lng: Number(userInputInfo["location"].lng),
    };
    const travelMode = userInputInfo["transportation"];
    const directionsService = new google.maps.DirectionsService();
    let qualitativeData = resultDataCasual["categorizedRoutes"]["qualitative"];
    let qualitativeDataLength = Number(qualitativeData.length);
    let qualitativeRouteInfo: routeInfo = {
      origin: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
      waypoints: [],
      provideRouteAlternatives: false,
      travelMode: "",
    };

    qualitativeData.forEach((element: any, index: number) => {
      if (index === 0) {
        qualitativeRouteInfo["origin"] = startPosition;
      } else if (index === qualitativeDataLength - 1) {
        qualitativeRouteInfo["destination"] = element["geometry"]["location"];
      } else if (index % 2 !== 0) {
        let temp = {
          location: element["geometry"]["location"],
          stopover: true,
        };
        qualitativeRouteInfo["waypoints"].push(temp);
      }
    });
    if (travelMode === "walking") {
      qualitativeRouteInfo["travelMode"] = "WALKING";
    } else if (travelMode === "private") {
      qualitativeRouteInfo["travelMode"] = "DRIVING";
    } else {
      qualitativeRouteInfo["travelMode"] = "DRIVING";
    }

    let temp: any = null;
    const [directionsResponse, setDirectionsResponse] = useState(temp);
    const [map, setMap] = useState(temp);
    async function getRoute() {
      const results = await directionsService.route(qualitativeRouteInfo);
      setDirectionsResponse(results);
      console.log(qualitativeData);
    }
    useEffect(() => {
      getRoute();
    }, []);

    return (
      <>
        <GoogleMap
          zoom={15}
          center={startPosition}
          mapContainerStyle={{
            width: "100%",
            height: "50%",
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker>
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </Marker>
        </GoogleMap>
        <div
          style={{
            overflow: "auto",
            height: window.innerHeight * 0.8 * 0.5,
            paddingTop: "10px",
          }}
        >
          {qualitativeData.map((data: any, index: number) => (
            <InfoCard
              data={data}
              index={index}
              lastIndex={qualitativeDataLength}
            ></InfoCard>
          ))}
        </div>
      </>
    );
  };

  const ShortestMap: React.FC = () => {
    const startPosition = {
      lat: Number(userInputInfo["location"].lat),
      lng: Number(userInputInfo["location"].lng),
    };
    const travelMode = userInputInfo["transportation"];
    const directionsService = new google.maps.DirectionsService();
    let shortestData = resultDataCasual["categorizedRoutes"]["shortest"];
    let shortestDataLength = Number(shortestData.length);
    let shortestRouteInfo: routeInfo = {
      origin: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
      waypoints: [],
      provideRouteAlternatives: false,
      travelMode: "",
    };

    shortestData.forEach((element: any, index: number) => {
      if (index === 0) {
        shortestRouteInfo["origin"] = startPosition;
      } else if (index === shortestDataLength - 1) {
        shortestRouteInfo["destination"] = element["geometry"]["location"];
      } else if (index % 2 !== 0) {
        let temp = {
          location: element["geometry"]["location"],
          stopover: true,
        };
        shortestRouteInfo["waypoints"].push(temp);
      }
    });
    if (travelMode === "walking") {
      shortestRouteInfo["travelMode"] = "WALKING";
    } else if (travelMode === "private") {
      shortestRouteInfo["travelMode"] = "DRIVING";
    } else {
      shortestRouteInfo["travelMode"] = "DRIVING";
    }

    let temp: any = null;
    const [directionsResponse, setDirectionsResponse] = useState(temp);
    const [map, setMap] = useState(temp);
    async function getRoute() {
      const results = await directionsService.route(shortestRouteInfo);
      setDirectionsResponse(results);
      console.log(shortestData);
    }
    useEffect(() => {
      getRoute();
    }, []);

    return (
      <>
        <GoogleMap
          zoom={15}
          center={startPosition}
          mapContainerStyle={{
            width: "100%",
            height: "50%",
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker>
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </Marker>
        </GoogleMap>
        <div
          style={{
            overflow: "auto",
            height: window.innerHeight * 0.8 * 0.5,
            paddingTop: "10px",
          }}
        >
          {shortestData.map((data: any, index: number) => (
            <InfoCard
              data={data}
              index={index}
              lastIndex={shortestDataLength}
            ></InfoCard>
          ))}
        </div>
      </>
    );
  };

  const steps = [
    {
      label: "Casual",
      description: <CasualMap></CasualMap>,
    },
    {
      label: "Local Specialty",
      description: <LocalSpecialtyMap></LocalSpecialtyMap>,
    },
    {
      label: "Qualitative",
      description: <QualitativeMap></QualitativeMap>,
    },
    {
      label: "Shortest",
      description: <ShortestMap></ShortestMap>,
    },
  ];

  function TextMobileStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = steps.length;

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const navigate = useNavigate();
    function goMainPage() {
      navigate("/", {});
    }

    return (
      <Box sx={{ maxWidth: window.innerWidth, flexGrow: 1 }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            pl: 2,
            bgcolor: "background.default",
          }}
        >
          <Typography align="center">{steps[activeStep].label}</Typography>
        </Paper>
        <Box
          sx={{
            height: window.innerHeight * 0.8,
            maxWidth: 400,
            width: "100%",
            p: 2,
          }}
        >
          {steps[activeStep].description}
        </Box>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={goMainPage}>
            <HomeIcon></HomeIcon>
          </Button>
        </div>
      </Box>
    );
  }

  const Loading: React.FC = () => {
    return (
      <div className="main-loading-container">
        <h1>Schedulling your itinerary...</h1>
        <Box sx={{ display: "flex" }}>
          <CircularProgress size={70} />
        </Box>
      </div>
    );
  };

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
          setresultDataCasual(data);
        })
        .catch((error) => console.log(error.message));
    }
    userDataBackend();
  }, []);

  return (
    <>
      {itineraryResult === "loading" ? (
        <Loading></Loading>
      ) : (
        <TextMobileStepper></TextMobileStepper>
      )}
    </>
  );
};

export default Results;
