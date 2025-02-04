import './App.css';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import NotFound from './components/notFound/NotFound';
import Reviews from './components/reviews/Reviews';
import Watchlist from "./components/watchlist/Watchlist";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState([]);

  const getMovies = async () => {
    try {

      const response = await api.get("/api/v1/movies");

      console.log("API Response Data:", response.data);

      setMovies(response.data);

    }
    catch (err) {
      console.log(err);
    }
  }

  const getMovieData = async (movieId) => {
    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);
      setMovie(response.data);
      console.log("API Response Data: ", response.data);
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);


  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={movies && movies.length > 0 ? <Home movies={movies} /> : <p>Loading movies...</p>}
          />
          <Route path="/Trailer/:ytTrailerId" element={<Trailer />} />
          <Route
            path="/Reviews/:movieId"
            element={<Reviews getMovieData={getMovieData} movie={movie} reviews={reviews} setReviews={setReviews} />}
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
