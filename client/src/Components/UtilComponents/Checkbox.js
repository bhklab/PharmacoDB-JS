import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledCheckbox = styled.label`
    display: flex;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .custom-checkbox {
        width: 15px;
        height: 15px;
        border-radius: 2px;
        background-color: transparent;
        border: 2px solid ${props => props.color ? props.color : colors.dark_gray_text};
    }
    .custom-checkbox:after {
        content: "";
        display: none;
    }

    input:checked ~ .custom-checkbox {
        background-color: ${props => props.color ? props.color : colors.dark_gray_text};
    }
    input:checked ~ .custom-checkbox:after {
        display: block;
    }
    input:disabled ~ .custom-checkbox {
        opacity: 0.5; 
    }
    input:disabled ~ .label {
        opacity: 0.5;
    }

    .custom-checkbox:after {
        margin-left: 3px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    .label {
        margin-left: 5px;
        color: ${props => props.color ? props.color : colors.dark_gray_text};
        font-weight: bold;
    }
`;

const Checkbox = (props) => {
    const { value, label, checked, color, onChange, disabled } = props;
    const [isChecked, setIsChecked] = useState(checked);

    const handleOnChange = (e) => {
        setIsChecked(!isChecked);
        onChange(e);
    };

    return(
        <StyledCheckbox color={color}>
            <input type="checkbox" value={value} checked={isChecked} disabled={disabled} onChange={handleOnChange} />
            <span className='custom-checkbox'></span>
            <span className='label'>{label}</span>
        </StyledCheckbox>
    );
}

Checkbox.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
}

export default Checkbox;