import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import "./UserInput.css";
import { Autocomplete, GoogleMap } from "@react-google-maps/api";
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
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Groups3Icon from "@mui/icons-material/Groups3";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";

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
  distance: "1",
  time: "",
  duration: "",
  transportation: "",
  budget: "0",
  template: "",
};

let selectedAddress: string = "Starting Location";

const drawerBleeding = 56;

let itineraryResult: any;

interface Props {
  window?: () => Window;
}

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

const UserBudget: React.FC = () => {
  const [currentBudget, setCurrentBudget] = useState("0");

  useEffect(() => {
    userInputInfo["budget"] = String(currentBudget);
  }, [currentBudget]);

  function handleBudget(event: any) {
    const value = event.target.value;
    if (value !== null) {
      setCurrentBudget(String(Number(value)));
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
    userInputInfo["time"] = String(currentStartTime);
    userInputInfo["duration"] = String(
      Number(currentEndTime) - Number(currentStartTime)
    );
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
                setCurrentLat(
                  String(data["results"][0]["geometry"]["location"].lat)
                );
                setCurrentLng(
                  String(data["results"][0]["geometry"]["location"].lng)
                );
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
    userLocation.lat = currentLat;
    userLocation.lng = currentLng;
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
  const [currentDistance, setCurrentDistance] = useState("1000");

  function getDistance(
    event: Event,
    value: number | Array<number>,
    activeThumb: number
  ) {
    if (event !== null && event.target !== null) {
      setCurrentDistance(String(value * 1000));
    }
  }

  useEffect(() => {
    userInputInfo["distance"] = currentDistance;
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
    userInputInfo["transportation"] = currentTransport;
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

const UserTemplate: React.FC = () => {
  // Template
  const [currentTemplate, setCurrentTemplate] = useState("");
  const changeTemplate = (event: any) => {
    const thisTemplate = event.target.value;
    setCurrentTemplate(thisTemplate);
  };
  useEffect(() => {
    userInputInfo["template"] = currentTemplate;
  }, [currentTemplate]);

  return (
    <div className="template-btn-container">
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="templateRadio"
          id="templateRadio1"
          autoComplete="off"
          value="solo"
          onClick={changeTemplate}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="templateRadio1">
          <div className="transport-icon">
            <PersonIcon></PersonIcon>
            <div className="text-wrapper">Solo</div>
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
          name="templateRadio"
          id="templateRadio2"
          autoComplete="off"
          value="couple"
          onClick={changeTemplate}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="templateRadio2">
          <div className="transport-icon-2">
            <FavoriteIcon></FavoriteIcon>
            <div className="text-wrapper-2">Couple</div>
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
          name="templateRadio"
          id="templateRadio3"
          autoComplete="off"
          value="friends"
          onClick={changeTemplate}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="templateRadio3">
          <div className="transport-icon-3">
            <Groups3Icon></Groups3Icon>
            <div className="text-wrapper-3">Friends</div>
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
          name="templateRadio"
          id="templateRadio4"
          autoComplete="off"
          value="family"
          onClick={changeTemplate}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="templateRadio4">
          <div className="transport-icon-4">
            <FamilyRestroomIcon></FamilyRestroomIcon>
            <div className="text-wrapper-4">Family</div>
          </div>
        </label>
      </div>
    </div>
  );
};

const UserInput: React.FC = () => {
  const navigate = useNavigate();
  function sendUserInput() {
    navigate("/results", {
      state: {
        budget: userInputInfo["budget"],
        location: userInputInfo["location"],
        distance: userInputInfo["distance"],
        time: userInputInfo["time"],
        duration: userInputInfo["duration"],
        transportation: userInputInfo["transportation"],
        template: userInputInfo["template"],
      },
    });
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
              <b>Travel mode</b>
            </p>
          </div>
          <div>
            <UserTemplate></UserTemplate>
          </div>
        </div>
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
          <div id="transportation">
            <UserTransport></UserTransport>
          </div>
        </div>
        <div className="userInputQuery" id="navigate">
          <Box sx={{ "& > :not(style)": { m: 1 } }}>
            <Fab variant="extended" color="primary" onClick={sendUserInput}>
              <NavigationIcon sx={{ mr: 1 }} />
              Find my itinerary
            </Fab>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default UserInput;
