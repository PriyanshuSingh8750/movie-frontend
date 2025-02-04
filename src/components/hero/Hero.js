import './Hero.css';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";

const Hero = ({ movies }) => {
    const navigate = useNavigate();

    function reviews(movieId) {
        navigate(`/Reviews/${movieId}`);
    }

    // Ensure movies array is not empty
    if (!movies || movies.length === 0) {
        return <p>Loading movies...</p>;
    }




    const addToWatchlist = async (movieId) => {
        const userId = localStorage.getItem("loggedInUser") || "guest";
        const token = localStorage.getItem("jwtToken"); // ✅ Get token from localStorage
    
        try {
            if (userId === "guest") {
                let guestWatchlist = JSON.parse(localStorage.getItem("guestWatchlist")) || [];
                if (!guestWatchlist.includes(movieId)) {
                    guestWatchlist.push(movieId);
                    localStorage.setItem("guestWatchlist", JSON.stringify(guestWatchlist));
                    toast.success("🎬 Movie added to your watchlist!");
                } else {
                    toast.info("⚠️ Movie is already in your watchlist.");
                }
            } else {
                const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/watchlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ✅ Now token is defined
                    },
                    body: JSON.stringify({ movieId }),
                });
    
                if (response.ok) {
                    toast.success("🎬 Movie added to your watchlist!");
                } else {
                    const errorMessage = await response.text();
                    if (errorMessage.includes("already in watchlist")) {
                        toast.info("⚠️ Movie is already in your watchlist.");
                    } else {
                        alert("Failed to add movie: " + errorMessage);
                    }
                }
            }
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            toast.error("❌ Something went wrong. Please try again later.");
        }
    };
    
    
    


    return (
        <div className='movie-carousel-container'>
            <Carousel>
                {movies.map((movie) => (
                    <Paper key={movie.imdbId}>
                        <div className='movie-card-container'>
                            <div
                                className='movie-card'
                                style={{
                                    "--img": movie.backdrops && movie.backdrops.length > 0 ? `url(${movie.backdrops[0]})` : "none",
                                }}
                            >
                                <div className='movie-detail'>
                                    <div className='movie-poster'>
                                        <img src={movie.poster ? movie.poster : "/default-poster.jpg"} alt={movie.title} />
                                    </div>
                                    <div className='movie-title'>
                                        <h4>{movie.title}</h4>
                                    </div>
                                    <div className="movie-buttons-container">
                                        <Link to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                                            <FontAwesomeIcon className="play-button-icon" icon={faCirclePlay} />
                                        </Link>

                                        <div className="movie-review-button-container">
                                            <Button variant="info" onClick={() => reviews(movie.imdbId)}>
                                                Reviews
                                            </Button>
                                            <Button
                                                variant="outline-warning"
                                                onClick={() => addToWatchlist(movie.imdbId)}
                                            >
                                                Add to Watchlist
                                            </Button>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Paper>
                ))}
            </Carousel>
        </div>
    );
};

export default Hero;
