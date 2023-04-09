import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AttachmentIcon from "@material-ui/icons/Attachment";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../utils/currentUser.hook";
import { MedicalSystemContext } from "../App";
import PatientNavbar from "../Navbar/patientNavbar";

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

function UploadRecord(props) {
  const navigate = useNavigate();
  const { classes } = props;
  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType, user } = useCurrentUser();
  const [readFile, setReadFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordName, setrecordName] = useState([]);

  useEffect(() => {
    if (loadingUser) return;
    if (userType !== "Patient") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      for (let recordId = 1; recordId <= user.totalRecords; ++recordId) {
        const {
          ipfsHash,
          uploadDate,
          name,
        } = await ctx.medicalSystem.methods
          .getPatientRecord(ctx.account, recordId)
          .call({ from: ctx.account });

        setRecords((rec) => [
          ...rec,
          { ipfsHash, uploadDate: new Date(uploadDate * 1000), name },
        ]);
      }
    })();
  }, [loadingUser, userType, user]);

  const onFileCapture = (event) => {
    event.preventDefault();

    //Process File for IPFS
    setReadFile(event.target.files[0]);
  };

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

  // Example: "QmdAZ1qp1vpw3MvVrSdYAT1M4zS2N57p1kCmz5RCFAKJ49";
  // Example Url : https://ipfs.infura.io/ipfs/....
  const onSubmitUploadRecord = async (event) => {
    event.preventDefault();

    let rootCid;
    try {
      rootCid = await ctx.ipfsStorage.put([readFile]);
    } catch (error) {
      console.error(error);
      return;
    }

    const res = await ctx.medicalSystem.methods
      .uploadPatientRecord(rootCid, readFile.name)
      .send({ from: ctx.account });

    const { newRecordId } = res.events.PatientRecordUploaded.returnValues;

    const {
      ipfsHash,
      uploadDate,
      name,
    } = await ctx.medicalSystem.methods
      .getPatientRecord(ctx.account, newRecordId)
      .call({ from: ctx.account });
    setRecords((rec) => [
      ...rec,
      { ipfsHash, uploadDate: new Date(uploadDate * 1000), name },
    ]);

    // Store hash(file) in blockchain
  };

  console.table(records);

  return (
    <div>
      <PatientNavbar />
      <div className="container-fluid mt-5">
        <div style={{ textAlign: "center" }}>
          <div>
            <form onSubmit={onSubmitUploadRecord}>
              {/* <TextField
                required
                id="outlined-required"
                label="Enter Record Name"
                className={classes.textField}
                margin="2px"
                variant="outlined"
                style={{ marginTop: "15px", marginLeft: "15px" }}
                value={recordName}
                onChange={(e) => {
                  setrecordName(e.target.value);
                }}
              />
              <br />
              <br /> */}
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileCapture}
              />
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                type="submit"
              >
                Upload
              </Button>
            </form>
          </div>
          <div style={{ marginLeft: "23vw", width: "750px" }}>
            <br />
            <br />
            <h3 style={{ fontFamily: "Anuphan, sans-serif" }}>
              Uploaded Records
            </h3>
            <br />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <CustomTableCell>Record Name</CustomTableCell>
                    <CustomTableCell>Time of Upload</CustomTableCell>
                    <CustomTableCell>Record IPFS</CustomTableCell>
                    <CustomTableCell>Record</CustomTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((row) => (
                    <TableRow className={classes.row} key={row.id}>
                      <CustomTableCell component="th" scope="row">
                        {row.name.toString().slice(0, -4)}
                      </CustomTableCell>
                      <CustomTableCell component="th" scope="row">
                        {timeOfUpload(row.uploadDate.toString())}
                      </CustomTableCell>
                      <CustomTableCell>{row.ipfsHash}</CustomTableCell>
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
    </div>
  );
}

UploadRecord.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadRecord);
