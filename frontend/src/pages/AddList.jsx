import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import "../styles/AddList.css";
import AddEditMovieListForm from "../components/AddEditMovieListForm.jsx";

function AddMovieList() {

  return (
    <div>
      <AddEditMovieListForm method="add"/>
    </div>
  );
}

export default AddMovieList;
