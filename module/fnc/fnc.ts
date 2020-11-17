


function getTime(type:String):String{
    if(type==='yearMonthDay'){
        return getYearMonthDay();
    }else{
        return '123'
    }

}

function getYearMonthDay():String{
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month}-${day}`;
}

module.exports = {
    getTime
}