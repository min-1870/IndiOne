// import "bootstrap/dist/css/bootstrap.css";
// import React, { useEffect, useState } from "react";
// import "./UserInput.css";
// import { Autocomplete } from "@react-google-maps/api";

// interface userData {
//   location: string;
//   budget: string;
// }

// interface location {
//   lat: number;
//   lng: number;
// }

// const UserInput: React.FC = () => {
//   let userInputInfo: userData = { location: "null", budget: "null" };
//   let userLocation: location = { lat: 0, lng: 0 };

//   const BudgetRange: React.FC = () => {
//     const [currentBudget, setCurrentBudget] = useState("null");

//     const changeBudget = (event: any) => {
//       const budgetSelected = event.target.value;
//       setCurrentBudget(budgetSelected);
//     };

//     useEffect(() => {
//       userInputInfo["budget"] = currentBudget;
//       console.log("budgetbudget");
//       console.log(userInputInfo);
//     }, [currentBudget]);

//     return (
//       <div
//         className="btn-group"
//         role="group"
//         aria-label="Basic radio toggle button group"
//       >
//         <input
//           type="radio"
//           className="btn-check"
//           name="btnradio"
//           id="btnradio0"
//           autoComplete="off"
//           onClick={changeBudget}
//           value="0"
//         ></input>
//         <label className="btn btn-outline-primary" htmlFor="btnradio0">
//           $
//         </label>
//         <input
//           type="radio"
//           className="btn-check"
//           name="btnradio"
//           id="btnradio1"
//           autoComplete="off"
//           onClick={changeBudget}
//           value="1"
//         ></input>
//         <label className="btn btn-outline-primary" htmlFor="btnradio1">
//           $$
//         </label>

//         <input
//           type="radio"
//           className="btn-check"
//           name="btnradio"
//           id="btnradio2"
//           autoComplete="off"
//           onClick={changeBudget}
//           value="2"
//         ></input>
//         <label className="btn btn-outline-primary" htmlFor="btnradio2">
//           $$$
//         </label>

//         <input
//           type="radio"
//           className="btn-check"
//           name="btnradio"
//           id="btnradio3"
//           autoComplete="off"
//           onClick={changeBudget}
//           value="3"
//         ></input>
//         <label className="btn btn-outline-primary" htmlFor="btnradio3">
//           $$$$
//         </label>
//         <input
//           type="radio"
//           className="btn-check"
//           name="btnradio"
//           id="btnradio4"
//           autoComplete="off"
//           onClick={changeBudget}
//           value="4"
//         ></input>
//         <label className="btn btn-outline-primary" htmlFor="btnradio4">
//           $$$$$
//         </label>
//       </div>
//     );
//   };

//   const initMap = async () => {
//     // Initial Location
//     const position = { lat: -33.917347, lng: 151.2312675 };

//     // Request needed libraries.
//     const { Map } = (await google.maps.importLibrary(
//       "maps"
//     )) as google.maps.MapsLibrary;

//     // The map, centered at the initial location
//     const map = new Map(document.getElementById("map") as HTMLElement, {
//       zoom: 10,
//       center: position,
//       mapId: "DEMO_MAP_ID",
//     });

//     // Information card
//     const card = document.getElementById("pac-card") as HTMLElement;
//     const input = document.getElementById("pac-input") as HTMLInputElement;
//     const options = {
//       fields: ["place_id", "formatted_address", "geometry", "name"],
//       strictBounds: false,
//     };
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
//     const autocomplete = new google.maps.places.Autocomplete(input, options);

//     // Bind the map's bounds (viewport) property to the autocomplete object,
//     // so that the autocomplete requests use the current map bounds for the
//     // bounds option in the request.
//     autocomplete.bindTo("bounds", map);

//     const infowindow = new google.maps.InfoWindow();
//     const infowindowContent = document.getElementById(
//       "infowindow-content"
//     ) as HTMLElement;

//     infowindow.setContent(infowindowContent);

//     const geocoder = new google.maps.Geocoder();

//     const marker = new google.maps.Marker({
//       map,
//       anchorPoint: new google.maps.Point(0, -29),
//     });

//     autocomplete.addListener("place_changed", () => {
//       infowindow.close();
//       marker.setVisible(false);

//       const place = autocomplete.getPlace();

//       if (!place.geometry || !place.geometry.location || !place.place_id) {
//         // User entered the name of a Place that was not suggested and
//         // pressed the Enter key, or the Place Details request failed.
//         window.alert("No details available for input: '" + place.name + "'");
//         return;
//       }
//       geocoder
//         .geocode({ placeId: place.place_id })
//         .then((results) => {
//           const placeIdResult = results["results"][0]["place_id"];
//           const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeIdResult}&key=${
//             import.meta.env.VITE_API_KEY
//           }`;
//           const getLocation = async () => {
//             await fetch(url)
//               .then((response) => {
//                 if (!response.ok) {
//                   throw new Error("Fetch Error");
//                 }
//                 return response.json();
//               })
//               .then((data) => {
//                 userInputInfo["location"] =
//                   data["results"][0]["geometry"]["location"];
//                 userLocation.lat =
//                   data["results"][0]["geometry"]["location"].lat;
//                 userLocation.lng =
//                   data["results"][0]["geometry"]["location"].lng;
//               })
//               .catch((err) => console.log(err));
//           };
//           getLocation();
//         })
//         .catch((e) => window.alert("Geocoder failed due to: " + e));
//       // If the place has a geometry, then present it on a map.
//       if (place.geometry.viewport) {
//         map.fitBounds(place.geometry.viewport);
//       } else {
//         map.setCenter(place.geometry.location);
//         map.setZoom(17);
//       }

//       marker.setPosition(place.geometry.location);
//       marker.setVisible(true);

//       infowindowContent.children["place-name"].textContent = place.name;
//       infowindowContent.children["place-address"].textContent =
//         place.formatted_address;
//       infowindow.open(map, marker);
//     });
//   };

//   useEffect(() => {
//     initMap();
//   }, []);

//   // useEffect(() => {
//   //   console.log("location uESEEFEFEFCT");
//   //   console.log(userLocation);
//   // }, [userLocation]);

//   console.log("========");
//   console.log(userInputInfo);
//   console.log(userLocation);

//   return (
//     <div>
//       <div>
//         <BudgetRange></BudgetRange>
//       </div>
//       <div className="input-group flex-nowrap">
//         <span className="input-group-text" id="addon-wrapping">
//           Start Location
//         </span>
//         <Autocomplete>
//           <div id="pac-container">
//             <input
//               id="pac-input"
//               type="text"
//               className="form-control"
//               placeholder="Location"
//               aria-label="Location"
//               aria-describedby="addon-wrapping"
//             ></input>
//           </div>
//         </Autocomplete>
//       </div>
//       <div className="sampleMapContainer">
//         <div id="map"></div>
//         <div id="infowindow-content">
//           <span id="place-name" className="title"></span>
//           <br />
//           <span id="place-address"></span>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default UserInput;
