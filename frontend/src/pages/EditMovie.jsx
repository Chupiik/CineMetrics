import { useParams } from "react-router-dom";
import AddEditMovieForm from "../components/AddEditMovieForm.jsx";

function EditMovie() {
  const { id } = useParams();

  return <AddEditMovieForm method="edit" movieId={id} />;
}

export default EditMovie;
