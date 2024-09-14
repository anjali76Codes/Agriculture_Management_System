import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const username = localStorage.getItem('username');

                if (!token || !username) {
                    setError('User not authenticated.');
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        username // Pass username as query parameter
                    }
                });

                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch your products.');
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">My Products</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Row>
                {products.length > 0 ? (
                    products.map((product) => (
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
                                        <strong>Price: ${product.price.toFixed(2)}</strong>
                                    </Card.Text>
                                    <Card.Text>
                                        <small className="text-muted">Location: {product.location}</small>
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

export default MyProducts;
