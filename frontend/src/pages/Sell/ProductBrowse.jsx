import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert, Spinner, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Sell/ProductBrowse.css';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 5; // Number of products per page

const ProductBrowse = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/api/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
                setError('');
            } catch (err) {
                setError(t('browse.error'));
                console.error('Error fetching products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [t]);

    useEffect(() => {
        const filterProducts = () => {
            let filtered = products;

            if (searchQuery) {
                filtered = products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setFilteredProducts(filtered);
            setCurrentPage(1);
        };

        filterProducts();
    }, [searchQuery, products]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Container className="browsingContainer">
            <div className="text-center mb-4">
                <h2>{t('browse.title')}</h2>
            </div>
            <Form className="mb-4">
                <Form.Group controlId="search">
                    <Form.Control
                        type="text"
                        placeholder={t('browse.searchPlaceholder')}
                        onChange={(e) => handleSearch(e.target.value)}
                        className='searchbar'
                    />
                </Form.Group>
            </Form>
            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">{t('browse.loading')}</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    <Row>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <Col sm={12} md={6} className="mb-4" key={product._id}>
                                    <div className="card-container">
                                        <img
                                            src={product.images[0] || '/path/to/default-image.jpg'}
                                            alt={product.name}
                                            className="card-img"
                                        />
                                        <div className="card-body card-body-content">
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Text>{product.description}</Card.Text>
                                            <Card.Text>
                                                <strong>{t('browse.price')}: Rs. {product.price.toFixed(2)}</strong>
                                            </Card.Text>
                                            <Card.Text>
                                                <small className="text-muted">{t('browse.location')}: {product.location}</small>
                                            </Card.Text>
                                            <Link to={`/products/${product._id}`}>
                                                <button className="bttn">{t('browse.viewDetails')}</button>
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center">
                                <p>{t('browse.noProducts')}</p>
                            </Col>
                        )}
                    </Row>
                    <div className="text-center mt-4">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages).keys()].map(page => (
                                <Pagination.Item
                                    key={page + 1}
                                    active={page + 1 === currentPage}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </>
            )}
        </Container>
    );
};

export default ProductBrowse;
