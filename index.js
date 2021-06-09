"use strict";

submit.onclick = function() {
    let seats = document.getElementById('seats');
    let isNeibhor = document.getElementById('neighbor');
    localStorage.setItem('numOfSeats', seats.value);
    localStorage.setItem('isNeibhor', isNeibhor.checked);
}



