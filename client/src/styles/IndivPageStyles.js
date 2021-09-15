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
      color: ${colors.dark_pink_highlight};
      font-size: clamp(32px, calc(2vw + 10px), 44px);
      font-weight: bold;
      margin-left: 20%;
      margin-top: 20px;
      margin-bottom: 20px;
      white-space: normal;
      line-height: 40px;
      .link {
        color: ${colors.dark_teal_heading};
      }
    }

    .attributes {
      min-width: 200px;
      margin-left: 10px;
      .value {
        margin-left: 5px;
      }
      .highlight {
        color: ${colors.dark_pink_highlight};
      }
    }

  };

  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .container {
    width: 100%;
    margin-top: 10px;
    margin-left: 25px;
    color: ${colors.dark_gray_text};
    font-size: calc(1vw + 9px);
    
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
    text-align: justify;
    .section-title {
      font-size: clamp(18px, calc(1vw + 3px), 28px);
      font-weight: bold;
      margin-bottom: 10px;
      color: ${colors.dark_teal_heading};
    }
    p {
      font-size: clamp(14px, calc(1vw + 2px), 18px);
    }
    .download-button {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 5px;
    }
    .text {
      font-size: clamp(12px, calc(1vw + 1px), 16px);
    }
  }
  .temp {
    height: 500px;
  }
  
  h3, h4 {
    text-align: left;
    font-family: Raleway, sans-serif;
  }

  h6 {
    text-align: left;
    margin-top: 15px;
    margin-bottom: 5px;
    color: ${colors.silver};
    font-size: clamp(12px, calc(1vw + 2px), 15px);;
  }
  
  img {
    margin-top: 25px;
    margin-bottom: 25px;
    align-items: center;
  }

  // full size container when too small
  @media only screen and (max-width: 765px) {
    .heading {
      .title {
        margin-left: 0px;
      }
    }
    .container {
      margin-left: 0px;
    }
    .wrapper {
      flex-direction: column;
    }
    .content {
      width: 100% !important;
    }
  }

  .plot {
    h4, h5 {
      text-align: center;
      margin-top: 15px;
      color: ${colors.dark_teal_heading};
      font-size: clamp(14px, calc(1vw + 2px), 18px);
    }
  }
`;

/**
 * Used to reduce text size for a long individual page title.
 * Used in IndivCompounds.js to accommodate long compound names.
 */
const StyledIndivPageTitle = styled.span`
  color: ${colors.dark_pink_highlight};
  font-size: ${props => props.smalltxt ? `clamp(14px, calc(1vw + 10px), 20px)` : 'clamp(32px, calc(2vw + 10px), 44px)'};
  font-weight: bold;
  margin-left: 20%;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  white-space: normal;
  line-height: 40px;
  @media only screen and (max-width: 765px) {
    margin-left: 0px;
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
  width: 25%;
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
      padding-right: 15px;
      color: ${colors.dark_teal_heading};
      font-size: clamp(12px, calc(1vw + 2px), 16px);
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
    width: 100%;
    li {
      display: inline-block;
      button {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 10px;
      }
    }
    .selected {
      button {
        border: none;
      }
    }
}
`;

export {
  StyledIndivPage,
  StyledIndivPageTitle,
  StyledSidebar,
  StyledSidebarList
};
