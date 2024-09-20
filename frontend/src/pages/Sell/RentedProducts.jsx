import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RentedProducts = () => {
    const [rentedProducts, setRentedProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentedProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
                const email = userInfo.email;

                if (!token) {
                    setError('User not authenticated.');
                    setLoading(false);
                    return;
                }

                if (!email) {
                    setError('User email is missing.');
                    setLoading(false);
                    return;
                }

                // Fetch rented products
                const rentedResponse = await axios.get('http://localhost:3000/api/rented-products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        email
                    },
                });

                // Check if there are rented products
                if (rentedResponse.data.length === 0) {
                    setLoading(false);
                    return; // No products, so we will show "No products available" later
                }

                // Fetch product details for each rented product
                const productPromises = rentedResponse.data.map(async rentedProduct => {
                    const productResponse = await axios.get(`http://localhost:3000/api/products/${rentedProduct.product}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    return {
                        ...rentedProduct,
                        product: productResponse.data
                    };
                });

                const productsWithDetails = await Promise.all(productPromises);
                setRentedProducts(productsWithDetails);
            } catch (err) {
                setError('Failed to fetch rented products.');
                console.error('Error fetching rented products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRentedProducts();
    }, []);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
                <p>Loading rented products...</p>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">My Rented Products</h2>
            <Row>
                {rentedProducts.length > 0 ? (
                    rentedProducts.map(rentedProduct => (
                        <Col md={4} key={rentedProduct._id} className="mb-4">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={(rentedProduct.product.images && rentedProduct.product.images[0]) || '/path/to/default-image.jpg'}
                                    alt={rentedProduct.product.name || 'Product image'}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title>{rentedProduct.product.name || 'Product Name'}</Card.Title>
                                    <Card.Text>{rentedProduct.product.description || 'No description available.'}</Card.Text>
                                    <Card.Text>
                                        <strong>Price: ₹{rentedProduct.product.price ? rentedProduct.product.price.toFixed(2) : '0.00'}</strong>
                                    </Card.Text>
                                    <Card.Text>
                                        <small className="text-muted">Location: {rentedProduct.product.location || 'Not specified'}</small>
                                    </Card.Text>
                                    <Card.Text>
                                        <small className="text-muted">Rented At: {new Date(rentedProduct.rentedAt).toLocaleDateString()}</small>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center">
                        <p>No products available.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default RentedProducts;
