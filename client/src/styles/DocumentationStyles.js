import styled from 'styled-components';
import colors from './colors';

const StyledDocPage = styled.div`
  .heading {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${colors.dark_teal_heading};

    .title {
      color: ${colors.dark_pink_highlight};
      font-size: clamp(32px, calc(2vw + 10px), 44px);
      font-weight: bold;
      margin-left: 20%;
      white-space: normal;
      line-height: 40px;
    }
  };

  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .container {
    width: 75%;
    margin-top: 10px;
    margin-left: 25px;
    color: ${colors.dark_gray_text};
    font-size: calc(1vw + 9px);
    
    display:flex;
    align-items: flex-start;
    flex-direction: column;
    .heading {
      width: 100%;
      margin-top: 10px;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
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
      }
    };
    .section{
      width: 100%;
      margin-bottom: 50px;
      text-align: justify;
      p {
        font-size: clamp(14px, calc(1vw + 2px), 18px);
      }
      .text {
        font-size: clamp(12px, calc(1vw + 1px), 16px);
      }
      .documentation{
        p{
          margin-bottom: 20px;
        }
        .center{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          resize-mode: 'contain';
          margin-bottom: 10px;
          .small {
            width: 90%;
            max-width: 750px;
            height: auto;
            margin-top: 0px;
            margin-bottom: 25px;
            resize-mode: 'contain';
          }
          .smaller {
            width: 40%;
            max-width: 400px;
            height: auto;
            margin-top: 0px;
            margin-bottom: 25px;
            resize-mode: 'contain';
          }
          img {
            width: 100%;
            max-width: 900px;
            height: auto;
            margin-top: 0px;
            margin-bottom: 25px;
            resize-mode: 'contain';
          }
        }
        h2 {
          text-align: center;
          font-family: Raleway, sans-serif;
          font-weight: normal;
          font-size: clamp(28px, calc(1vw + 2px), 36px);
        }
        h6 {
          text-align: left;
          margin-top: 0px;
          margin-bottom: 10px;
          color: ${colors.dark_teal_heading};
          font-size: clamp(12px, calc(1vw + 2px), 15px);;
        }
        h7 {
          text-align: left;
          font-family: Raleway, sans-serif;
          font-weight: bold;
          color: ${colors.dark_teal_heading};
          line-height: 46px;
          margin-bottom: 10px;
          font-size: clamp(18px, calc(1vw + 2px), 28px);
        }
      }
    }
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
`;

/**
 * Used to reduce text size for a long individual page title.
 * Used in IndivCompounds.js to accommodate long compound names.
 */
const StyledDocPageTitle = styled.span`
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

const StyledDocSidebar = styled.div`
  width: calc(5vw + 4em);
  margin-top: 5vh;
  padding: 5px 0px;
  position:fixed;
  .link {
    display:block;
    color: ${colors.dark_teal_heading};
    border-left: 5px solid ${colors.light_blue_header};
    font-size: calc(0.5vw + 0.7em);
    font-family: 'Overpass', sans-serif;
    text-align: right;
    padding:20px 20px 20px 0px;
    transition: all 0.25s ease-out 0s;
    cursor: pointer;
  }
  .link:hover {
    color: ${colors.dark_pink_highlight};
    border-left: 5px solid ${colors.dark_pink_highlight};
    transition: all 0.25s ease-out 0s;
  }
  .selected {
    color: ${colors.dark_pink_highlight};
    border-left: 5px solid ${colors.dark_pink_highlight};
  }
  // hide sidebar when too small
  @media only screen and (max-width: 765px) {
    display:none;
  }
`;

const StyledDocSidebarList = styled.ul`
  width:18%;
  padding: 5px 0px;

  list-style-type: none;
  li {
    button {
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      text-align: left;
      padding-top: 15px;
      padding-bottom: 15px;
      padding-left: 15px;
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
      border-left: 3px solid ${colors.dark_pink_highlight};
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
        padding-left: 10px;
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
  StyledDocPage,
  StyledDocPageTitle,
  StyledDocSidebar,
  StyledDocSidebarList
};
