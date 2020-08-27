import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from './colors';

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 85%;

    & > * {
        width: 70%;

        @media only screen and (max-width: 1081px) { 
            width: 85%;
        }
    }

    h1, h2, h3 {
        color: ${colors.dark_teal_heading};
        font-family: 'Roboto Slab', serif;
        text-align: center;
    }

    h1 {
        font-size: calc(2vw + 1.5em);
    }

    h2 {
        font-size: calc(1vw + 1.2em);
        margin-top: 2rem;
    }

    h3 {
        font-size: calc(0.5vw + 0.8em);
        margin-top: 2rem;
    }
`;

StyledWrapper.propTypes = {
  individual: PropTypes.bool,
  summary: PropTypes.bool,
};
StyledWrapper.defaultProps = {
  /**
 * important for searchheader blur
 */
  className: 'page',
};

export default StyledWrapper;
