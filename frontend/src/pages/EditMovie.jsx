import { useParams } from "react-router-dom";  // To access the movie ID from the URL
import AddEditMovieForm from "../components/AddEditMovieForm.jsx";

function EditMovie() {
  const { id } = useParams();  // Get the movie ID from the URL parameters

  return <AddEditMovieForm method="edit" movieId={id} />;
}

export default EditMovie;
