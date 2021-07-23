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
      font-size: clamp(32px, calc(2vw + 10px), 44px);
      font-weight: bold;
      margin-left: 20%;
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
  StyledSidebarList
};
