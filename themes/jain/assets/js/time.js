// Time ago
function getNewTime(value) {
    var d = new Date(value);
    var now = new Date();
    var seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    var minutes = Math.round(Math.abs(seconds / 60));
    var hours = Math.round(Math.abs(minutes / 60));
    var days = Math.round(Math.abs(hours / 24));
    var months = Math.round(Math.abs(days / 30.416));
    var years = Math.round(Math.abs(days / 365));
    if (seconds <= 45) {
        return 'a few seconds ago';
    } else if (seconds <= 90) {
        return 'a minute ago';
    } else if (minutes <= 45) {
        return minutes + ' minutes ago';
    } else if (minutes <= 90) {
        return 'an hour ago';
    } else if (hours <= 22) {
        return hours + ' hours ago';
    } else if (hours <= 36) {
        return 'a day ago';
    } else if (days <= 25) {
        return days + ' days ago';
    } else if (days <= 45) {
        return 'a month ago';
    } else if (days <= 345) {
        return months + ' months ago';
    } else if (days <= 545) {
        return 'a year ago';
    } else { // (days > 545)
        return years + ' years ago';
    }
}

Array.from(document.getElementsByTagName('time')).forEach((x) => {
    if (x.className === 'now') {
        x.innerText = new Date().getFullYear();
    } else {
        x.innerText = getNewTime(x.getAttribute('datetime'));
    }
});
