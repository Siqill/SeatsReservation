"use strict";

let div;

submit.onclick = function (e) {
    // prevents submit if seats < 1 and focus on input
    if (!seats.value) {
        e.preventDefault();
        seats.focus();
    }
    else {
        localStorage.setItem('numOfSeats', seats.value);
        localStorage.setItem('isNeibhor', neighbor.checked);
    }
}

//shows a hint if there are fewer than 2 seats and prevents highlight
neighbor.onclick = function (e) {
    if (seats.value < 2 && e.target.checked) {
        e.target.checked = false;
        let coords = e.target.getBoundingClientRect();
        div = document.createElement('div');
        div.className = 'tip';
        div.innerHTML = 'Wybierz więcej <br> niż 1 miejsce';
        document.body.append(div);
        div.style.top = coords.top - div.offsetHeight / 2 + e.target.offsetHeight / 2 + "px";
        div.style.left = coords.left - div.offsetWidth - 10 + 'px';
    }
}

document.body.onclick = function (e) {
    if (e.target.id != 'neighbor' && div) div.remove();
}


