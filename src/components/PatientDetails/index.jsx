import React from "react";
import DoctorNavbar from "../Navbar/doctorNavbar";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

export default function PatientDetails() {
  const { patient_information } = useParams();
  const patientInfo = JSON.parse(patient_information);
  return (
    <div>
      <DoctorNavbar />
      {console.log(patientInfo)}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <h4>Patient Details</h4>
        <br />
        <br />
        <div>
          <TextField
            style={{
              marginBottom: "10px",
            }}
            id="outlined-basic"
            label="First_Name"
            variant="outlined"
            value={patientInfo.first_name}
          />
        </div>
        <div>
          <TextField
            style={{
              marginBottom: "10px",
            }}
            id="outlined-basic"
            label="Last_Name"
            variant="outlined"
            value={patientInfo.last_name}
          />
        </div>
        <div>
          <TextField
            style={{
              marginBottom: "10px",
            }}
            id="outlined-basic"
            label="Age"
            variant="outlined"
            value={patientInfo.age}
          />
        </div>
        <div>
          <TextField
            style={{
              marginBottom: "10px",
            }}
            id="outlined-basic"
            label="Blood Group"
            variant="outlined"
            value={patientInfo.blood_group}
          />
        </div>
        <div>
          <TextField
            style={{
              marginBottom: "10px",
            }}
            id="outlined-basic"
            label="Location"
            variant="outlined"
            value={patientInfo.location}
          />
        </div>
      </div>
    </div>
  );
}
