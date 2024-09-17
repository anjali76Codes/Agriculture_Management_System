import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Carousel, ListGroup, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Sell/ProductDetail.css';
import StarRating from '../../components/StarRating';
import Payment from './Payment';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [userReviewsCount, setUserReviewsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const reviewsToShow = 2;
    const { id } = useParams();

    const fetchProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            if (!token || !username) {
                setError('User not authenticated.');
                setIsLoading(false);
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
            setPaymentAmount(productData.price);

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
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

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
        }
    };

    const toggleShowMore = () => {
        setShowMore(prevShowMore => !prevShowMore);
    };

    const handleRentNow = () => {
        if (product && product.available) {
            setShowPayment(true);
        } else {
            alert('Product is not available for rent.');
        }
    };

    const handlePaymentSuccess = (paymentId) => {
        if (!product) {
            console.error('Product details are not available');
            return;
        }

        const paymentDetails = {
            _id: product._id,
            username: product.username,
            name: product.name,
            description: product.description,
            images: product.images,
            location: product.location,
            price: product.price,
            depositAmount: product.depositAmount,
            rentalDuration: product.rentalDuration,
            condition: product.condition,
            available: product.available,
            contactInfo: product.contactInfo,
            availabilityDates: product.availabilityDates,
            tags: product.tags,
            type: product.type,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            paymentId: paymentId
        };

        console.log('Payment Details:', paymentDetails);

        setShowPayment(false);
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
                                                alt={product.name || 'Product Image'}
                                                className="product-image"
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <Card.Img
                                    variant="top"
                                    src={product.images[0] || '/path/to/default-image.jpg'}
                                    alt={product.name || 'Product Image'}
                                    className="product-image"
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="product-details-card shadow-sm">
                        <Card.Body>
                            <Card.Title>{product.name || 'Product Name'}</Card.Title>
                            <Card.Text className="text-muted">{product.description || 'No Description'}</Card.Text>
                            <Card.Text>
                                <strong className="price-text">${product.price ? product.price.toFixed(2) : '0.00'}</strong>
                            </Card.Text>
                            <Card.Text>
                                <small className="text-muted">Location: {product.location || 'Not Specified'}</small>
                            </Card.Text>
                            <Card.Text>
                                <Badge bg="info">{product.type || 'Type Not Specified'}</Badge>
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
                            <Button variant="primary" className="w-100" onClick={handleRentNow} disabled={!product.available}>
                                Rent Now
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {showPayment && (
                <Row className="mb-4">
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Payment
                                    amount={paymentAmount}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    product={product}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Average Rating</Card.Title>
                            <StarRating rating={averageRating} size={24} readonly />
                            <p>{averageRating.toFixed(1)} Stars</p>
                            <Card.Title>Reviews ({reviews.length})</Card.Title>
                            <ListGroup>
                                {displayedReviews.length > 0 ? (
                                    displayedReviews.map((review, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>{review.username}</strong> - <StarRating rating={review.rating} size={24} readonly />
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>No reviews yet</ListGroup.Item>
                                )}
                            </ListGroup>
                            {reviews.length > reviewsToShow && (
                                <Button variant="link" onClick={toggleShowMore}>
                                    {showMore ? 'Show Less' : 'Show More'}
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Write a Review</Card.Title>
                            <Form onSubmit={handleReviewSubmit}>
                                <Form.Group controlId="rating">
                                    <Form.Label>Rating</Form.Label>
                                    <StarRating rating={rating} onChange={setRating} size={24} />
                                </Form.Group>
                                <Form.Group controlId="reviewText">
                                    <Form.Label>Review</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" className="mt-2">
                                    Submit Review
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;
