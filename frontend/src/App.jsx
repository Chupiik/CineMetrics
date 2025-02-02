import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Movies from "./pages/Movies.jsx"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Index from "./pages/Index.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import 'font-awesome/css/font-awesome.min.css';
import AddMoviePage from "./components/AddEditMovieForm.jsx";
import AddMovie from "./pages/AddMovie.jsx";
import EditMovie from "./pages/EditMovie.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import MovieDetails from "./pages/MovieDetails.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import UnauthorizedPage from "./pages/Unauthorized.jsx";


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
                <Index />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/movies" element={<AuthProvider><ProtectedRoute><Movies /></ProtectedRoute></AuthProvider>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/add-movie" element={<AuthProvider><ProtectedRoute adminOnly={true}><AddMovie /></ProtectedRoute></AuthProvider>} />
          <Route path="/edit-movie/:id" element={<AuthProvider><ProtectedRoute adminOnly={true}><EditMovie /></ProtectedRoute></AuthProvider>} />
          <Route path="/movies/:id" element={<AuthProvider><ProtectedRoute><MovieDetails /></ProtectedRoute></AuthProvider>} />
          <Route path="/unauthorized/" element={<Unauthorized />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App