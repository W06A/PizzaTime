import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderContext } from './OrderContext';
import Navbar from './Navbar';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OrderDetails = styled.div`
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  font-size: 20px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
`;

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orderItems, setOrderItems } = useOrderContext();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/order/${id}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error('Error fetching order details', error);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStartOver = () => {
    setOrderItems([]);
    navigate('/order'); 
  };

  const handlePurchase = () => {
    navigate(`/checkout/${id}`); // Redirect to the Checkout page
  };

  return (
    <div>
      <Navbar />
      <StyledContainer>
        <OrderDetails>
          {order && (
            <div>
              <h2>YOUR ORDER</h2>
              <p>Method: {order.method}</p>
              <p>Qty: {order.quantity}</p>
              <p>Size: {order.size}</p>
              <p>Crust: {order.crust}</p>
              
              <div>
                <p>Toppings: {order.toppings && order.toppings.map(topping => topping.name).join(', ')}</p>
                <p style={{ textAlign: 'right', fontSize: '20px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500' }}>
                  Price: ${order.toppings.reduce((total, topping) => total + topping.price, 0).toFixed(2)}
                </p>
              </div>
              <hr/>
              {order.totalPrice !== undefined && <p style={{ textAlign: 'right', fontSize: '20px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '500' }}>Total: ${order.totalPrice.toFixed(2)}</p>}
            </div>
          )}
        </OrderDetails>
        <Buttons>
          <StyledButton className="btn btn-danger" onClick={handleStartOver}>
            START OVER
          </StyledButton>
          <StyledButton className="btn btn-success" onClick={handlePurchase}>
            PURCHASE
          </StyledButton>
        </Buttons>
      </StyledContainer>
    </div>
  );
};

export default DetailPage;
