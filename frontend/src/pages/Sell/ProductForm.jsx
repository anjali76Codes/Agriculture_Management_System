import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Button, Form, Col, Row, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../components/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProductForm = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productType, setProductType] = useState('selling');
    const [productImages, setProductImages] = useState([]);
    const [location, setLocation] = useState('');
    const [imageError, setImageError] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) { // Limit to 5 images
            setImageError('You can only upload up to 5 images.');
            return;
        }
        setImageError('');
        setProductImages(files);
    };

    const uploadImagesToFirebase = async (files, path) => {
        const uploadedImageURLs = [];
        const uploadPromises = files.map((file) => {
            const storageRef = ref(storage, `${path}/${file.name}`);

            return uploadBytes(storageRef, file).then(() => {
                return getDownloadURL(storageRef).then((downloadURL) => {
                    uploadedImageURLs.push(downloadURL);
                });
            }).catch((error) => {
                console.error("Error uploading file:", error);
                throw new Error("Upload failed");
            });
        });

        await Promise.all(uploadPromises);
        return uploadedImageURLs;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            if (!token || !username) {
                throw new Error('Authorization token or username not found.');
            }

            const userPath = `users/${username}`;
            const imagePath = `${userPath}/${productName}/images`;
            const imageURLs = await uploadImagesToFirebase(productImages, imagePath);

            const formData = {
                username, // Include username in the form data
                name: productName,
                description: productDescription,
                price: productPrice,
                type: productType,
                location,
                images: imageURLs
            };

            await axios.post('http://localhost:3000/api/products', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setSubmitMessage('Product added successfully!');
        } catch (error) {
            setSubmitMessage('Failed to add product.');
            console.error('Error submitting form:', error);
        }
    };



    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Add New Product</h2>
            <Form onSubmit={handleSubmit}>
                {submitMessage && <Alert variant={submitMessage.includes('successfully') ? 'success' : 'danger'}>{submitMessage}</Alert>}

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="productName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter product price"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="productDescription">
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Enter product description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Product Type</Form.Label>
                    <Form.Check
                        type="radio"
                        id="selling"
                        name="productType"
                        label="Selling"
                        value="selling"
                        checked={productType === 'selling'}
                        onChange={(e) => setProductType(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        id="renting"
                        name="productType"
                        label="Renting"
                        value="renting"
                        checked={productType === 'renting'}
                        onChange={(e) => setProductType(e.target.value)}
                    />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="productImages">
                            <Form.Label>Product Images</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleImageChange}
                            />
                            {imageError && <Alert variant="danger" className="mt-2">{imageError}</Alert>}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">Submit</Button>
                    </Col>

                    <Col md={6}>
                        {productImages.length > 0 && (
                            <Form.Group>
                                <Form.Label>Image Preview</Form.Label>
                                <Card className="mb-3">
                                    <Carousel>
                                        {Array.from(productImages).map((file, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index}`}
                                                    className="d-block w-100"
                                                    style={{ height: 'auto', maxHeight: '300px' }}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </Card>
                            </Form.Group>
                        )}
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ProductForm;
