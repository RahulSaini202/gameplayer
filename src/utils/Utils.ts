import moment = require('moment');

export class Utils {
    static getCurrentTime(){
        return new Date().getTime();
    }
    static getHourDateTime(h:any){
        var dte = new Date();
       return  dte.setHours( dte.getHours() + h);
    }
    static getTimeFormat(){
        return  moment().format('YYYY-MM-DD hh:mm:ss');
    }
    static generateRandomNumber(){
        return Math.floor(Math.random() * 100);
    }

    static compareDate(prev, next){
        return moment(next).isAfter(prev);
    }

    static getMinute(largeDate, smallDate){
        var a = moment(largeDate);
        var b = moment(smallDate);
        return (a.diff(b, 'minutes'));
    }
}
