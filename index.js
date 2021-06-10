"use strict";

let div;

submit.onclick = function (e) {
    // prevents submit if seats < 1 and focus on input
    if (!seats.value || seats.value < 1 || Object.is(+seats.value, NaN)) {
        e.preventDefault();
        seats.focus();
    }
    else {
        localStorage.setItem('numOfSeats', seats.value);
        localStorage.setItem('isNeibhor', neighbor.checked);
    }
}


document.body.onclick = function (e) {
    //shows a hint if there are fewer than 2 seats and prevents highlights
    if (e.target.id == 'neighbor') {
        if (seats.value < 2 && e.target.checked) {
            e.target.checked = false;
            if (div) return;
            let coords = e.target.getBoundingClientRect();
            div = document.createElement('div');
            div.className = 'tip';
            div.innerHTML = 'Jeśli chcesz wybrać tę opcję<br>zaznacz więcej niż 1 miejsce';
            document.body.append(div);
            div.style.top = coords.top - div.offsetHeight / 2 + e.target.offsetHeight / 2 + "px";
            div.style.left = coords.left - div.offsetWidth - 10 + 'px';
        }
    }
    if (Object.is(+seats.value, NaN)) neighbor.checked = false; 
}


seats.onfocus = function(e) {
    if (div) {
        div.remove();
        div = null;
    }
    
    e.target.classList.remove('danger');

    e.target.onblur = function() {
        if (e.target.value < 2 && neighbor.checked) neighbor.checked = false;

        if (e.target.value < 1 || Object.is(+e.target.value, NaN)) {
            e.target.classList.add('danger');
        }
    }
}

