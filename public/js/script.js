function strCurMonth() {
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  var d = new Date();
  var n = month[d.getMonth()];
  document.getElementsByClassName ("curmonth").innerHTML = n;
}

function pDate(x){
  let d = x.getDate().padStart(2, "0");
  let m = x.getMonth()+1;
  m.padStart(2,"0");
  let y = x.getFullYear();
  const y = [day, month, year].join("/");
  return y;
}
