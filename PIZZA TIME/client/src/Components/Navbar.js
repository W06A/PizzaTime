import React from 'react';
import { Link} from 'react-router-dom';
import styled from 'styled-components';
import OrderCounter from './OrderCounter';



const StyledContainerFluid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 24px;
`;

const NavbarContainer = styled.nav`
  ul {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0;
  }

  a {
    text-decoration: none;
    color: black;
    border: 1px solid black;
    padding: 10px;
    display: inline-block;
  }
`;

const SubTitle = styled.h1`
  color: black;
  font-weight: 400;
  font-size: 24px;
  font-family: 'Rajdhani', sans-serif;
  padding: 10px;
`;

const Navbar = ({ handleLogout }) => {
  const userId = localStorage.getItem('userId'); 
 

  return (
    <StyledContainerFluid>
      <SubTitle>PIZZA PETE'S</SubTitle>

      <NavbarContainer>
        <ul>
          <li>
            <Link to="/Home">HOME</Link>
          </li>
          <li>
          <Link to="/Order">ORDER <OrderCounter /></Link>
           
          </li>
          <li>
          <Link to={`/Account/${userId}`}>Account</Link>
          </li>
            
            <li>
              <Link to="/" onClick={handleLogout}>LOG OUT</Link>
            </li>
          
          
        </ul>
      </NavbarContainer>
    </StyledContainerFluid>
  );
};

export default Navbar;
