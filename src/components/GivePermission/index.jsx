import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
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
function GivePermission(props) {
  const navigate = useNavigate();

  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType } = useCurrentUser();
  const [permittedDoctors, setPermittedDoctors] = useState({});
  const [otherDoctors, setOtherDoctors] = useState({});

  useEffect(() => {
    if (loadingUser) return;
    if (userType !== "Patient") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      const allDocsRes = await ctx.medicalSystem.getPastEvents(
        "DoctorCreated",
        {
          fromBlock: 0,
          toBlock: "latest",
        }
      );

      allDocsRes.forEach(async (e) => {
        const doctor = await ctx.medicalSystem.methods
          .doctors(e.returnValues.id)
          .call();
        const checkPermissionRes = await ctx.medicalSystem.getPastEvents(
          "GivenPermission",
          {
            filter: { patientId: [ctx.account], doctorId: [doctor.id] },
            fromBlock: 0,
            toBlock: "latest",
          }
        );

        if (checkPermissionRes.length > 0)
          setPermittedDoctors((docs) => ({ ...docs, [doctor.id]: doctor }));
        else setOtherDoctors((docs) => ({ ...docs, [doctor.id]: doctor }));
      });
    })();
  }, [loadingUser, userType]);

  const onSubmitGivePermission = async (event, doctorID) => {
    event.preventDefault();

    const res = await ctx.medicalSystem.methods
      .givePermission(doctorID)
      .send({ from: ctx.account });

    const { doctorId } = res.events.GivenPermission.returnValues;

    const doctor = await ctx.medicalSystem.methods.doctors(doctorId).call();
    setPermittedDoctors((docs) => ({ ...docs, [doctor.id]: doctor }));
    setOtherDoctors((docs) => {
      docs = { ...docs };
      delete docs[doctor.id];
      return docs;
    });
  };

  console.table(permittedDoctors);
  console.table(otherDoctors);

  const { classes } = props;
  return (
    <div>
      <PatientNavbar />
      <div style={{ margin: "5vh 25vw" }}>
        <div style={{ textAlign: "center", width: "800px" }}>
          <h3 style={{ fontFamily: "Anuphan, sans-serif" }}>
            Permission Access to Doctor
          </h3>
          <br />
          <Grid
            container
            spacing={5}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            {Object.values(otherDoctors).map((doctor) => (
              <Card
                style={{ width: "250px", marginRight: "18px" }}
                className={classes.root}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="Doctor Image"
                    height="140"
                    image={`${doctor.imageUrl}`}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Dr. {doctor.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Appollo Hospital - MBBS, MS(Dermatalogy)
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <form
                  className={classes.container}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-full-width"
                    label="Doctor's Address"
                    fullWidth
                    style={{ marginLeft: "15px", display: "none" }}
                    margin="normal"
                    variant="outlined"
                    value={doctor.id}
                    disabled
                  />
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={(event) =>
                        onSubmitGivePermission(event, doctor.id)
                      }
                    >
                      Give Permission
                    </Button>
                  </CardActions>
                </form>
              </Card>
            ))}
          </Grid>
        </div>
        <br />
        <br />
        <div style={{ marginLeft: "15px", width: "800px" }}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Doctor's Name</CustomTableCell>
                  <CustomTableCell>Doctor's Address</CustomTableCell>
                  <CustomTableCell>Access</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(permittedDoctors).map((doctor) => (
                  <TableRow className={classes.row} key={doctor.id}>
                    <CustomTableCell component="th" scope="row">
                      {doctor.name}
                    </CustomTableCell>
                    <CustomTableCell>{doctor.id}</CustomTableCell>
                    <CustomTableCell>
                      <Button
                        //   variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<RemoveCircleOutlineOutlinedIcon />}
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

GivePermission.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GivePermission);
