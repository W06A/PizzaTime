// Import required modules
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const Order = require('./Models/order');
require('dotenv').config();



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', 
});
// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Endpoint to create a payment intent
app.post('/create-payment-intent/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the order details from the database
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }

    // Calculate the total amount in cents (Stripe requires the amount to be in cents)
    const amount = order.totalPrice * 100;

    // Create a payment intent with the total amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: 'Payment for your order',
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_id: id,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});

app.post('/complete-payment', async (req, res) => {
  const { clientSecret } = req.body;

  try {
    
    const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);

    if (paymentIntent.status === 'succeeded') {
      
      res.send({ success: true });
    } else {
      res.status(400).send({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).send({ error: 'Failed to complete payment' });
  }
});


require('./Config/auth');
require('./Config/connect');
require('./Routes/user')(app);
require('./Routes/order')(app);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});