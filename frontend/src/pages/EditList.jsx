import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import "../styles/AddList.css";
import AddEditMovieListForm from "../components/AddEditMovieListForm.jsx";

function EditMovieList() {

  return (
    <div>
      <AddEditMovieListForm method="edit"/>
    </div>
  );
}

export default EditMovieList;
