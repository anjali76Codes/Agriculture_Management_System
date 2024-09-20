
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Carousel, Button, Form, Col, Row, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { storage } from '../../components/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../../components/LanguageToggle';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import '../../styles/Sell/ProductForm.css';

const ProductForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // State hooks
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [rentalDuration, setRentalDuration] = useState('');
    const [availabilityDates, setAvailabilityDates] = useState({ startDate: null, endDate: null });
    const [depositAmount, setDepositAmount] = useState('');
    const [condition, setCondition] = useState('');
    const [contactInfo, setContactInfo] = useState({ phone: '', email: '' });
    const [productImages, setProductImages] = useState([]);
    const [location, setLocation] = useState('');
    const [imageError, setImageError] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Automatically set deposit amount to half of the price
    useEffect(() => {
        if (productPrice) {
            setDepositAmount((parseFloat(productPrice) / 2).toString());
        }
    }, [productPrice]);

    // Automatically set end date based on the start date when a rental duration is selected
    useEffect(() => {
        if (availabilityDates.startDate) {
            const newEndDate = new Date(availabilityDates.startDate);
            if (rentalDuration === '1 week') {
                newEndDate.setDate(newEndDate.getDate() + 7);
            } else if (rentalDuration === '1 month') {
                newEndDate.setMonth(newEndDate.getMonth() + 1);
            } else if (rentalDuration === '3 months') {
                newEndDate.setMonth(newEndDate.getMonth() + 3);
            } else if (rentalDuration === '6 months') {
                newEndDate.setMonth(newEndDate.getMonth() + 6);
            } else if (rentalDuration === '1 year') {
                newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            }
            setAvailabilityDates(prev => ({ ...prev, endDate: newEndDate }));
        }
    }, [rentalDuration, availabilityDates.startDate]);

    // Handle image file changes
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter(file => file.type.startsWith('image/'));

        if (validImages.length !== files.length) {
            setImageError(t('error.invalidFileType'));
            return;
        }

        if (validImages.length > 5) {
            setImageError(t('error.maxImages'));
            return;
        }

        setImageError('');
        setProductImages(validImages);
    };

    // Remove selected image
    const removeImage = (index) => {
        setProductImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    // Upload images to Firebase
    const uploadImagesToFirebase = async (files, path) => {
        const uploadedImageURLs = [];
        const uploadPromises = files.map((file) => {
            const storageRef = ref(storage, `${path}/${file.name}`);
            return uploadBytes(storageRef, file)
                .then(() => getDownloadURL(storageRef))
                .then((downloadURL) => uploadedImageURLs.push(downloadURL))
                .catch((error) => {
                    console.error("Error uploading file:", error);
                    throw new Error(t('error.uploadFailed'));
                });
        });

        await Promise.all(uploadPromises);
        return uploadedImageURLs;
    };

    // Inside the handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Parse the userInfo object

            if (!userInfo || !userInfo.token || !userInfo.username) {
                throw new Error(t('error.authError'));
            }

            const { token, username } = userInfo; // Destructure token and username

            const userPath = `users/${username}`;
            const imagePath = `${userPath}/${productName}/images`;
            const imageURLs = await uploadImagesToFirebase(productImages, imagePath);

            const formData = {
                username,
                name: productName,
                description: productDescription,
                price: productPrice,
                type: productCategory,
                location,
                rentalDuration,
                available: availabilityDates.startDate ? true : false,
                depositAmount,
                condition,
                contactInfo,
                images: imageURLs,
                category: productCategory,
                tags: [],
                rentalTerms: "",
                reviews: [],
                availabilityDates: [
                    {
                        startDate: availabilityDates.startDate ? new Date(availabilityDates.startDate) : null,
                        endDate: availabilityDates.endDate ? new Date(availabilityDates.endDate) : null
                    }
                ]
            };

            await axios.post('http://localhost:3000/api/products', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setSubmitMessage("Updated successfully");
            navigate('/products/my-products');
        } catch (error) {
            setSubmitMessage(t('error.submitFailed'));
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="productform-container container mt-4">
            {/* <LanguageToggle /> */}
            <h2 className="text-center mb-4">{t('form.title')}</h2>
            <Form onSubmit={handleSubmit}>
                {submitMessage && (
                    <Alert variant={submitMessage.includes("Updated successfully") ? 'success' : 'danger'}>
                        {submitMessage}
                    </Alert>
                )}

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="productName">
                            <Form.Label>{t('form.productName')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t('form.enterProductName')}
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                            <Form.Text className="text-muted">
                                {t('form.nameHint')}
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="productPrice">
                            <Form.Label>{t('form.productPrice')}</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder={t('form.enterProductPrice')}
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                            />
                            <Form.Text className="text-muted">
                                {t('form.priceHint')}
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="productDescription" className="mb-3">
                    <Form.Label>{t('form.productDescription')}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder={t('form.enterProductDescription')}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>{t('form.productCategory')}</Form.Label>
                    <Form.Control
                        as="select"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        required
                    >
                        <option value="">{t('form.selectCategory')}</option>
                        <option value="renting">{t('form.categoryRenting')}</option>
                    </Form.Control>
                </Form.Group>

                {productCategory === 'renting' && (
                    <>
                        <Form.Group controlId="rentalDuration" className="mb-3">
                            <Form.Label>{t('form.rentalDuration')}</Form.Label>
                            <Form.Control
                                as="select"
                                value={rentalDuration}
                                onChange={(e) => setRentalDuration(e.target.value)}
                            >
                                <option value="">{t('form.selectDuration')}</option>
                                <option value="1 week">1 {t('form.week')}</option>
                                <option value="1 month">1 {t('form.month')}</option>
                                <option value="3 months">3 {t('form.months')}</option>
                                <option value="6 months">6 {t('form.months')}</option>
                                <option value="1 year">1 {t('form.year')}</option>
                            </Form.Control>
                            <Form.Text className="text-muted">
                                {t('form.rentalDurationHint')}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="availabilityDates" className="mb-3">
                            <Form.Label>{t('form.availabilityDates')}</Form.Label>
                            <Row>
                                <Col md={6}>
                                    <Form.Label>{t('form.startDate')}</Form.Label>
                                    <DatePicker
                                        selected={availabilityDates.startDate}
                                        onChange={(date) => setAvailabilityDates(prev => ({ ...prev, startDate: date }))}
                                        className="form-control"
                                        placeholderText={t('form.selectStartDate')}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Label>{t('form.endDate')}</Form.Label>
                                    <DatePicker
                                        selected={availabilityDates.endDate}
                                        onChange={(date) => setAvailabilityDates(prev => ({ ...prev, endDate: date }))}
                                        className="form-control"
                                        placeholderText={t('form.selectEndDate')}
                                        disabled
                                    />
                                </Col>
                            </Row>
                            <Form.Text className="text-muted">
                                {t('form.availabilityDatesHint')}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="depositAmount" className="mb-3">
                            <Form.Label>{t('form.depositAmount')}</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder={t('form.enterDepositAmount')}
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                {t('form.depositAmountHint')}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="condition" className="mb-3">
                            <Form.Label>{t('form.condition')}</Form.Label>
                            <Form.Control
                                as="select"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                <option value="">{t('form.selectCondition')}</option>
                                <option value="new">{t('form.conditionNew')}</option>
                                <option value="used">{t('form.conditionUsed')}</option>
                                <option value="refurbished">{t('form.conditionRefurbished')}</option>
                            </Form.Control>
                        </Form.Group>
                    </>
                )}

                <Form.Group controlId="contactInfo" className="mb-3">
                    <Form.Label>{t('form.contactInfo')}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={t('form.enterPhoneNumber')}
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="mb-2"
                    />
                    <Form.Control
                        type="email"
                        placeholder={t('form.enterEmail')}
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="productImages">
                            <Form.Label>{t('form.productImages')}</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleImageChange}
                            />
                            {imageError && <Alert variant="danger" className="mt-2">{imageError}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="location" className="mt-3">
                            <Form.Label>{t('form.location')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t('form.enterLocation')}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="bttn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner animation="border" size="sm" /> : t('form.submit')}
                        </Button>
                    </Col>

                    <Col md={6} >
                        {productImages.length > 0 && (
                            <Form.Group className="mt-3">
                                <Form.Label>{t('form.imagePreview')}</Form.Label>
                                <Card>
                                    <Carousel>
                                        {Array.from(productImages).map((file, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index}`}
                                                    className="d-block w-100"
                                                    style={{ height: 'auto', maxHeight: '300px' }}
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="position-absolute top-0 end-0 m-2"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                </Button>
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
