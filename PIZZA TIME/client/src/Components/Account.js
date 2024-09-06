import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Title = styled.h2`
  color: black;
  text-align: center;
  padding: 10px;
`;

const StyledFormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: space-between;
`;

const StyledLabel = styled.label`
  display: flex;
  padding-right: 10px;
  text-align: center;
`;

const StyledInput = styled.input`
  display: flex;
  border: 2px solid black;
  border-radius: 5px;
  padding: 10px;
  width: 80%;
`;

const StyledSelect = styled.select`
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  width: 300px;
`;

const UpdateButton = styled.button`
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 5px;
  width: 50%;
  display: block;
  margin-bottom: 10px;
`;

const StyledOrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  height: 150px;
  margin-bottom: 15px;
  margin-left: 70px;
  padding: 10px;
`;

const StyledDiv = styled.div`
  align-items: center;
  justify-content: space-between;
  width: 80%;
  height: 150px;
  margin-bottom: 15px;
  margin-left: 70px;
  padding: 10px;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
`;

const AccountPage = () => {
  const [selectedState, setSelectedState] = useState('');
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: ''
  });
  const [order, setOrder] = useState([]);
  const [checkedFavorites, setCheckedFavorites] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchOrder = async () => {
      try {
        const orderResponse = await axios.get('http://localhost:8000/api/order/all');
        const ordersData = orderResponse.data;
        if (ordersData && ordersData.orders && ordersData.orders.length > 0) {
          setOrder(ordersData.orders);
          setCheckedFavorites(ordersData.orders.map(order => order.isFavorite || false));
          const totalPrice = ordersData.orders.reduce((acc, orderItem) => {
            return acc + (orderItem.totalPrice ? orderItem.totalPrice : 0);
          }, 0);
          setTotalPrice(totalPrice);
        } else {
          setTotalPrice(0);
        }
      } catch (error) {
        console.error('Error fetching order details', error);
      }
    };

    fetchUser();
    fetchOrder();
  }, [userId]);

  const handleCheckboxChange = async (index, orderId) => {
    const newCheckedFavorites = [...checkedFavorites];
    newCheckedFavorites[index] = !newCheckedFavorites[index];
    setCheckedFavorites(newCheckedFavorites);
  
    try {
      await axios.put('http://localhost:8000/api/order/updateFavoriteStatus', {
        orderId: orderId,
        isFavorite: newCheckedFavorites[index]
      });
    } catch (error) {
      console.error('Error updating favorite status', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/api/user/${userId}/update`, user);
      alert('User information updated successfully');
      navigate("/Home"); // Navigate to homepage after successful update
    } catch (error) {
      console.error('Error updating user information', error);
    }
  };

  const statesList = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  return (
    <div>
      <Navbar />
      <div className="container2 mt-5">
        <div className="row">
          <div className="col-md-6">
            <Title>Account Info</Title>
            <div className="col-md-12">
              <StyledFormGroup>
                <StyledLabel htmlFor="firstname">First Name</StyledLabel>
                <StyledInput type="text" name="firstname" value={user?.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
              </StyledFormGroup>
            </div>
            <div className="col-md-12">
              <StyledFormGroup>
                <StyledLabel htmlFor="lastname">Last Name</StyledLabel>
                <StyledInput type="text" name="lastname" value={user?.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
              </StyledFormGroup>
            </div>
            <div className="col-md-12">
              <StyledFormGroup>
                <StyledLabel htmlFor="email">Email</StyledLabel>
                <StyledInput type="email" name="email" value={user?.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </StyledFormGroup>
            </div>
            <div className="col-md-12">
              <StyledFormGroup>
                <StyledLabel htmlFor="address">Address</StyledLabel>
                <StyledInput type="text" name="address" value={user?.address} onChange={(e) => setUser({ ...user, address: e.target.value })} />
              </StyledFormGroup>
            </div>
            <StyledRow className="row">
              <div className="col-md-9">
                <StyledFormGroup>
                  <StyledLabel htmlFor="city">City</StyledLabel>
                  <StyledInput type="text" name="city" value={user?.city} onChange={(e) => setUser({ ...user, city: e.target.value })} />
                </StyledFormGroup>
              </div>
              <div className="col-md-3">
                <StyledFormGroup>
                  <StyledLabel htmlFor="state">State</StyledLabel>
                  <StyledSelect
                    id="state"
                    name="state"
                    value={user?.state}
                    onChange={(e) => setUser({ ...user, state: e.target.value })}
                  >
                    <option value="">ALL</option>
                    {statesList.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </StyledSelect>
                </StyledFormGroup>
              </div>
            </StyledRow>
          </div>

          <div className="col-md-6">
            <Title>Past Orders</Title>
            {order && order.length > 0 ? (
  order.map((orderItem, orderItemIndex) => (
    <StyledDiv key={orderItem._id}>
      <StyledOrderHeader>
        <p>{new Date(orderItem.createdAt).toLocaleDateString()}</p>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`favoriteCheckbox${orderItemIndex}`}
            checked={checkedFavorites[orderItemIndex] || false}
            onChange={() => handleCheckboxChange(orderItemIndex, orderItem._id)}
          />
          <label className="form-check-label" htmlFor={`favoriteCheckbox${orderItemIndex}`}>
            Favorite
          </label>
        </div>
      </StyledOrderHeader>
      <div className="order-details">
        <p>
          {orderItem.size}-{orderItem.toppings.map(t => t.name).join(', ')} ${orderItem.totalPrice}
        </p>
      </div>
      <hr />
    </StyledDiv>
  ))
) : null}
          </div>
        </div>
      </div>
      <div className="text-center">
        <UpdateButton onClick={handleUpdate}>UPDATE</UpdateButton>
      </div>
    </div>
  );
};

export default AccountPage;
