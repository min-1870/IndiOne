import { Autocomplete } from "@react-google-maps/api";

const StartLocation: React.FC = () => {
  return (
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
  );
};

export default StartLocation;
