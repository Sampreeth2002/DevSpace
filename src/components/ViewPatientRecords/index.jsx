import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AttachmentIcon from "@material-ui/icons/Attachment";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../utils/currentUser.hook";
import { MedicalSystemContext } from "../App";
import DoctorNavbar from "../Navbar/doctorNavbar";


const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 400,
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
function ViewPatientRecords(props) {
  const { classes } = props;
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patientName, setPatientName] = useState(null);

  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType, user } = useCurrentUser();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (loadingUser) return;
    if (userType !== "Doctor") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      const patient = await ctx.medicalSystem.methods
        .patients(patientId)
        .call();

      setPatientName(patient.name);

      for (let recordId = 1; recordId <= patient.totalRecords; ++recordId) {
        const {
          ipfsHash,
          uploadDate,
          name,
        } = await ctx.medicalSystem.methods
          .getPatientRecord(patientId, recordId)
          .call({ from: ctx.account });

        setRecords((rec) => [
          ...rec,
          { ipfsHash, uploadDate: new Date(uploadDate * 1000), name },
        ]);
      }
    })();
  }, [loadingUser, userType, user]);

  const timeOfUpload = (dateString) => {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Extract individual components of the date
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, "0"); // Add leading zero if needed
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Add leading zero if needed
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Add leading zero if needed
    const timeZone = date
      .toLocaleString("en-US", {
        timeZoneName: "short",
      })
      .split(" ")[2]; // Extract time zone abbreviation

    // Format the date and time as desired
    const formattedDateTime = `${day} ${monthName} ${year} ${hours}:${minutes}:${seconds} ${timeZone}`;

    return formattedDateTime;
  };

  console.table(records);

  return (
    <div>
      <DoctorNavbar />
      <div style={{ marginLeft: "25vw", marginTop: "15px" }}>
        <div style={{ marginLeft: "16vw" }}>
          <h3 style={{ fontFamily: "Anuphan, sans-serif" }}>
            Patient Name : <span>{patientName}</span>
          </h3>
        </div>
        <div
          style={{ marginLeft: "15px", width: "650px", textAlign: "center" }}
        >
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Record Name</CustomTableCell>
                  <CustomTableCell>Record Uploaded Time</CustomTableCell>
                  <CustomTableCell>Record</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row) => (
                  <TableRow className={classes.row} key={row.id}>
                    <CustomTableCell component="th" scope="row">
                      {row.name.slice(0, -4)}
                    </CustomTableCell>
                    <CustomTableCell component="th" scope="row">
                      {timeOfUpload(row.uploadDate.toString())}
                    </CustomTableCell>

                    <CustomTableCell>
                      <Button
                        variant="secondary"
                        color="default"
                        className={classes.button}
                        startIcon={<AttachmentIcon />}
                        href={`${"https://"}${row.ipfsHash}.ipfs.w3s.link/${
                          row.name
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      ></Button>
                    </CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    </div>
  );
}

ViewPatientRecords.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewPatientRecords);
