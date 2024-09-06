import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51PJA5O01wbARWGSz0A7w8Kwb7F9914mJlUweB3fPdrxN9FonQJGnSqwxa1QoAXt8knJ3ct3NGMF2FanO5PHO1cnG00CPk1bFMf');

const Checkout = () => {
  const { id } = useParams(); // Assuming orderId is passed via URL params
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchOrderAndCreatePaymentIntent = async () => {
      if (!id) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }

      try {
        // Create payment intent
        const paymentIntentResponse = await axios.post(`http://localhost:8000/create-payment-intent/${id}`);

        if (paymentIntentResponse.data && paymentIntentResponse.data.clientSecret) {
          setClientSecret(paymentIntentResponse.data.clientSecret);
        } else {
          throw new Error('Client secret not returned from payment intent API');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Error creating payment intent');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndCreatePaymentIntent();
  }, [id]);
  
  const options = {
    clientSecret,
    appearance: {}, // You can add appearance options here if needed
    loader: 'auto',
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p> 
      ) : clientSecret ? (
        <Elements  options={options}  stripe={stripePromise}>
          <CheckoutForm  orderId={id} clientSecret={clientSecret} />
        </Elements>
      ) : (
        <p>Error: Unable to load checkout form.</p>
      )}
    </div>
  );
};

export default Checkout;
