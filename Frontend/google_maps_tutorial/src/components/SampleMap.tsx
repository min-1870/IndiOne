import React, { useEffect } from "react";

const SampleMap: React.FC = () => {
  useEffect(() => {
    // Move your map initialization code here

    const initMap = async () => {
      // The location of Uluru
      const position = { lat: -25.344, lng: 131.031 };

      // Request needed libraries.

      const { Map, InfoWindow } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

      // The map, centered at Uluru
      const map = new Map(document.getElementById("map") as HTMLElement, {
        zoom: 4,
        center: position,
        mapId: "DEMO_MAP_ID",
      });

      // The marker, positioned at Uluru
      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Uluru",
      });
    };

    initMap();
  }, []);

  return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
};

export default SampleMap;
