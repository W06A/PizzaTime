import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../index.css';
import Swal from 'sweetalert2';
import axios from 'axios';



const Styleddiv = styled.div`
  padding:70px 20px;
  align-items: center;
  margin-bottom: 15px;
  
`;

const SubTitle= styled.h1`
color:black;
font-weight:900 px;
font-size:24px;
font-family:'Rajdhani', sans-serif;

padding: 10px;
`;

const StyledFormGroup = styled.div`
  display:flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: space-between;
  
`;
const StyledLabel1 = styled.label`
display:flex;
padding-right: 10px;
text-align: center;
  
`;
const StyledLabel = styled.label`
display:flex;
padding-right: 10px;
text-align: center;

  
`;
const StyledInput = styled.input`
  display:flex;
  border: 2px solid black;
  border-radius: 5px;
  padding: 10px;
  width:100%;
  margin-left:50px;
`;
const StyledInput1 = styled.input`
  display:flex;
  border: 2px solid black;
  border-radius: 5px;
  padding: 10px;
  width:80%;
`;
const Styledselect = styled.select`
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  width:300px;
`;
 

const RegisterButton = styled.button`
  
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  width:90%;
  margin-left:100px;
  margin-bottom: 10px;
  
`;



const StyledLinkItem = styled.li`
  margin-right: 20px;
  list-style: none;
  padding:10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;
const StyledRow=styled.div`
display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
`
;

const StyledContainerFluid = styled.div`
    
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom:30px;
`;
const Container=styled.div`

width: 80%;

margin:0 auto;

`
;



const UserRegisterForm = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setSelectedState] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const navigate=useNavigate();
   
    const handleRegister = async (e) => {
      e.preventDefault();
      if (password !== confirm) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Passwords do not match',
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:8000/api/user/register', {
          firstName:firstname,
          lastName:lastname,
          email: email,
          address:address,
          city:city,
          state:state,
          password: password,
          
        });
        console.log('Response:', response); 
        if (response.status === 200) {
          localStorage.setItem('userId', response.data._id);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registration successful',
            showConfirmButton: false,
            timer: 1500,
          });
          
          navigate(`/login`);
          
         
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'An error occurred during registration',
            showConfirmButton: false,
            timer: 1500,
          });
          
        }
      } catch (error) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'An error occurred',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };
    const selectedState = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    return (
      <Styleddiv>
           <StyledContainerFluid>
            <SubTitle>PIZZA PETE'S</SubTitle>
            
             <StyledLinkItem>
              <Link to="/login "> Already Have an Account?Login</Link>
              </StyledLinkItem>
              </StyledContainerFluid>  
            
         <Container>
            <StyledRow className="row">
        <div className="col-md-6">
          <StyledFormGroup>
            <StyledLabel1 htmlFor="firstname">First Name</StyledLabel1>
            <StyledInput1
              type="text"
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </StyledFormGroup>
        </div>
        <div className="col-md-6">
          <StyledFormGroup>
            <StyledLabel1 htmlFor="lastname">Last Name</StyledLabel1>
            <StyledInput1
              type="text"
              name="lastname"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
            />
          </StyledFormGroup>
        </div>
      </StyledRow>
             
      <div className="col-md-12">
            <StyledFormGroup>
            <StyledLabel htmlFor="email">Email</StyledLabel>
              <StyledInput
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              </StyledFormGroup>
            </div>
            <div className="col-md-12">
            <StyledFormGroup>
            <StyledLabel htmlFor="address">Address</StyledLabel>
              <StyledInput
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              </StyledFormGroup>
            </div>
            <StyledRow className="row">
            <div className="col-md-9">
                <StyledFormGroup>
                  < StyledLabel htmlFor="city">City</StyledLabel>
                  <StyledInput
                    type="text"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  </StyledFormGroup>
                 </div>
                 <div className="col-md-3">
                <StyledFormGroup>
                  <StyledLabel htmlFor="state">State</StyledLabel>  
                  <Styledselect
                   id="state"
                  name="state"
                  value={state}
                  onChange={(e) => setSelectedState(e.target.value)}
                  >
                   <option value="">ALL</option>
                        {selectedState.map((state, index) => (
                            <option key={index} value={state}>
                              {state}
                          </option>
                      ))}
                  </Styledselect>
                  </StyledFormGroup>
              </div>  
            </StyledRow>
            <div className="col-md-12">
            <StyledFormGroup>
            <StyledLabel htmlFor="password">Password</StyledLabel>
              <StyledInput
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              </StyledFormGroup>
            </div>
            <div className="col-md-12">
            <StyledFormGroup>
            <StyledLabel htmlFor="confirm">Confirm</StyledLabel>
              <StyledInput
                type="password"
                name="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              </StyledFormGroup>
              </div>
             <RegisterButton onClick={handleRegister} className="btn btn-success">
              Sign Up
            </RegisterButton>
            </Container>
             </Styleddiv>
             
             

    );
  }




export default UserRegisterForm;
