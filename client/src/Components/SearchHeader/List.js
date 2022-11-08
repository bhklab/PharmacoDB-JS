import React from "react";
import { FixedSizeList as List } from "react-window";
import styled from 'styled-components';
import colors from '../../styles/colors';

// styling the list.
const StyledList = styled.div`
    div {
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 5px;
        padding-right: 5px;
        color: ${colors.dark_gray_text};
        font-weight: 400;
        font-size: 1em;
        :hover {
            background: colors.light_blue_bg;
        }
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }
`;

const MenuList = (props) => {
    const { options, children, maxHeight, getValue } = props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * 35;

    return (
        <StyledList>
            <List
                className="List"
                height={maxHeight}
                itemCount={children.length}
                itemSize={60}
                initialScrollOffset={initialOffset}
            >
                {
                    ({ index, style }) => (
                        <div style={style}>{children[index]}</div>
                    )
                }
            </List>
        </StyledList>
    );
};

export default MenuList;
