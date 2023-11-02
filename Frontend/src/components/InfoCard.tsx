import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./InfoCard.css";
import Rating from "@mui/material/Rating";

const InfoCard: React.FC = (props) => {
  let startHour = Math.floor(props.data["startTime"]);
  let startMinute = Math.ceil(60 * (props.data["startTime"] - startHour));
  let endHour = Math.floor(props.data["endTime"]);
  let endMinute = Math.ceil(60 * (props.data["endTime"] - endHour));
  let alphabet = String.fromCharCode(65 + Math.floor(props.index / 2) + 1);

  if (startMinute == 60) {
    startHour++;
    startMinute = 0;
  }

  if (endMinute == 60) {
    endHour++;
    endMinute = 0;
  }

  if (props.index === 0) {
    return (
      <div className="infocard-container">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{
              backgroundColor: "#669fd8",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <Typography>(A) Start your journey!</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <b>Time</b>: {startHour}:
              {startMinute < 10 ? "0" + startMinute : startMinute} ~ {endHour}:
              {endMinute < 10 ? "0" + endMinute : endMinute}
              <br></br>
              <b>Task</b>: Head to Location B
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  } else if (props.index === props.lastIndex - 1) {
    return (
      <div className="infocard-container">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{
              backgroundColor: "#669fd8",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <Typography>
              ({alphabet}) {props.data["name"]}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <b>Name</b>: {props.data["name"]}
              <br></br>
              <b>Time</b>: {startHour}:
              {startMinute < 10 ? "0" + startMinute : startMinute} ~ {endHour}:
              {endMinute < 10 ? "0" + endMinute : endMinute}
              <br></br>
              <b>Type</b>: {props.data["type"]}
              <br></br>
              <div className="rating-container">
                <b>Rating</b>:{" "}
                <Rating
                  name="read-only"
                  value={props.data["rating"]}
                  readOnly
                />
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  } else if (props.index % 2 === 0) {
    return (
      <div className="infocard-container">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{
              backgroundColor: "#669fd8",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <Typography>Travel to {alphabet}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <b>Time</b>: {startHour}:
              {startMinute < 10 ? "0" + startMinute : startMinute} ~ {endHour}:
              {endMinute < 10 ? "0" + endMinute : endMinute}
              <br></br>
              <b>Task</b>: Head to Location {alphabet}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  } else {
    return (
      <div className="infocard-container">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{
              backgroundColor: "#669fd8",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <Typography>
              ({alphabet}) {props.data["name"]}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <b>Name</b>: {props.data["name"]}
              <br></br>
              <b>Time</b>: {startHour}:
              {startMinute < 10 ? "0" + startMinute : startMinute} ~ {endHour}:
              {endMinute < 10 ? "0" + endMinute : endMinute}
              <br></br>
              <b>Type</b>: {props.data["type"]}
              <br></br>
              <div className="rating-container">
                <b>Rating</b>:{" "}
                <Rating
                  name="read-only"
                  value={props.data["rating"]}
                  readOnly
                />{" "}
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
};

export default InfoCard;
