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
        <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
        <Route path="/add-movie" element={<ProtectedRoute><AddMovie /></ProtectedRoute>} />
        <Route path="/edit-movie/:id" element={<ProtectedRoute><EditMovie /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App