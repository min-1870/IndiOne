import { GoogleMap, Marker } from "@react-google-maps/api";

const Test = () => {
  return (
    <GoogleMap
      zoom={8}
      center={{ lat: -34.397, lng: 150.644 }}
      mapContainerStyle={{
        width: "400px",
        height: "400px",
      }}
    >
      <Marker position={{ lat: -34.397, lng: 150.644 }}></Marker>
    </GoogleMap>
  );
};

export default Test;
