import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
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

const SignUpDoctor = (props) => {
  const { classes } = props;
  const ctx = useContext(MedicalSystemContext);
  const [firstName, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [creditionals, setCreditionals] = useState("");
  const [hospital, setHospital] = useState("");
  const [department, setDepartment] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const onSubmitCreateDoctor = async (event) => {
    event.preventDefault();
    const res = await ctx.medicalSystem.methods
      .createDoctor(
        firstName,
        lastname,
        contactNumber,
        creditionals,
        hospital,
        department,
        imageUrl
      )
      .send({ from: ctx.account });
    console.log(res);
  };

  return (
    <form
      onSubmit={onSubmitCreateDoctor}
      className={classes.container}
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        id="outlined-required"
        label="Doctor's First Name"
        className={classes.textField}
        margin="2px"
        variant="outlined"
        style={{ marginTop: "15px", marginLeft: "15px" }}
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
        }}
      />

      <br />
      <br />

      <TextField
        required
        id="outlined-required"
        label="Doctor's Last Name"
        className={classes.textField}
        margin="2px"
        variant="outlined"
        style={{ marginTop: "15px", marginLeft: "15px" }}
        value={lastname}
        onChange={(e) => {
          setLastName(e.target.value);
        }}
      />

      <TextField
        required
        id="outlined-required"
        label="Doctor's Contact Number"
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
        label="Doctors's Creditionals"
        className={classes.textField}
        margin="2px"
        variant="outlined"
        style={{ marginTop: "15px", marginLeft: "15px" }}
        value={creditionals}
        onChange={(e) => {
          setCreditionals(e.target.value);
        }}
      />

      <TextField
        required
        id="outlined-required"
        label="Doctos's Hospital"
        className={classes.textField}
        margin="2px"
        variant="outlined"
        style={{ marginTop: "15px", marginLeft: "15px" }}
        value={hospital}
        onChange={(e) => {
          setHospital(e.target.value);
        }}
      />

      <TextField
        required
        id="outlined-required"
        label="Doctors's Department"
        className={classes.textField}
        margin="2px"
        variant="outlined"
        style={{ marginTop: "15px", marginLeft: "15px" }}
        value={department}
        onChange={(e) => {
          setDepartment(e.target.value);
        }}
      />

      <TextField
        required
        id="outlined-required"
        label="Doctors's Image URL"
        className={classes.textField}
        margin="2px"
        variant="outlined"
        style={{ marginTop: "15px", marginLeft: "15px" }}
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
        }}
      />

      <Button
        style={{ marginLeft: "15px" }}
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        type="submit"
      >
        Send
      </Button>
    </form>
  );
};

export default withStyles(styles)(SignUpDoctor);
