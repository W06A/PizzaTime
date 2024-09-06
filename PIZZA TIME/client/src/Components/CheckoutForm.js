import {React,useState} from 'react';
import { useStripe, useElements, CardElement,  LinkAuthenticationElement, PaymentElement, } from '@stripe/react-stripe-js';
import GoogleMapComponent from './GoogleMapComponent';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false); 
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  
  const handleAddressConfirm = (address) => {
    setDeliveryAddress(address);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsPaymentLoading(true); 

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(PaymentElement),
    });

    if (error) {
      console.error('Payment failed:', error);
      setIsPaymentLoading(false);
    } else {
      console.log('Payment successful:', paymentMethod);

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        console.error('Payment confirmation failed:', confirmError);
        setIsPaymentLoading(false); 
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        navigate('/success'); // Redirect to success page after successful payment
      }
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <GoogleMapComponent onAddressConfirm={handleAddressConfirm} />
        <form style={{ display: "block", width: "100%" }} onSubmit={handleSubmit}>
        <linkAuthenticationElement
        // Optional prop for prefilling customer information
        options={{
          defaultValues: {
            email: 'ouertani.wannes@gmail.com',
          },
        }}
      />
          <PaymentElement
        // Optional prop for prefilling customer information
        options={{
          defaultValues: {
            billingDetails: {
              name: 'ouertani wannes',
              phone: '888-888-8888',
            },
          },
        }}
      />

      <button type="submit" style={{
              display: 'block',
              margin: '20px auto 0 auto',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
