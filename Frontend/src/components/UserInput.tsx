import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import "./UserInput.css";
import { Autocomplete } from "@react-google-maps/api";
import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import SearchIcon from "@mui/icons-material/Search";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Rating, { IconContainerProps } from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";

interface userData {
  location: location;
  distance: string;
  time: string | null;
  duration: string;
  transportation: string;
  budget: string;
  template: string;
}

interface location {
  lat: string;
  lng: string;
}

let userLocation: location = { lat: "", lng: "" };
let userInputInfo: userData = {
  location: userLocation,
  distance: "",
  time: "",
  duration: "",
  transportation: "",
  budget: "",
  template: "friends",
};

let selectedAddress: string = "Starting Location";

const drawerBleeding = 56;

interface Props {
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

function SwipeableEdgeDrawer(props: Props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  // Change font size
  const updateFontSize = () => {
    const label = document.getElementById("wheretotext2");
    const barrier = document.getElementById("wheretotext");
    if (label !== null && barrier !== null) {
      if (label.innerText !== "Starting Location") {
        label.style.fontSize = "15px";
        if (label.offsetHeight > barrier.offsetHeight) {
          label.style.fontSize = "10px";
        }
      }
    }
  };

  useEffect(() => {
    updateFontSize();
  }, [selectedAddress]);

  return (
    <div style={{ height: "100%" }}>
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(95% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <div onClick={toggleDrawer(true)} className="fromWhere-searchbar">
        <div id="wheretonextMag">
          <SearchIcon sx={{ backgroundColor: "#fffff" }}></SearchIcon>
        </div>

        <button id="wheretotext">
          <label id="wheretotext2">{selectedAddress}</label>
        </button>
      </div>

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={true}
        ModalProps={{
          keepMounted: false,
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 4, color: "text.secondary" }}></Typography>
        </StyledBox>
        <UserMap></UserMap>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
        ></StyledBox>
      </SwipeableDrawer>
    </div>
  );
}

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Very Satisfied",
  },
};

const UserBudget: React.FC = () => {
  const [currentBudget, setCurrentBudget] = useState("0");

  useEffect(() => {
    userInputInfo["budget"] = String(Number(currentBudget) - 1);
    console.log(userInputInfo);
  }, [currentBudget]);

  function handleBudget(event: any) {
    const value = event.target.value;
    if (value !== null) {
      setCurrentBudget(String(Number(value) + 1));
    }
  }

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
        onClick={handleBudget}
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
        onClick={handleBudget}
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
        onClick={handleBudget}
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
        onClick={handleBudget}
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
        onClick={handleBudget}
        value="4"
      ></input>
      <label className="btn btn-outline-primary" htmlFor="btnradio4">
        $$$$$
      </label>
    </div>
  );
};

const UserTime: React.FC = () => {
  // Start & End Time

  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");

  useEffect(() => {
    console.log("uESEEFEFEFCT");
    userInputInfo["time"] = String(currentStartTime);
    userInputInfo["duration"] = String(
      Number(currentEndTime) - Number(currentStartTime)
    );
    console.log(userInputInfo);
  }, [currentStartTime, currentEndTime]);

  const handleStartChange = (event: SelectChangeEvent) => {
    setCurrentStartTime(event.target.value as string);
  };
  const handleEndChange = (event: SelectChangeEvent) => {
    setCurrentEndTime(event.target.value as string);
  };

  return (
    <div className="dateContainer">
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">Start</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentStartTime}
          label="Start"
          onChange={handleStartChange}
        >
          <MenuItem value={8}>8:00</MenuItem>
          <MenuItem value={9}>9:00</MenuItem>
          <MenuItem value={10}>10:00</MenuItem>
          <MenuItem value={11}>11:00</MenuItem>
          <MenuItem value={12}>12:00</MenuItem>
          <MenuItem value={13}>13:00</MenuItem>
          <MenuItem value={14}>14:00</MenuItem>
          <MenuItem value={15}>15:00</MenuItem>
          <MenuItem value={16}>16:00</MenuItem>
          <MenuItem value={17}>17:00</MenuItem>
          <MenuItem value={18}>18:00</MenuItem>
          <MenuItem value={19}>19:00</MenuItem>
          <MenuItem value={20}>20:00</MenuItem>
          <MenuItem value={21}>21:00</MenuItem>
          <MenuItem value={22}>22:00</MenuItem>
          <MenuItem value={23}>23:00</MenuItem>
          <MenuItem value={0}>0:00</MenuItem>
          <MenuItem value={1}>1:00</MenuItem>
          <MenuItem value={2}>2:00</MenuItem>
          <MenuItem value={3}>3:00</MenuItem>
          <MenuItem value={4}>4:00</MenuItem>
          <MenuItem value={5}>5:00</MenuItem>
          <MenuItem value={6}>6:00</MenuItem>
          <MenuItem value={7}>7:00</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">Finish</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentEndTime}
          label="Finish"
          onChange={handleEndChange}
        >
          <MenuItem value={8}>8:00</MenuItem>
          <MenuItem value={9}>9:00</MenuItem>
          <MenuItem value={10}>10:00</MenuItem>
          <MenuItem value={11}>11:00</MenuItem>
          <MenuItem value={12}>12:00</MenuItem>
          <MenuItem value={13}>13:00</MenuItem>
          <MenuItem value={14}>14:00</MenuItem>
          <MenuItem value={15}>15:00</MenuItem>
          <MenuItem value={16}>16:00</MenuItem>
          <MenuItem value={17}>17:00</MenuItem>
          <MenuItem value={18}>18:00</MenuItem>
          <MenuItem value={19}>19:00</MenuItem>
          <MenuItem value={20}>20:00</MenuItem>
          <MenuItem value={21}>21:00</MenuItem>
          <MenuItem value={22}>22:00</MenuItem>
          <MenuItem value={23}>23:00</MenuItem>
          <MenuItem value={0}>0:00</MenuItem>
          <MenuItem value={1}>1:00</MenuItem>
          <MenuItem value={2}>2:00</MenuItem>
          <MenuItem value={3}>3:00</MenuItem>
          <MenuItem value={4}>4:00</MenuItem>
          <MenuItem value={5}>5:00</MenuItem>
          <MenuItem value={6}>6:00</MenuItem>
          <MenuItem value={7}>7:00</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

const UserMap: React.FC = () => {
  const [currentLat, setCurrentLat] = useState("0");
  const [currentLng, setCurrentLng] = useState("0");

  const initMap = async () => {
    // Initial Location
    const position = { lat: 28.6139391, lng: 77.2090212 };

    // Request needed libraries.
    const { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;

    // The map, centered at the initial location
    const map = new Map(document.getElementById("map") as HTMLElement, {
      zoom: 10,
      center: position,
      disableDefaultUI: true,
      mapId: "DEMO_MAP_ID",
    });

    // Information card
    const card = document.getElementById("pac-card") as HTMLElement;
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const options = {
      fields: ["place_id", "formatted_address", "geometry", "name"],
      strictBounds: false,
    };
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;

    infowindow.setContent(infowindowContent);

    const geocoder = new google.maps.Geocoder();

    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location || !place.place_id) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      geocoder
        .geocode({ placeId: place.place_id })
        .then((results) => {
          const placeIdResult = results["results"][0]["place_id"];
          selectedAddress = results["results"][0]["formatted_address"];
          const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeIdResult}&key=${
            import.meta.env.VITE_API_KEY
          }`;
          const getLocation = async () => {
            await fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Fetch Error");
                }
                return response.json();
              })
              .then((data) => {
                setCurrentLat(data["results"][0]["geometry"]["location"].lat);
                setCurrentLng(data["results"][0]["geometry"]["location"].lng);
              })
              .catch((err) => console.log(err));
          };
          getLocation();
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent =
        place.formatted_address;
      infowindow.open(map, marker);
    });
  };

  // Initialise a map
  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    console.log("uESEEFEFEFCT");
    userLocation.lat = currentLat;
    userLocation.lng = currentLng;
    console.log(userInputInfo);
  }, [currentLat, currentLng]);

  return (
    <div>
      <div className="input-group flex-nowrap">
        <Autocomplete>
          <div id="pac-container">
            <input
              id="pac-input"
              type="text"
              className="form-control"
              placeholder="Starting Location"
              aria-label="Location"
              aria-describedby="addon-wrapping"
            ></input>
          </div>
        </Autocomplete>
      </div>
      <div className="sampleMapContainer">
        <div id="map"></div>
        <div id="infowindow-content">
          <span id="place-name" className="title"></span>
          <br />
          <span id="place-address"></span>
        </div>
      </div>
    </div>
  );
};

//Distance
const UserDistance: React.FC = () => {
  const [currentDistance, setCurrentDistance] = useState("0");

  function getDistance(
    event: Event,
    value: number | Array<number>,
    activeThumb: number
  ) {
    if (event !== null && event.target !== null) {
      setCurrentDistance(String(value));
    }
  }

  useEffect(() => {
    console.log("uESEEFEFEFCT");
    userInputInfo["distance"] = currentDistance;
    console.log(userInputInfo);
  }, [currentDistance]);

  const marks = [
    {
      value: 1,
      label: "1km",
    },
    {
      value: 10,
      label: "10km",
    },
    {
      value: 20,
      label: "20km",
    },
    {
      value: 30,
      label: "30km",
    },
    {
      value: 40,
      label: "40km",
    },
    {
      value: 50,
      label: "50km",
    },
  ];

  function valuetext(value: number) {
    return `${value}km`;
  }
  const color = ["#FF5733"];
  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        aria-label="Custom marks"
        defaultValue={1}
        getAriaValueText={valuetext}
        step={2}
        valueLabelDisplay="auto"
        marks={marks}
        min={1}
        max={50}
        onChange={getDistance}
      />
    </Box>
  );
};

const UserTransport: React.FC = () => {
  // Transportation
  const [currentTransport, setCurrentTransport] = useState("");
  const changeTransport = (event: any) => {
    const thisTransport = event.target.value;
    setCurrentTransport(thisTransport);
  };
  useEffect(() => {
    console.log("uESEEFEFEFCT");
    userInputInfo["transportation"] = currentTransport;
    console.log(userInputInfo);
  }, [currentTransport]);

  return (
    <div className="transport-btn-container">
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="transportRadio"
          id="transportRadio1"
          autoComplete="off"
          value="private"
          onClick={changeTransport}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="transportRadio1">
          <div className="transport-icon">
            <TwoWheelerIcon></TwoWheelerIcon>
            <div className="text-wrapper-2">Private</div>
          </div>
        </label>
      </div>
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="transportRadio"
          id="transportRadio2"
          autoComplete="off"
          value="public"
          onClick={changeTransport}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="transportRadio2">
          <div className="transport-icon-2">
            <DepartureBoardIcon></DepartureBoardIcon>
            <div className="text-wrapper-2">Public</div>
          </div>
        </label>
      </div>
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="transportRadio"
          id="transportRadio3"
          autoComplete="off"
          value="walking"
          onClick={changeTransport}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="transportRadio3">
          <div className="transport-icon-3">
            <DirectionsWalkIcon></DirectionsWalkIcon>
            <div className="text-wrapper-2">Walking</div>
          </div>
        </label>
      </div>
    </div>
  );
};

const UserInput: React.FC = () => {
  // REST for backend
  async function userDataBackend() {
    const port = "3000";
    const url = `http://localhost:${port}/test`; // change PORT
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
        console.log(data);
      })
      .catch((error) => console.log(error.message));
  }

  return (
    <div className="user_input_container">
      <div className="user_input_intro_container">
        <h1>Your journey begins here</h1>
      </div>

      <div className="user_input_form_container">
        <div className="userInputQuery">
          <div className="fromwhere-description">
            <p>
              <b>From where?</b>
            </p>
          </div>
          <SwipeableEdgeDrawer></SwipeableEdgeDrawer>
        </div>
        <div className="userInputQuery">
          <div className="fromwhere-description">
            <p>
              <b>Travelling time</b>
            </p>
          </div>
          <UserTime></UserTime>
        </div>
        <div className="userInputQuery">
          <div className="fromwhere-description">
            <p>
              <b>Max. distance</b>
            </p>
          </div>
          <div id="userDistance">
            <UserDistance></UserDistance>
          </div>
        </div>
        <div className="userInputQuery">
          <div className="fromwhere-description">
            <p>
              <b>Budget</b>
            </p>
          </div>
          <div id="userBudget">
            <UserBudget></UserBudget>
          </div>
        </div>
        <div className="userInputQuery">
          <div className="fromwhere-description">
            <p>
              <b>Transportation</b>
            </p>
          </div>
          <div id="">
            <UserTransport></UserTransport>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInput;