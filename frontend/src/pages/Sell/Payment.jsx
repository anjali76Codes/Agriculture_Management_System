import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../../styles/Sell/Payment.css';

const Payment = ({ currentUser, onPaymentSuccess, amount, product }) => {
    const [paymentId, setPaymentId] = useState(null);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            if (!currentUser || !currentUser.id) {
                console.warn('currentUser or currentUser.id is not defined.');
                return;
            }

            try {
                const storedPaymentId = localStorage.getItem('paymentId');
                if (storedPaymentId) {
                    setPaymentId(storedPaymentId);
                    setPaymentCompleted(true);
                    setPaymentSuccessful(true);
                    return;
                }

                const response = await axios.get(`/api/check-payment-status/${currentUser.id}`);
                if (response.data.paymentCompleted) {
                    localStorage.setItem('paymentId', response.data.paymentId);
                    setPaymentId(response.data.paymentId);
                    setPaymentCompleted(true);
                    setPaymentSuccessful(true);
                }
            } catch (error) {
                console.error('Error fetching payment status:', error);
                setError('Error fetching payment status.');
            }
        };

        const handlePayment = () => {
            if (paymentCompleted) {
                alert('Payment already completed.');
                return;
            }

            setLoading(true);
            setError(null);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay key
                amount: amount * 100, // Convert amount to the smallest currency unit
                currency: 'INR',
                name: 'Product Purchase',
                description: 'Payment for product purchase',
                handler: function (response) {
                    setLoading(false);
                    setPaymentId(response.razorpay_payment_id);
                    // Log product details and payment ID
                    console.log('Product Title:', product.title);
                    console.log('Product Description:', product.description);
                    console.log('Product Price:', product.price);
                    console.log('Payment ID:', response.razorpay_payment_id);
                    setPaymentSuccessful(true);
                    setPaymentCompleted(true);
                    localStorage.setItem('paymentId', response.razorpay_payment_id);
                    setModalOpen(true);
                    if (onPaymentSuccess) {
                        onPaymentSuccess(response.razorpay_payment_id); // Notify parent component of success
                    }
                },
                prefill: {
                    name: currentUser?.name || 'User Name',
                    email: currentUser?.email || 'user@example.com',
                    contact: currentUser?.contact || '0000000000',
                },
                theme: {
                    color: '#3399cc'
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            try {
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            } catch (error) {
                setLoading(false);
                setError('Payment failed. Please try again.');
                console.error('Payment Error:', error);
            }
        };

        checkPaymentStatus(); // Check payment status on component mount

        if (!paymentCompleted) {
            handlePayment(); // Open payment modal only if payment is not completed
        }

    }, [currentUser, amount, onPaymentSuccess, paymentCompleted, product]); // Include product in dependencies

    const handleModalClose = () => {
        setModalOpen(false);
        // Optionally, redirect or perform other actions here
    };

    if (loading) {
        return (
            <div className="payment-container">
                <div className="spinner-container">
                    <Spinner animation="border" size="sm" />
                    <p>Processing payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <Modal show={modalOpen} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {paymentSuccessful ? 'Payment Successful' : 'Payment Failed'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {paymentSuccessful ? (
                        <div className="modal-content success">
                            <FaCheckCircle size={50} color="green" />
                            <p>Your payment was successful!</p>
                        </div>
                    ) : (
                        <div className="modal-content error">
                            <FaTimesCircle size={50} color="red" />
                            <p>There was an issue with your payment. Please try again.</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Payment;
