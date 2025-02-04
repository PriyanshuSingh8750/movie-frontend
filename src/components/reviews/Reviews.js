import { useEffect, useRef, useState } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';
import React from 'react'

const Reviews = () => {
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const revText = useRef();
    let { movieId } = useParams();

    // Fetch movie data on initial load
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await api.get(`/api/v1/movies/${movieId}`);
                setMovie(response.data);
                setReviews(response.data.reviewIds || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMovieData();
    }, [movieId]);

    // Handle review submission
    const addReview = async (e) => {
        e.preventDefault();
        const rev = revText.current.value;

        try {
            await api.post("/api/v1/reviews", {
                reviewBody: rev,
                imdbId: movieId,
            });

            // Fetch the updated movie data to get the latest reviews
            const response = await api.get(`/api/v1/movies/${movieId}`);
            setReviews(response.data.reviewIds || []);
            revText.current.value = "";
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    return (
        <Container>
            <Row>
                <Col><h3>Reviews</h3></Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    {movie?.poster ? (
                        <img src={movie.poster} alt={movie.title} />
                    ) : (
                        <p>Loading poster...</p>
                    )}
                </Col>
                <Col>
                    <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review?" />
                    <Row>
                        <Col><hr /></Col>
                    </Row>
                    {reviews?.length > 0 ? (
                        reviews.slice(0).reverse().map((r, index) => (
                            <React.Fragment key={index}>
                                <Row>
                                    <Col>{r.reviewBody}</Col>
                                </Row>
                                <Row>
                                    <Col><hr /></Col>
                                </Row>
                            </React.Fragment>
                        ))
                    ) : (
                        <p>No reviews yet. Be the first to add one!</p>
                    )}

                </Col>
            </Row>
            <Row>
                <Col><hr /></Col>
            </Row>
        </Container>
    );
};

export default Reviews;
