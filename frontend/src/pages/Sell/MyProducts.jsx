// src/pages/Sell/MyProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyProducts = () => {
    const { t } = useTranslation(); // Initialize translation hook
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }

        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));

                if (!token || !userInfo || !userInfo.username) {
                    setError(t('myProducts.userNotAuthenticated'));
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Filter products to match the current user's username
                const userProducts = response.data.filter(product => product.username === userInfo.username);
                setProducts(userProducts);
            } catch (err) {
                setError(t('myProducts.fetchError'));
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isAuthenticated, navigate, t]);

    const handleAddProductClick = () => {
        navigate('/products/add');
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">{t('myProducts.title')}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">{t('myProducts.loading')}</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <Row>
                        {products.length > 0 ? (
                            <>
                                {products.map((product) => (
                                    <Col md={4} key={product._id} className="mb-4">
                                        <Card>
                                            <Card.Img
                                                variant="top"
                                                src={product.images[0] || '/path/to/default-image.jpg'}
                                                alt={product.name}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <Card.Title>{product.name}</Card.Title>
                                                <Card.Text>{product.description}</Card.Text>
                                                <Card.Text>
                                                    <strong>{t('myProducts.price')}: ₹{product.price.toFixed(2)}</strong>
                                                </Card.Text>
                                                <Card.Text>
                                                    <small className="text-muted">{t('myProducts.location')}: {product.location}</small>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </>
                        ) : (
                            <Col className="text-center">
                                <p>{t('myProducts.noProducts')}</p>
                            </Col>
                        )}
                    </Row>
                    <div className="text-center mt-4">
                        <Button variant="primary" className='bttn' onClick={handleAddProductClick}>
                            {t('myProducts.addProductButton')}
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default MyProducts;
    