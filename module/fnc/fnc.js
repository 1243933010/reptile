"use strict";
function getTime(type) {
    if (type === 'yearMonthDay') {
        return getYearMonthDay();
    }
    else {
        return '123';
    }
}
function getYearMonthDay() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "-" + month + "-" + day;
}
module.exports = {
    getTime: getTime
};
