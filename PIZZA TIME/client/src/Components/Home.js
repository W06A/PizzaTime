import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useOrderContext } from './OrderContext';
import { useFavoriteContext } from './FavoriteContext';
import '../index.css';

const Title = styled.h2`
  color: black;
  text-align: center;
  padding: 10px;
`;

const DashboardPage = () => {
  const { id } = useParams();
  const { updateOrderCount } = useOrderContext();
  const [orders, setOrders] = useState([]);
  const { favoriteOrders, setFavoriteOrders } = useFavoriteContext();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/order/all');
        console.log('Fetched Orders:', response.data.orders);
        const ordersData = response.data.orders;
        if (ordersData && ordersData.length > 0) {
          setOrders(ordersData);
          updateOrderCount(ordersData.length);
        }
      } catch (error) {
        console.error('Error fetching order details', error);
      }
    };

    const fetchFavoriteOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/order/${id}/favoriteOrders`);
        console.log('Fetched Favorite Orders:', response.data.favoriteOrders);
        setFavoriteOrders(response.data.favoriteOrders);
      } catch (error) {
        console.error('Error fetching favorite orders', error);
      }
    };

    fetchOrders();
    fetchFavoriteOrders();
  }, [updateOrderCount,setFavoriteOrders,id,   userId]);

  const handleCreate = () => {
    navigate('/order');
  };

  const handleAdd = () => {
    try {
      navigate(`/Account/${userId}`);
    } catch (error) {
      console.error('Error navigating to Account page:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Title>QUICK OPTIONS</Title>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card">
              <div className="card-body">
                {orders && orders.length > 0 &&
                  orders.map((orderItem) => (
                    <div key={orderItem._id}>
                      <p>Method: {orderItem.method}</p>
                      <p>QTY: {orderItem.quantity}</p>
                      <p>Size: {orderItem.size}</p>
                      <p>Crust: {orderItem.crust}</p>
                      <p>Toppings: {orderItem.toppings && orderItem.toppings.map(t => t.name).join(', ')}</p>
                      <hr />
                    </div>
                  ))
                }
                <button onClick={handleCreate}>NEW ORDER</button>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card">
              <div className="card-body">
                {favoriteOrders && favoriteOrders.length > 0 ? (
                  favoriteOrders.map((orderItem) => (
                    <div key={orderItem._id}>
                      <p>Method: {orderItem.method}</p>
                      <p>QTY: {orderItem.quantity}</p>
                      <p>Size: {orderItem.size}</p>
                      <p>Crust: {orderItem.crust}</p>
                      <p>Toppings: {orderItem.toppings && orderItem.toppings.map(t => t.name).join(', ')}</p>
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No favorite orders found.</p>
                )}
                <button onClick={handleAdd}>RE-ORDER MY FAV</button>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card">
              <div className="card-body">
                <button onClick={handleCreate}>SURPRISE ME</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
