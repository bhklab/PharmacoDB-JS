import React from "react";
import { FixedSizeList as List } from "react-window";


const MenuList = (props) => {
    const { options, children, maxHeight, getValue } = props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * 35;

    console.log(children, children.length);

    return (
        <List
            className="List"
            height={maxHeight}
            itemCount={1000}
            itemSize={70}
            initialScrollOffset={initialOffset}
        >
            {
                ({ index, style }) => (
                    <div style={style}>{children[index]}</div>
                )
            }
        </List>
    );
};

export default MenuList;
