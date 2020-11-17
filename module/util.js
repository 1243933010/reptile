function getIPAdress() {//获取当前的ip地址
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
} 

function getDay() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let key = new Date(`${year}-${month}-${day}`).getTime();
    return key;
}

function getSevenTime() {
    var myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - 7);
    var dateArray = [];
    var dateTemp;
    var flag = 1;
    for (var i = 0; i < 7; i++) {
        dateTemp = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate() + 1}`
        myDate.setDate(myDate.getDate() + flag);
        dateArray.push(dateTemp);
    }
    let timeArr = [];
    dateArray.forEach((val, ind) => {
        let str = new Date(val).getTime();
        timeArr.push(str)
    })
    return timeArr;
}

let typeObj = { all: getAll, completed: getCompleted, undone: getUndone };

function getList(timeArr, sqlObj, type) {
    return typeObj[type](timeArr, sqlObj);
}

function getAll(timeArr, sqlObj) {
    let arr = [];
    timeArr.forEach((val, ind) => {
        let obj = {};
        obj.time = val;
        if (!sqlObj[val]) {
            obj.num = 0;
            obj.list = [];
        } else {
            let arr = sqlObj[val].filter(val => !val.deleteStatus);
            // console.log(arr)
            obj.num = sqlObj[val].length;
            obj.list = arr
        }
        arr.push(obj);
    })
    return arr;
}
function getCompleted(timeArr, sqlObj) {
    let arr = [];
    timeArr.forEach((val, ind) => {
        let obj = {};
        obj.time = val;
        obj.num = 0
        obj.list = [];
        if (sqlObj[val]) {
            sqlObj[val].forEach((v, i) => {
                if (v.type === '1' && !v.deleteStatus) {

                    obj.time = val;

                    obj.list.push(v);
                    obj.num++;
                }
            })
        }
        arr.push(obj);
    })
    return arr;
}

function getUndone(timeArr, sqlObj) {
    let arr = [];
    timeArr.forEach((val, ind) => {
        let obj = {};
        obj.list = [];
        obj.time = val;
        obj.num = 0;
        if (sqlObj[val]) {
            sqlObj[val].forEach((v, i) => {
                if (v.type === '0' && !v.deleteStatus) {
                    obj.time = val;
                    obj.list.push(v)
                    obj.num++;
                }
            })
        }
        arr.push(obj);
    })
    return arr;
}





function quickOrder(arr) {  //数组排序
    var left = [];
    var right = [];
    if (arr.length <= 1) {
        return arr;
    }
    var first = arr.splice(0, 1);
    for (var i = 0; i < arr.length; i++) {
        if (first < arr[i]) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickOrder(left).concat(first, quickOrder(right));
}


function unique(arr){  //数组去重
    return Array.from(new Set(arr));
}


module.exports = {
    getIPAdress,
    getDay,
    getSevenTime,
    getList,
    quickOrder,
    unique
}