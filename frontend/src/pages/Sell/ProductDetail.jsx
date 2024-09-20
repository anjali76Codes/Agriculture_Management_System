import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Carousel, ListGroup, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Sell/ProductDetail.css';
import StarRating from '../../components/StarRating';
import Payment from './Payment';
import { useTranslation } from 'react-i18next';

const ProductDetail = () => {
    const { t } = useTranslation();
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
    const reviewsToShow = 10;
    const { id } = useParams();

    const fetchProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!token || !userInfo) {
                setError(t('productDetail.error.auth'));
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
            setPaymentAmount(productData.depositAmount);

            if (productData.reviews && productData.reviews.length > 0) {
                const totalRating = productData.reviews.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating(totalRating / productData.reviews.length);
            }

            if (productData.username === userInfo.username) {
                setIsOwner(true);
            }

            const userReviewCount = productData.reviews.filter(review => review.username === userInfo.username).length;
            setUserReviewsCount(userReviewCount);
        } catch (err) {
            setError(t('productDetail.error.fetch'));
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
            alert(t('productDetail.review.limit'));
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            const response = await axios.post(`http://localhost:3000/api/products/${id}/reviews`, {
                rating,
                comment: reviewText,
                username: userInfo.username || 'Anonymous'
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
            setError(t('productDetail.error.submitReview'));
        }
    };

    const toggleShowMore = () => {
        setShowMore(prevShowMore => !prevShowMore);
    };

    const handleRentNow = () => {
        if (product && product.available) {
            setShowPayment(true);
        } else {
            alert(t('productDetail.rent.unavailable'));
        }
    };

    const handlePaymentSuccess = async (paymentId) => {
        if (!product) {
            console.error(t('productDetail.error.noProduct'));
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        const username = userInfo.username || 'Anonymous';
        const userEmail = userInfo.email || 'Not Provided';

        const paymentDetails = {
            username: username,
            email: userEmail,
            product: {
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
                contactInfo: product.contactInfo,
                availabilityDates: product.availabilityDates,
                tags: product.tags,
                type: product.type,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            },
            paymentId: paymentId,
        };

        try {
            // Update product availability to false
            await axios.patch(`http://localhost:3000/api/products/${product._id}`, { available: false }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Product availability updated successfully');
            setProduct((prevProduct) => ({ ...prevProduct, available: false }));
        } catch (err) {
            console.error('Error updating product availability:', err);
        }

        setShowPayment(false);
    };

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (isLoading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="grow" role="status" variant="primary">
                    <span className="visually-hidden">{t('productDetail.loading')}</span>
                </Spinner>
                <p>{t('productDetail.loadingText')}</p>
            </Container>
        );
    }

    if (!product) {
        return <div>{t('productDetail.notFound')}</div>;
    }

    const displayedReviews = showMore ? reviews : reviews.slice(0, reviewsToShow);
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    const username = userInfo.username || 'Anonymous';

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="product-card shadow-sm">
                        <Card.Body>
                            {product.images.length > 1 ? (
                                <Carousel>
                                    {product.images.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <Card.Img
                                                variant="top"
                                                src={image}
                                                alt={product.name || t('productDetail.imageAlt')}
                                                className="product-image"
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <Card.Img
                                    variant="top"
                                    src={product.images[0] || '/path/to/default-image.jpg'}
                                    alt={product.name || t('productDetail.imageAlt')}
                                    className="product-image"
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="product-details-card shadow-sm">
                        <Card.Body>
                            <Card.Title>{product.name || t('productDetail.defaultName')}</Card.Title>
                            <Card.Text className="text-muted">{product.description || t('productDetail.noDescription')}</Card.Text>
                            <Card.Text>
                                <strong className="price-text">₹{product.price ? product.price.toFixed(2) : '0.00'}</strong>
                            </Card.Text>
                            <Card.Text>
                                <small className="text-muted">{t('productDetail.location')}: {product.location || t('productDetail.notSpecified')}</small>
                            </Card.Text>
                            <Card.Text>
                                <Badge bg="info" className='badge'>{product.type || t('productDetail.typeNotSpecified')}</Badge>
                            </Card.Text>
                            <Card.Text>
                                <strong>{t('productDetail.rentalDuration')}: {product.rentalDuration || t('productDetail.notSpecified')}</strong>
                            </Card.Text>
                            <Card.Text>
                                <strong>{t('productDetail.availability')}: {product.available ? t('productDetail.available') : t('productDetail.notAvailable')}</strong>
                            </Card.Text>
                            {product.depositAmount && (
                                <Card.Text>
                                    <strong>{t('productDetail.depositAmount')}: ₹{product.depositAmount.toFixed(2)}</strong>
                                </Card.Text>
                            )}
                            {product.rentalTerms && (
                                <Card.Text>
                                    <strong>{t('productDetail.rentalTerms')}:</strong>
                                    <p>{product.rentalTerms}</p>
                                </Card.Text>
                            )}
                            {product.condition && (
                                <Card.Text>
                                    <strong>{t('productDetail.condition')}: {product.condition}</strong>
                                </Card.Text>
                            )}
                            <Button variant="primary" className="w-100 bttn" onClick={handleRentNow} disabled={!product.available || isOwner}>
                                {t('productDetail.rentNow')}
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
                    <Card className="shadow-sm reviews">
                        <Card.Body>
                            <Card.Title>{t('productDetail.averageRating')}</Card.Title>
                            <StarRating rating={averageRating} size={24} readonly />
                            <p>{averageRating.toFixed(1)} {t('productDetail.stars')}</p>
                            <Card.Title>{t('productDetail.reviews')} ({reviews.length})</Card.Title>
                            <ListGroup>
                                {displayedReviews.length > 0 ? (
                                    displayedReviews.map((review, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>{review.username}</strong> - <StarRating rating={review.rating} size={24} readonly />
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>{t('productDetail.noReviews')}</ListGroup.Item>
                                )}
                            </ListGroup>
                            {reviews.length > reviewsToShow && (
                                <Button variant="link" onClick={toggleShowMore}>
                                    {showMore ? t('productDetail.showLess') : t('productDetail.showMore')}
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Show review section only if the user is not the owner */}
            {username !== product.username && (
                <Row>
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>{t('productDetail.writeReview')}</Card.Title>
                                <Form onSubmit={handleReviewSubmit}>
                                    <Form.Group controlId="rating">
                                        <Form.Label>{t('productDetail.rating')}</Form.Label>
                                        <StarRating rating={rating} onChange={setRating} size={24} />
                                    </Form.Group>
                                    <Form.Group controlId="reviewText">
                                        <Form.Label>{t('productDetail.review')}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary" className="mt-2 bttn">
                                        {t('button.submitReview')}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default ProductDetail;
