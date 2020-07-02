import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../../images/pharmacodb-logo-dark.png';
import colors from '../../styles/colors';

const StyledNavbar = styled.div`
    position:absolute;
    width:100%;
    padding-top:40px;

    display:flex;
    justify-content: center;
    
    .container {
        width:70%;
        display:flex;
        justify-content:space-between;
        align-items: center;
    }

    .logo {
        width:200px;
    }
`;

const StyledLinks = styled.div`
    width:30%;
    display:flex;
    justify-content: space-between;
    align-items:center;

    a {
        color: ${colors.light_blue_header};
        font-family: 'Rubik', sans-serif;
        font-weight: 400;
        font-size: calc(0.4vw + 0.9em);
        letter-spacing:0.5px;
    }
`;

const Navbar = () => {
    const temp = "";
    return (
        <StyledNavbar>
            <div className="container">
                <img className="logo" src={logo}/>
                <StyledLinks>
                    <Link to="/">About</Link>
                    <Link to="/">Tools</Link>
                    <Link to="/">Datatypes</Link>
                </StyledLinks>
            </div>
        </StyledNavbar>
    );
};


export default Navbar;