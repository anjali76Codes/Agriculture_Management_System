import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Carousel, ListGroup, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Sell/ProductDetail.css';
import StarRating from '../../components/StarRating';
import Payment from './Payment';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ProductDetail = () => {
    const { t } = useTranslation(); // Initialize useTranslation
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
                setError(t('error.userNotAuthenticated')); // Use translation
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
            setError(t('error.fetchProduct')); // Use translation
        } finally {
            setIsLoading(false);
        }
    }, [id, t]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (userReviewsCount >= 2) {
            alert(t('alert.maxReviews')); // Use translation
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
            setError(t('error.submitReview')); // Use translation
        }
    };

    const toggleShowMore = () => {
        setShowMore(prevShowMore => !prevShowMore);
    };

    const handleRentNow = () => {
        if (product && product.available) {
            setShowPayment(true);
        } else {
            alert(t('alert.productNotAvailable')); // Use translation
        }
    };

    // Handle payment success here...

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (isLoading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="grow" role="status" variant="primary">
                    <span className="visually-hidden">{t('loading')}</span>
                </Spinner>
                <p>{t('loading.productDetails')}</p>
            </Container>
        );
    }

    if (!product) {
        return <div>{t('error.noProductFound')}</div>;
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
                            <Card.Title>{product.name || t('product.defaultName')}</Card.Title>
                            <Card.Text className="text-muted">{product.description || t('product.noDescription')}</Card.Text>
                            <Card.Text>
                                <strong className="price-text">${product.price ? product.price.toFixed(2) : '0.00'}</strong>
                            </Card.Text>
                            <Card.Text>
                                <small className="text-muted">{t('product.location')}: {product.location || t('product.notSpecified')}</small>
                            </Card.Text>
                            <Card.Text>
                            <Badge bg="info" className='badge'>{product.type || 'Type Not Specified'}</Badge>

<Badge bg="info">{product.type || t('product.typeNotSpecified')}</Badge>
                            </Card.Text>
                            <Card.Text>
                                <strong>{t('product.rentalDuration')}: {product.rentalDuration || t('product.notSpecified')}</strong>
                            </Card.Text>
                            <Card.Text>
                                <strong>{t('product.availability')}: {product.available ? t('product.available') : t('product.notAvailable')}</strong>
                            </Card.Text>
                            {product.depositAmount && (
                                <Card.Text>
                                    <strong>{t('product.depositAmount')}: ${product.depositAmount.toFixed(2)}</strong>
                                </Card.Text>
                            )}
                            {product.rentalTerms && (
                                <Card.Text>
                                    <strong>{t('product.rentalTerms')}:</strong>
                                    <p>{product.rentalTerms}</p>
                                </Card.Text>
                            )}
                            {product.condition && (
                                <Card.Text>
                                    <strong>{t('product.condition')}: {product.condition}</strong>
                                </Card.Text>
                            )}
                            <Button variant="primary" className="w-100" onClick={handleRentNow} disabled={!product.available}>
                                {t('product.rentNow')}
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
                            <Card.Title>{t('product.averageRating')}</Card.Title>
                            <StarRating rating={averageRating} size={24} readonly />
                            <p>{averageRating.toFixed(1)} {t('stars')}</p>
                            <Card.Title>{t('product.reviews')} ({reviews.length})</Card.Title>
                            <ListGroup>
                                {displayedReviews.length > 0 ? (
                                    displayedReviews.map((review, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>{review.username}</strong> - <StarRating rating={review.rating} size={24} readonly />
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>{t('product.noReviews')}</ListGroup.Item>
                                )}
                            </ListGroup>
                            {reviews.length > reviewsToShow && (
                                <Button variant="link" onClick={toggleShowMore}>
                                    {showMore ? t('button.showLess') : t('button.showMore')}
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
                            <Card.Title>{t('product.writeReview')}</Card.Title>
                            <Form onSubmit={handleReviewSubmit}>
                                <Form.Group controlId="rating">
                                    <Form.Label>{t('product.rating')}</Form.Label>
                                    <StarRating rating={rating} onChange={setRating} size={24} />
                                </Form.Group>
                                <Form.Group controlId="reviewText">
                                    <Form.Label>{t('product.review')}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" className="mt-2 bttn">
                                    Submit Review

                                <Button type="submit" variant="primary" className="mt-2">
                                    {t('button.submitReview')}
                                </Button>
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
