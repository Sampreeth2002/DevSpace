import React from "react";
import { useCurrentUser } from "../../utils/currentUser.hook";
import PatientNavbar from "../Navbar/patientNavbar";
import DoctorNavbar from "../Navbar/doctorNavbar";

export default function AboutMe() {
  const { loadingUser, userType, user } = useCurrentUser();
  console.log(user);
  console.log(userType);
  if (user != null && userType === "Patient") {
    return (
      <div>
        <PatientNavbar />
      </div>
    );
  }
  return <div>AboutMe</div>;
}
