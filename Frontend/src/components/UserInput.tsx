import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";
import "./UserInput.css";
import { Autocomplete } from "@react-google-maps/api";

interface userData {
  location: location;
  distance: string;
  time: string;
  duration: string;
  transportation: string;
  budget: string;
  template: string;
}

interface location {
  lat: string;
  lng: string;
}

const UserInput: React.FC = () => {
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

  const [currentBudget, setCurrentBudget] = useState("0");
  const [currentLat, setCurrentLat] = useState("0");
  const [currentLng, setCurrentLng] = useState("0");

  const changeBudget = (event: any) => {
    const budgetSelected = event.target.value;
    setCurrentBudget(budgetSelected);
  };

  const initMap = async () => {
    // Initial Location
    const position = { lat: -33.917347, lng: 151.2312675 };

    // Request needed libraries.
    const { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;

    // The map, centered at the initial location
    const map = new Map(document.getElementById("map") as HTMLElement, {
      zoom: 10,
      center: position,
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

  // Start & End Time
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

  //Distance
  const [currentDistance, setCurrentDistance] = useState("1000");
  const changeDuration = (event: any) => {
    const sliderValue = event.target.value;
    setCurrentDistance(sliderValue);
  };

  // Transportation
  const [currentTransport, setCurrentTransport] = useState("");
  const changeTransport = (event: any) => {
    const thisTransport = event.target.value;
    setCurrentTransport(thisTransport);
  };

  useEffect(() => {
    console.log("uESEEFEFEFCT");
    userInputInfo["budget"] = currentBudget;
    userInputInfo["time"] = currentStartTime;
    userInputInfo["distance"] = currentDistance;
    userInputInfo["transportation"] = currentTransport;
    userInputInfo["duration"] = String(
      Number(currentEndTime) - Number(currentStartTime)
    );
    userLocation.lat = currentLat;
    userLocation.lng = currentLng;
    userDataBackend();
    console.log(userInputInfo);
  }, [
    currentLat,
    currentLng,
    currentBudget,
    currentStartTime,
    currentEndTime,
    currentDistance,
    currentTransport,
  ]);

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
    <div>
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
      <div>
        <div className="input-group flex-nowrap">
          <span className="input-group-text" id="addon-wrapping">
            Start Location
          </span>
          <Autocomplete>
            <div id="pac-container">
              <input
                id="pac-input"
                type="text"
                className="form-control"
                placeholder="Location"
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
      <div className="dateContainer">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id="eachButton"
          >
            {!currentStartTime ? "Start Time" : currentStartTime + ":00"}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <select
              className="form-select"
              aria-label="Size 3 select example"
              value={currentStartTime}
              onChange={handleStartTime}
            >
              <option className="dropdown-item">Time</option>
              <option className="dropdown-item" value="0">
                0:00
              </option>
              <option className="dropdown-item" value="1">
                1:00
              </option>
              <option className="dropdown-item" value="2">
                2:00
              </option>
              <option className="dropdown-item" value="3">
                3:00
              </option>
              <option className="dropdown-item" value="4">
                4:00
              </option>
              <option className="dropdown-item" value="5">
                5:00
              </option>
              <option className="dropdown-item" value="6">
                6:00
              </option>
              <option className="dropdown-item" value="7">
                7:00
              </option>
              <option className="dropdown-item" value="8">
                8:00
              </option>
              <option className="dropdown-item" value="9">
                9:00
              </option>
              <option className="dropdown-item" value="10">
                10:00
              </option>
              <option className="dropdown-item" value="11">
                11:00
              </option>
              <option className="dropdown-item" value="12">
                12:00
              </option>
              <option className="dropdown-item" value="13">
                13:00
              </option>
              <option className="dropdown-item" value="14">
                14:00
              </option>
              <option className="dropdown-item" value="15">
                15:00
              </option>
              <option className="dropdown-item" value="16">
                16:00
              </option>
              <option className="dropdown-item" value="17">
                17:00
              </option>
              <option className="dropdown-item" value="18">
                18:00
              </option>
              <option className="dropdown-item" value="19">
                19:00
              </option>
              <option className="dropdown-item" value="20">
                20:00
              </option>
              <option className="dropdown-item" value="21">
                21:00
              </option>
              <option className="dropdown-item" value="22">
                22:00
              </option>
              <option className="dropdown-item" value="23">
                23:00
              </option>
              <option className="dropdown-item" value="24">
                24:00
              </option>
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
            {!currentEndTime ? "End Time" : currentEndTime + ":00"}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <select
              className="form-select"
              aria-label="Size 3 select example"
              value={currentEndTime}
              onChange={handleEndTime}
            >
              <option className="dropdown-item">Time</option>
              <option className="dropdown-item" value="0">
                0:00
              </option>
              <option className="dropdown-item" value="1">
                1:00
              </option>
              <option className="dropdown-item" value="2">
                2:00
              </option>
              <option className="dropdown-item" value="3">
                3:00
              </option>
              <option className="dropdown-item" value="4">
                4:00
              </option>
              <option className="dropdown-item" value="5">
                5:00
              </option>
              <option className="dropdown-item" value="6">
                6:00
              </option>
              <option className="dropdown-item" value="7">
                7:00
              </option>
              <option className="dropdown-item" value="8">
                8:00
              </option>
              <option className="dropdown-item" value="9">
                9:00
              </option>
              <option className="dropdown-item" value="10">
                10:00
              </option>
              <option className="dropdown-item" value="11">
                11:00
              </option>
              <option className="dropdown-item" value="12">
                12:00
              </option>
              <option className="dropdown-item" value="13">
                13:00
              </option>
              <option className="dropdown-item" value="14">
                14:00
              </option>
              <option className="dropdown-item" value="15">
                15:00
              </option>
              <option className="dropdown-item" value="16">
                16:00
              </option>
              <option className="dropdown-item" value="17">
                17:00
              </option>
              <option className="dropdown-item" value="18">
                18:00
              </option>
              <option className="dropdown-item" value="19">
                19:00
              </option>
              <option className="dropdown-item" value="20">
                20:00
              </option>
              <option className="dropdown-item" value="21">
                21:00
              </option>
              <option className="dropdown-item" value="22">
                22:00
              </option>
              <option className="dropdown-item" value="23">
                23:00
              </option>
              <option className="dropdown-item" value="24">
                24:00
              </option>
            </select>
          </ul>
        </div>
      </div>
      <div className="budget_range_container">
        <label htmlFor="customRange3" className="form-label">
          Distance (Current{" "}
          <span>{Number(currentDistance) / 1000 + " km"}</span>)
        </label>
        <input
          type="range"
          className="form-range"
          min="1000"
          max="50000"
          step="2000"
          id="customRange3"
          onChange={changeDuration}
        ></input>
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
          id="transportRadio1"
          autoComplete="off"
          value="private"
          onClick={changeTransport}
        ></input>
        <label className="btn btn-outline-primary" htmlFor="transportRadio1">
          <div className="transport-icon">
            <svg
              className="car-taxi"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1222_33981)">
                <path
                  d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 11.5C9.48528 11.5 11.5 9.48528 11.5 7C11.5 4.51472 9.48528 2.5 7 2.5C4.51472 2.5 2.5 4.51472 2.5 7C2.5 9.48528 4.51472 11.5 7 11.5Z"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.60938 6H11.3896"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 9L4.5 6H9.5L7 9Z"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 9V11.5"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1222_33981">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>

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
            <svg
              className="car-taxi"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.625 11.4918H12.4271C12.9793 11.4918 13.4271 11.0441 13.4271 10.4918V7.95694C13.4271 7.40465 12.9793 6.95694 12.4271 6.95694H11.875V3.375C11.875 2.82272 11.4273 2.375 10.875 2.375H1.68457C1.13229 2.375 0.68457 2.82272 0.68457 3.375V10.6341C0.68457 11.1078 1.06856 11.4918 1.54224 11.4918H2"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.875 4.2085H0.685364"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.875 6.95679H0.685364"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.46411 4.2085V6.95307"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.03125 4.2085V6.95307"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.39002 12.874C4.16101 12.874 4.78602 12.249 4.78602 11.478C4.78602 10.707 4.16101 10.082 3.39002 10.082C2.61903 10.082 1.99402 10.707 1.99402 11.478C1.99402 12.249 2.61903 12.874 3.39002 12.874Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.23 12.874C11.001 12.874 11.626 12.249 11.626 11.478C11.626 10.707 11.001 10.082 10.23 10.082C9.45899 10.082 8.83398 10.707 8.83398 11.478C8.83398 12.249 9.45899 12.874 10.23 12.874Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.78638 11.4779H6.80475H8.83398"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

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
            <svg
              className="car-taxi"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1222_33722)">
                <path
                  d="M5.21436 1.64286C5.21436 1.14975 5.6141 0.75 6.10721 0.75H12.3572C12.8503 0.75 13.2501 1.14975 13.2501 1.64286V12.3571C13.2501 12.8503 12.8503 13.25 12.3572 13.25H9.23221"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.11598 7.001C8.9792 7.001 9.67898 6.30122 9.67898 5.438C9.67898 4.57478 8.9792 3.875 8.11598 3.875C7.25276 3.875 6.55298 4.57478 6.55298 5.438C6.55298 6.30122 7.25276 7.001 8.11598 7.001Z"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.53564 6.10718L4.35369 6.1072C4.6189 6.1072 4.87325 6.21256 5.06078 6.40009L7.6 8.93931C7.78754 9.12685 8.04191 9.2322 8.30713 9.2322L9.6785 9.23218"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.10714 7.44641L3.72146 9.83209C3.53393 10.0196 3.27957 10.125 3.01436 10.125H0.75"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.32141 9.23218L5.81423 10.725C6.00177 10.9125 6.10713 11.1669 6.10713 11.4321V13.25"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1222_33722">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <div className="text-wrapper-2">Walking</div>
          </div>
        </label>
      </div>
    </div>
  );
};
export default UserInput;
