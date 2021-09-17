import React from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import colors from '../../styles/colors';

const CustomSwitchContainer = styled.span`
    display: flex;
    alight-items: center;
    .label {
        font-size: 12px;
    }
    .highlight {
        font-weight: bold;
        color: ${colors.dark_pink_highlight};
    }
`;

const StyledCustomSwitch = styled(Switch)`
    margin-left: 5px;
    margin-right: 5px;
`;

/**
 * A styled switch component to be used for toggle UI.
 */
const CustomSwitch = (props) => {
    const { checked, onChange, labelLeft, labelRight, height, width } = props;
    return(
        <CustomSwitchContainer>
            {
                labelLeft && labelLeft.length > 0 ?
                <span className={`label ${!checked ? 'highlight' : ''}`}>{labelLeft}</span>
                : ''
            }
            <StyledCustomSwitch 
                checked={checked}
                onChange={onChange} 
                onColor={colors.dark_teal_heading}
                onHandleColor={colors.light_teal}
                uncheckedIcon={false}
                checkedIcon={false}
                height={height ? height : 20}
                width={width ? width : 40}
            />
            {
                labelRight && labelRight.length > 0 ?
                <span className={`label ${checked ? 'highlight' : ''}`}>{labelRight}</span>
                : ''
            }
        </CustomSwitchContainer>
    );
};

export default CustomSwitch;