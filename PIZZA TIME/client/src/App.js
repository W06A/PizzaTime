import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import UserRegisterForm from './Components/register';
import LoginForm from './Components/login';
import DashboardPage from './Components/Home';
import AccountPage from './Components/Account';
import OrderPage from './Components/order';
import Detailpage from './Components/detail';
import { OrderProvider } from './Components/OrderContext';
import { FavoriteProvider } from './Components/FavoriteContext';
import Navbar from './Components/Navbar';
import Checkout from './Components/checkout';
import SuccessPage from './Components/Success';
import GoogleMapComponent from './Components/GoogleMapComponent';


const stripePromise = loadStripe('pk_test_oKhSR5nslBRnBZpjO6KuzZeX');

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirmedAddress, setConfirmedAddress] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };
  const handleAddressConfirm = (address) => {
    setConfirmedAddress(address);
    console.log('Confirmed Address:', address);
  };

  return (
    <BrowserRouter>
    
      <OrderProvider>
        <FavoriteProvider>
          <Elements stripe={stripePromise}>
            <div>
              {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
              <Routes>
                <Route path="/" element={<UserRegisterForm />} />
                <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/Home" element={<DashboardPage />} />
                <Route path="/Account/:userId" element={<AccountPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/order/:id" element={<Detailpage />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/map" element={<GoogleMapComponent onAddressConfirm={handleAddressConfirm} />} />
             
              {confirmedAddress && (
                <div>
                  <h2>Confirmed Address:</h2>
                  <p>Latitude: {confirmedAddress.lat}</p>
                  <p>Longitude: {confirmedAddress.lng}</p>
                </div>
              )}
              </Routes>
            </div>
          </Elements>
        </FavoriteProvider>
      </OrderProvider>
      
    </BrowserRouter>
  );
}

export default App;
