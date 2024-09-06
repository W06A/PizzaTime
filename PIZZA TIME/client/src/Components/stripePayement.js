import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_CLIENT_KEY);

export default function StripeCheckout({ id }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!id) {
      console.error('Order ID not found');
      return;
    }

    fetch("https://localhost:8000/create-payment-intent", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
         "Authorization": `Bearer ${process.env.REACT_APP_SERVER_KEY}`
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const options = {
    clientSecret,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderId={id} clientSecret={clientSecret} />
        </Elements>
      )}
     
    </div>
  );
}
  