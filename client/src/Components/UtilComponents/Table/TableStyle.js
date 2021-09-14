import colors from '../../../styles/colors';
import styled from 'styled-components';


const TableStyles = styled.div`
  // margin-bottom: 2rem;
  // margin-top: 2rem;
  overflow-x: auto;

  table {
    border-spacing: 0;
    border: 1px solid ${colors.white_smoke};
    width: 100%;
    font-size: clamp(12px, calc(1vw + 1px), 14px);

    th,
    td {
      color: ${colors.dark_gray_text};
      max-width: 200px;
      margin: 0;
      padding: calc(0.3vw + 0.3em);
      border-bottom: 1px solid ${colors.white_smoke};
      border-right: 1px solid ${colors.white_smoke};
      overflow-wrap: break-word;
      
      a {
        color: ${colors.blue};
        :hover {
            color: ${colors.dark_pink_highlight};
        }
      }

      // hiding the scrollbar but still able to scroll.
      ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent;
      }
      :last-child {
        border-right: 0;
      }

      @media only screen and (max-width: 1082px) { 
        max-width:100px;
      }
    }
    .center {
      text-align: center;
    }

    tr {
      :last-child {
        td {
          border-bottom: 0px solid ${colors.white_smoke};
        }
      }
      
      :hover {
          background: ${colors.pale_tint};
      }
    }
  
    th {
      font-weight: 700;
      background-color: ${colors.pale_teal};
      color: ${colors.dark_teal_heading};
      border: 1px solid white !important;
    }
  }

  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1.0rem 0;
    color: ${colors.dark_teal_heading};
    font-size: 1rem;
    
    input, select, option {
      color: ${colors.dark_teal_heading};
      border: 1px solid ${colors.white_smoke};
    }

    button {
      cursor: pointer;
      background:${colors.dark_teal_heading};
      color: white;
      border: none;
      padding: 3px 10px;
      border-radius: 5px;

      &:disabled {
        background: ${colors.white_smoke};
        color: ${colors.dark_gray_text};
      }
    }

    .next {
      margin-left: 1rem;
    }

    .prev {
      margin-right: 1rem;
    }
  }

  .top-settings {
    color: ${colors.dark_teal_heading};
    min-height: 40px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    font-size: clamp(12px, calc(1vw + 1px), 16px);
    .show-page {
      width: 30%;
      text-align: right;
      margin-right: 10px;
      select {
        border: 1px solid ${colors.white_smoke};
        color: ${colors.dark_teal_heading};
      }
    }

    .search {
      color: ${colors.dark_teal_heading};
      border: 1px solid ${colors.white_smoke};
      border-radius: 20px;
      padding: 5px 20px 5px 25px;
      width: 30%;
      margin-left: 10px;
    }

    input[type=text] {
      transition: width 0.4s ease-in-out;
    }
    
    input[type=text]:focus {
      width: 60%;
      outline: none !important;
      border: 2px solid ${colors.pale_teal};
    }

    .search-icon {
      position: absolute;
      width: 10px;
      margin-left: 20px;
      opacity: 0.8;
    }

    /*mobile*/
    @media only screen and (max-width: 1081px) { 
      input[type=text]:focus {
        width: 90%;
        outline-width: 0;
        border: 2px solid ${colors.pale_teal};
      }

      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 0;

      .search, .show-page {
        width: 90%;
        margin-bottom: 1rem;
      }

      .search-icon {
        margin-top: 5px;
      }
    }
  }
`;

export default TableStyles;
