import React, { useState, useEffect } from 'react';
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
        display: none;
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
        text-decoration: line-through;
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
/**
 * Custom, styled checkbox component.
 * @param {*} props 
 * @returns 
 */
const Checkbox = (props) => {
    const { value, label, checked, color, onChange, disabled } = props;
    const [isChecked, setIsChecked] = useState(checked);

    const handleOnChange = (e) => {
        setIsChecked(!isChecked);
        onChange(e);
    };

    // Auto-check/uncheck the checkbox when props.checked status is changed by external actions (dose response curve click.)
    // This applies in Tissue vs Compound page where a dose response curves that shares a cell line can be highlighted by being clicked.
    useEffect(() => {
        setIsChecked(checked);
    }, [checked])

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