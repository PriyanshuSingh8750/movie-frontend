import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Watchlist.css";
import { toast } from "react-toastify";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const userId = localStorage.getItem("loggedInUser");

  // Helper function to fetch movie details for guest watchlist
  const fetchMovieDetails = async (imdbIds) => {
    try {
      const moviePromises = imdbIds.map((id) =>
        fetch(`https://enthusiastic-encouragement-production.up.railway.app/api/v1/movies/${id}`).then((res) => res.json())
      );
      const movies = await Promise.all(moviePromises);
      return movies;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return [];
    }
  };

  // Load the watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        const guestWatchlist = JSON.parse(localStorage.getItem("guestWatchlist")) || [];
        fetchMovieDetails(guestWatchlist).then((movies) => setWatchlist(movies));
        return;
      }
  
      try {
        const response = await fetch(`https://enthusiastic-encouragement-production.up.railway.app/api/v1/users/${userId}/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch watchlist");
        }
  
        const data = await response.json();
        fetchMovieDetails(data.watchList || []).then((movies) => setWatchlist(movies));
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };
  
    fetchWatchlist();
  }, []);
  

  const clearWatchlist = () => {
    const token = localStorage.getItem("jwtToken");
  
    if (!token) {
      localStorage.removeItem("guestWatchlist");
      toast.success("Guest watchlist cleared.");
      setWatchlist([]);
      return;
    }
  
    fetch(`https://enthusiastic-encouragement-production.up.railway.app/api/v1/users/${userId}/watchlist`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to clear watchlist");
        toast.success("Watchlist cleared successfully.");
        setWatchlist([]);
      })
      .catch((error) => toast.error(error.message));
  };
  
  


            
  const removeMovie = async (movieId) => {
    const loggedInUserId = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("jwtToken"); // ✅ Get token for authentication

    if (!loggedInUserId || loggedInUserId === "guest") {
        const guestWatchlist = JSON.parse(localStorage.getItem("guestWatchlist")) || [];
        const updatedWatchlist = guestWatchlist.filter((id) => id !== movieId);
        localStorage.setItem("guestWatchlist", JSON.stringify(updatedWatchlist));
        fetchMovieDetails(updatedWatchlist).then((movies) => setWatchlist(movies));
    } else {
        try {
            const response = await fetch(`https://enthusiastic-encouragement-production.up.railway.app/api/v1/users/${loggedInUserId}/watchlist/${movieId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Now token is included
                },
            });

            if (!response.ok) {
                throw new Error("Failed to remove movie from watchlist");
            }

            // ✅ Fetch updated watchlist
            const updatedResponse = await fetch(`https://enthusiastic-encouragement-production.up.railway.app/api/v1/users/${loggedInUserId}/watchlist`, {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Token for authentication
                },
            });

            if (!updatedResponse.ok) {
                throw new Error("Failed to fetch updated watchlist");
            }

            const updatedData = await updatedResponse.json();
            fetchMovieDetails(updatedData.watchList || []).then((movies) => setWatchlist(movies));
        } catch (error) {
            console.error("Error removing movie:", error);
        }
    }
};


  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom className="title">
        Your Watchlist
      </Typography>
      {watchlist.length > 0 ? (
        <Grid container spacing={3}>
          {watchlist.map((movie) => (
            <Grid item key={movie.imdbId} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  transition: "all 0.3s ease-in-out",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <Card className="card">
                  <CardMedia
                    component="img"
                    height="500"
                    image={movie.poster || "https://via.placeholder.com/500x750?text=No+Image"}
                    alt={movie.title || "Untitled Movie"}
                    className="card-media"
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {movie.title || "Untitled Movie"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Release Date:</strong> {movie.releaseDate || "Unknown"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                      {movie.genres?.map((genre) => (
                        <Chip
                          key={genre}
                          label={genre}
                          className="genre-chip"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      href={movie.trailerLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      disabled={!movie.trailerLink}
                      className="trailer-button"
                    >
                      Watch Trailer
                    </Button>
                    <IconButton
                      onClick={() => removeMovie(movie.imdbId)}
                      className="delete-icon"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center" className="empty-message">
          Your watchlist is empty. Start adding some movies to enjoy your personalized watchlist!
        </Typography>
      )}
      {watchlist.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={clearWatchlist}
          className="clear-button"
        >
          Clear Watchlist
        </Button>
      )}
    </Container>
  );
};

export default Watchlist;
