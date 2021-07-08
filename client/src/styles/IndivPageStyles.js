import styled from 'styled-components';
import colors from './colors';

const StyledIndivPage = styled.div`
  .heading {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${colors.dark_teal_heading};
    .title {
      font-size: 32px;
      font-weight: bold;
      margin-left: 18%;
    }
    .attributes {
      .value {
        margin-left: 5px;
      }
      .highlight {
        color: ${colors.dark_pink_highlight};
      }
    }
  }

  .wrapper {
    width: 100%;
    display: flex;
  }

  .container {
    width: 100%;
    margin-top: 10px;
    margin-left: 20px;
    color: ${colors.dark_gray_text};
    font-size: calc(0.4vw + 9px);
    
    display:flex;
    align-items: flex-end;
    flex-direction: column;
    
    .content{
      // width: calc(100% - (5vw + 4em) - 2em);
      width: 100%;
    }
  }
  .section {
    width: 100%;
    margin-bottom: 50px;
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      color: ${colors.dark_teal_heading};
    }
    .text {
      font-size: 12px;
    }
  }
  .temp {
    height: 500px;
  }
  
  h3, h4 {
    text-align: left;
    font-family: Raleway, sans-serif;
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

const StyledSidebarList = styled.ul`
  width: 20%;
  padding: 5px 0px;

  list-style-type: none;
  li {
    button {
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      text-align: right;
      padding-top: 15px;
      padding-bottom: 15px;
      padding-right: 20px;
      color: ${colors.dark_teal_heading};
      font-size: 14px;
      font-family: Raleway, sans-serif;
      // letter-spacing: 1px;
    }
    button:hover {
      color: ${colors.dark_pink_highlight};
    }
  }

  .selected {
    button {
      color: ${colors.dark_pink_highlight};
      border-right: 3px solid ${colors.dark_pink_highlight};
    }
  }

  // hide sidebar when too small
  @media only screen and (max-width: 765px) {
    display:none;
}
`;

export {
  StyledIndivPage,
  StyledSidebar,
  StyledSidebarList
};
