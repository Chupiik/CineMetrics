import { Link } from "react-router-dom";
import AddEditMovieForm from "../components/AddEditMovieForm.jsx";
import OMDBMassUpload from "../components/OMDBMassUpload.jsx";

function AddMovie() {
  return (
    <div style={{ textAlign: "center" }}>
      <AddEditMovieForm method="add" />

      <div style={{ marginTop: "20px" }}>
        <Link to="/omdb-mass-upload">
          <button className="upload-button">OMDB Mass Upload</button>
        </Link>
      </div>

      <style>
        {`
          .upload-button {
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-bottom: 20px;
            transition: background-color 0.3s ease;
          }
          .upload-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </div>
  );
}

export default AddMovie;
