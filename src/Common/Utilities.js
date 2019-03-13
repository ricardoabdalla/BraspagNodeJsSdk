
module.exports = {
    isEmpty: (val) => {
    let typeOfVal = typeof val;
    switch(typeOfVal){
        case 'object':
            return (val.length == 0) || !Object.keys(val).length;
            break;
        case 'string':
            let str = val.trim();
            return str == '' || str == undefined;
            break;
        case 'number':
            return val == '';
            break;
        default:
            return val == '' || val == undefined;
}}};