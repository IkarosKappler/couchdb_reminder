/**
 * @author  Ikaros Kappler
 * @date    2014-12-24
 * @version 1.0.0
 **/ 

/**
 * This function creates a human-readable date/time string.
 * Format: YYYY-MM-DD_H.i.s
 **/
function createHumanReadableTimestamp() {

    // Append the current date to the output filename values
    var curDate = new Date();
    var year    = curDate.getFullYear();
    var month   = curDate.getMonth() + 1;  // months start at 0
    var day     = curDate.getDate();
    var hours   = curDate.getHours();
    var minutes = curDate.getMinutes();
    var seconds = curDate.getSeconds();

    if( month < 10 )   month   = "0" + month;
    if( day < 10 )     day     = "0" + day;
    if( hours < 10 )   hours   = "0" + hours;
    if( minutes < 10 ) minutes = "0" + minutes;
    if( seconds < 10 ) seconds = "0" + seconds;

    var ts        = "" +
	year +
	"-" +
	month +
	"-" +
	day +
	"_" +
	hours +
	"." +
	minutes +
	"." +
	seconds
	;

    return ts;
}