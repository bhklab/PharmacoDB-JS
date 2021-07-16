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
        width: 80%;

        @media only screen and (max-width: 1081px) { 
            width: 85%;
        }
    }

    h1, h2, h3, h4 {
        color: ${colors.dark_teal_heading};
        font-family: 'Roboto Slab', serif;
        text-align: center;
    }

    h1 {
        font-size: calc(1.75vw + 1.5em);
        margin-bottom: 25px;
    }

    h2 {
        font-size: calc(1vw + 1.2em);
    }

    .new-section {
        margin-top: 3rem;
    }

    h3 {
        font-size: calc(0.6vw + 0.9em);
    }

    h4 {
        font-size: calc(0.5vw + 0.7em);
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
