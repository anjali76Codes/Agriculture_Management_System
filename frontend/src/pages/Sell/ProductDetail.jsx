import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Carousel, Modal, ListGroup, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Sell/ProductDetail.css';
import StarRating from '../../components/StarRating';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [userReviewsCount, setUserReviewsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const reviewsToShow = 2;
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            if (!token || !username) {
                setError('User not authenticated.');
                return;
            }

            const response = await axios.get(`http://localhost:3000/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const productData = response.data;
            setProduct(productData);
            setReviews(productData.reviews || []);

            if (productData.reviews && productData.reviews.length > 0) {
                const totalRating = productData.reviews.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating(totalRating / productData.reviews.length);
            }

            if (productData.username === username) {
                setIsOwner(true);
            }

            const userReviewCount = productData.reviews.filter(review => review.username === username).length;
            setUserReviewsCount(userReviewCount);
        } catch (err) {
            setError('Error fetching product');
            console.error('Error fetching product:', err);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleShowModal = (image) => {
        setModalImage(image);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (userReviewsCount >= 2) {
            alert('You can only submit up to two reviews for this product.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3000/api/products/${id}/reviews`, {
                rating,
                comment: reviewText,
                username: localStorage.getItem('username') || 'Anonymous'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const newReviews = [...reviews, response.data];
            setReviews(newReviews);
            setReviewText('');
            setRating(1);

            setUserReviewsCount(userReviewsCount + 1);

            if (newReviews.length > 0) {
                const totalRating = newReviews.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating(totalRating / newReviews.length);
            }
        } catch (err) {
            setError('Error submitting review');
            console.error('Error submitting review:', err);
        }
    };

    const toggleShowMore = () => {
        setShowMore(prevShowMore => !prevShowMore);
    };

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (isLoading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="grow" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading product details...</p>
            </Container>
        );
    }

    if (!product) {
        return <div>No product found</div>;
    }

    const displayedReviews = showMore ? reviews : reviews.slice(0, reviewsToShow);

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col md={8}>
                    <Card className="product-card shadow-sm">
                        <Card.Body>
                            {product.images.length > 1 ? (
                                <Carousel>
                                    {product.images.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <Card.Img
                                                variant="top"
                                                src={image}
                                                alt={product.name}
                                                className="product-image"
                                                onClick={() => handleShowModal(image)}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <Card.Img
                                    variant="top"
                                    src={product.images[0] || '/path/to/default-image.jpg'}
                                    alt={product.name}
                                    className="product-image"
                                    onClick={() => handleShowModal(product.images[0])}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="product-details-card shadow-sm">
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text className="text-muted">{product.description}</Card.Text>
                            <Card.Text>
                                <strong className="price-text">${product.price.toFixed(2)}</strong>
                            </Card.Text>
                            <Card.Text>
                                <small className="text-muted">Location: {product.location}</small>
                            </Card.Text>
                            <Card.Text>
                                <Badge bg="info">{product.type}</Badge>
                            </Card.Text>
                            <Card.Text>
                                <strong>Rental Duration: {product.rentalDuration || 'Not Specified'}</strong>
                            </Card.Text>
                            <Card.Text>
                                <strong>Availability: {product.available ? 'Available' : 'Not Available'}</strong>
                            </Card.Text>
                            {product.depositAmount && (
                                <Card.Text>
                                    <strong>Deposit Amount: ${product.depositAmount.toFixed(2)}</strong>
                                </Card.Text>
                            )}
                            {product.rentalTerms && (
                                <Card.Text>
                                    <strong>Rental Terms:</strong>
                                    <p>{product.rentalTerms}</p>
                                </Card.Text>
                            )}
                            {product.condition && (
                                <Card.Text>
                                    <strong>Condition: {product.condition}</strong>
                                </Card.Text>
                            )}
                            <Button variant="primary" className="w-100" disabled={!product.available}>Rent Now</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Reviews</Card.Title>
                            <div className="d-flex align-items-center mb-3">
                                <StarRating rating={averageRating} size={24} />
                                <span className="ml-2">{averageRating.toFixed(1)} / 5</span>
                            </div>
                            <ListGroup>
                                {displayedReviews.length > 0 ? (
                                    displayedReviews.map((review, index) => (
                                        <ListGroup.Item key={index} className={review.username === localStorage.getItem('username') ? 'my-review' : ''}>
                                            <h6>{review.username}</h6>
                                            <div className="d-flex align-items-center">
                                                <StarRating rating={review.rating} size={20} />
                                                <div className="ml-2">{review.comment}</div>
                                            </div>
                                            <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>No Reviews</ListGroup.Item>
                                )}
                            </ListGroup>
                            {reviews.length > reviewsToShow && (
                                <Button variant="link" className="mt-3" onClick={toggleShowMore}>
                                    {showMore ? 'View Less' : 'View More'}
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {!isOwner && (
                <Row className="mb-4">
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Write a Review</Card.Title>
                                <Form onSubmit={handleReviewSubmit}>
                                    <Form.Group controlId="reviewRating">
                                        <Form.Label>Rating</Form.Label>
                                        <StarRating rating={rating} onChange={setRating} size={30} />
                                    </Form.Group>
                                    <Form.Group controlId="reviewText">
                                        <Form.Label>Review</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100">Submit Review</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img
                        src={modalImage}
                        alt="Enlarged"
                        className="img-fluid"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductDetail;
