/**
 * Returns the parsed js object with RowDataPacket object as the input.
 * @param {object} rowdatapacket 
 */
const transformObject = (rowdatapacket) => JSON.parse(JSON.stringify(rowdatapacket));


module.exports = {
    transformObject
};