import React from "react";
import { FixedSizeList as List } from "react-window";
import colors from "../../styles/colors";

// styles
const styles = {
    textAlign: 'center', 
    padding: '20px', 
    fontSize: '14px',
    fontWeight: '500',
    color: `${colors.dark_gray_text}`
}

/**
 * @param {Object} props - props object
 * @returns {string | Object} - the data that needs to be rendered.
 */
const renderData = (props) => {
    const { children, isLoading } = props;

    // if the data is loading
    if(isLoading) {
        return (() => 
            <div style={styles}> 
                loading...
            </div>
        )
    }
    // if the data is loading and children array is empty (ie no data found)
    if(!isLoading && !children.length) {
        return (() => 
            <div style={styles}> 
                No item found
            </div>
        )
    }
    // if the data is not loading and the data has been fetched
    if(!isLoading && children.length) {
        return ({ index, style }) => (
            <div style={style}>{children[index]}</div>
        )
    }
}


/**
 * Main component
 * @param {Object} props 
 * @returns - menu list component
 */
const MenuList = (props) => {
    const { options, children, maxHeight, getValue } = props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * 35;

    return (
        <List
            className="menu-list"
            height={options.length > 1 ? maxHeight : 60}
            itemCount={children.length || 1}
            itemSize={60}
            initialScrollOffset={initialOffset}
        >
            {renderData(props)}
        </List>
    );
};

export default MenuList;
