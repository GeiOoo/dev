function startTime() {
    var today = new Date(),
        h = today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds();

    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);

    $("#time").text(h+":"+m+":"+s);
    var t = setTimeout(startTime, 1000);
}

function updateDate() {
    var today = new Date(),
        d = today.getDate(),
        m = today.getMonth()+1,
        y = today.getFullYear();

    d = checkTime(d);
    m = checkTime(m);

    $("#date").text(d+"."+m+"."+y);
    var t = setTimeout(updateDate, 1000);
}

function checkTime(i) {
    (i < 10)? i = "0"+i : "";  // add zero in front of numbers < 10
    return i;
}