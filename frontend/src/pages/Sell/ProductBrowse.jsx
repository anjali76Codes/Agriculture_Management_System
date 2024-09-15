import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductBrowse = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/api/products');
                setProducts(response.data);
                setError('');
            } catch (err) {
                setError('Error fetching products');
                console.error('Error fetching products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []); // Fetch products only once on component mount

    return (
        <Container className="mt-4">
            <div className="text-center mb-4">
                <h2>Browse Products</h2>
            </div>
            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Col xs={12} md={4} className="mb-4" key={product._id}>
                                <Card style={{ width: '100%' }}>
                                    <Card.Img
                                        variant="top"
                                        src={product.images[0] || '/path/to/default-image.jpg'}
                                        alt={product.name}
                                        style={{ height: '180px', objectFit: 'cover' }}
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
                                        <Link to={`/products/${product._id}`} className="btn btn-primary">View Details</Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>No products available</p>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default ProductBrowse;
