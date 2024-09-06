import React, { createContext, useContext, useState, useEffect } from 'react';
import {useParams } from 'react-router-dom';
import axios from 'axios';

const FavoriteContext = createContext();

export const useFavoriteContext = () => {
  return useContext(FavoriteContext);
};

export const FavoriteProvider = ({ children }) => {
  const [favoriteOrders, setFavoriteOrders] = useState([]);
  const userId = localStorage.getItem('userId');
  const { id } = useParams();

  useEffect(() => {
    const fetchFavoriteOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/order/${id}/favoriteOrders`);
        setFavoriteOrders(response.data.favoriteOrders);
      } catch (error) {
        console.error('Error fetching favorite orders', error);
      }
    };

    fetchFavoriteOrders();
  }, [userId,id]);

  return (
    <FavoriteContext.Provider value={{ favoriteOrders, setFavoriteOrders }}>
      {children}
    </FavoriteContext.Provider>
  );
};
