import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useOrderContext } from './OrderContext';
import ToppingsData from '../toppingData';

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

const StyledSelect = styled.select`
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  width: 150px;
`;

const StyledSelect1 = styled.select`
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  width: 100%;
`;

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 15px;
`;

const AddButton = styled.button`
  background-color: white; 
  color: black;
  border: 2px solid black;
  border-radius: 5px;
  width: 80%;
  margin: 0 auto;
  display: block;
  margin-bottom: 10px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px solid black;
  width: 80%;
  height: 150px;
  margin-bottom: 15px;
  margin-left: 70px;
  padding: 10px;
`;

const OrderPage = () => {
  const { updateOrderCount } = useOrderContext();
  const [method, setMethod] = useState('');
  const [size, setSize] = useState('');
  const [crust, setCrust] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState([]);
  const navigate = useNavigate();

  const selectedOptions = {
    method: ['','Delivery', 'Carry Out', 'Dine In', 'Canceled'],
    size: ['','Small', 'Medium', 'Large'],
    crust: ['','Thin Crust', 'Thick Crust', 'Stuffed Crust', 'Crispy Crust'],
    quantity: ['','1', '2', '3'],
    toppings: ToppingsData.map(topping => topping.name),
  };

  const handleCheckboxChange = (topping) => {
    setToppings((prevToppings) => {
      if (prevToppings.includes(topping)) {
        return prevToppings.filter((selected) => selected !== topping);
      } else {
        return [...prevToppings, topping];
      }
    });
  };

  const handleCreate = async () => {
    const orderData = {
      method,
      size,
      crust,
      quantity,
      toppings,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/order/create', orderData);
      const newOrder = response.data.order;
      const newCount = response.data.count;
      updateOrderCount(newCount);
      navigate(`/order/${newOrder._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Title>CRAFT-A-PIZZA</Title>
      <StyledFormGroup>
        <StyledLabel htmlFor="method">Method</StyledLabel>
        <StyledSelect1
          id="method"
          name="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {selectedOptions.method.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </StyledSelect1>
      </StyledFormGroup>

      <StyledRow>
        <div className="col-md-4">
          <StyledFormGroup>
            <StyledLabel htmlFor="size">SIZE</StyledLabel>
            <StyledSelect
              id="size"
              name="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {selectedOptions.size.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
          </StyledFormGroup>
        </div>

        <div className="col-md-6">
          <StyledFormGroup>
            <StyledLabel htmlFor="crust">CRUST</StyledLabel>
            <StyledSelect
              id="crust"
              name="crust"
              value={crust}
              onChange={(e) => setCrust(e.target.value)}
            >
              {selectedOptions.crust.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
          </StyledFormGroup>
        </div>

        <div className="col-md-2">
          <StyledFormGroup>
            <StyledLabel htmlFor="quantity">QTY</StyledLabel>
            <StyledSelect
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {selectedOptions.quantity.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
          </StyledFormGroup>
        </div>
      </StyledRow>

      <div>
        <h6>Toppings</h6>
        <StyledDiv>
          {ToppingsData.map((topping, index) => (
            <div key={index} style={{ marginBottom: '10px', marginRight: '10px' }}>
              <input
                type="checkbox"
                id={topping.name}
                name={topping.name}
                checked={toppings.includes(topping.name)}
                onChange={() => handleCheckboxChange(topping.name)}
              />
              <label htmlFor={topping.name}>{topping.name}</label>
            </div>
          ))}
        </StyledDiv>
      </div>

      <AddButton onClick={handleCreate}>Add To Order</AddButton>
    </div>
  );
};

export default OrderPage;
