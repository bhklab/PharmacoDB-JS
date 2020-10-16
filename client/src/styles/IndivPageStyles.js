import styled from 'styled-components';
import colors from './colors';

const StyledIndivPage = styled.div`
  .container {
    width: 100%;
    margin-top: 5vh;
    color: ${colors.dark_gray_text};
    font-size: calc(0.4vw + 9px);
    
    display:flex;
    align-items: flex-end;
    flex-direction: column;
    
    .content{
      width: calc(100% - (5vw + 4em) - 2em);
    }
  }
  .section {
    width: 100%;
    margin-bottom: 5rem;
    .text {
      margin-top: 1rem;
    }
  }
  .temp {
    height: 500px;
  }

  
  h3, h4 {
    text-align: left;
  }

  // full size container when too small
  @media only screen and (max-width: 765px) {
    .content {
      width: 100% !important;
    }
  }

  .plot {
    h4 {
      text-align: center;
      margin-top: 15px;
    }
  }
`;

const StyledSidebar = styled.div`
  width: calc(5vw + 4em);
  margin-top: 5vh;
  padding: 5px 0px;
  position:fixed;

  .link {
    display:block;
    color: ${colors.dark_teal_heading};
    border-right: 5px solid ${colors.light_blue_header};
    font-size: calc(0.5vw + 0.7em);
    font-family: 'Overpass', sans-serif;
    text-align: right;
    padding:20px 20px 20px 0px;
    transition: all 0.25s ease-out 0s;
    cursor: pointer;
  }
  .link:hover {
    color: ${colors.dark_pink_highlight};
    border-right: 5px solid ${colors.dark_pink_highlight};
    transition: all 0.25s ease-out 0s;
  }
  .selected {
    color: ${colors.dark_pink_highlight};
    border-right: 5px solid ${colors.dark_pink_highlight};
  }

  // hide sidebar when too small
  @media only screen and (max-width: 765px) {
    display:none;
  }
`;

export {
  StyledIndivPage,
  StyledSidebar,
};
