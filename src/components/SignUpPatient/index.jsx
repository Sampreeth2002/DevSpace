import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { MedicalSystemContext } from "../App";

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

const SignUpPatient = (props) => {
  const { classes } = props;
  const ctx = useContext(MedicalSystemContext);
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");

  const onSubmitCreatePatient = async (event) => {
    event.preventDefault();
    const res = await ctx.medicalSystem.methods
      .createPatient(
        patientFirstName,
        patientLastName,
        contactNumber,
        bloodGroup,
        location,
        age
      )
      .send({ from: ctx.account });
    console.log(res);
  };

  return (
    <div style={{ margin: "35vh 35vw" }}>
      <form
        className={classes.container}
        onSubmit={onSubmitCreatePatient}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-required"
          label="Patient's First Name"
          className={classes.textField}
          margin="2px"
          variant="outlined"
          style={{ marginTop: "15px", marginLeft: "15px" }}
          value={patientFirstName}
          onChange={(e) => {
            setPatientFirstName(e.target.value);
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Patient's Last Name"
          className={classes.textField}
          margin="2px"
          variant="outlined"
          style={{ marginTop: "15px", marginLeft: "15px" }}
          value={patientLastName}
          onChange={(e) => {
            setPatientLastName(e.target.value);
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Patient's Contact Number"
          className={classes.textField}
          margin="2px"
          variant="outlined"
          style={{ marginTop: "15px", marginLeft: "15px" }}
          value={contactNumber}
          onChange={(e) => {
            setContactNumber(e.target.value);
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Patient's Blood Group"
          className={classes.textField}
          margin="2px"
          variant="outlined"
          style={{ marginTop: "15px", marginLeft: "15px" }}
          value={bloodGroup}
          onChange={(e) => {
            setBloodGroup(e.target.value);
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Patient's address"
          className={classes.textField}
          margin="2px"
          variant="outlined"
          style={{ marginTop: "15px", marginLeft: "15px" }}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        />

        <TextField
          id="outlined-full-width"
          label="Patient's Age"
          style={{ marginLeft: "15px" }}
          margin="normal"
          variant="outlined"
          onChange={(e) => {
            setAge(e.target.value);
          }}
          value={age}
        />
        <Button
          style={{ marginLeft: "15px" }}
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<SendIcon />}
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
};
SignUpPatient.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpPatient);
