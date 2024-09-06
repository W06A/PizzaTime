import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Payment Successful</h1>
      <p>Thank you for your order!</p>
      <Link to="/Home" style={{ textDecoration: 'none', color: 'white' }}>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer'
        }}>
          Go to Home
        </button>
      </Link>
    </div>
  );
};

export default SuccessPage;
