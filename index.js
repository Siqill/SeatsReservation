"use strict";

let div;

submit.onclick = function (e) {
    if (seats.classList.contains('danger')) {
        e.preventDefault();
        alert('Błąd! Proszę o wpisanie dodatniej liczby miejsc do rezerwacji');
        seats.focus();
    }
    else {
        localStorage.setItem('numOfSeats', seats.value);
        localStorage.setItem('isNeibhor', neighbor.checked);
    }
}


neighbor.onclick = function(e) {
    if (seats.value < 2) {
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

seats.onfocus = function(e) {
    if (div) {
        div.remove();
        div = null;
    }
    e.target.classList.remove('danger');
    e.target.onblur = function() {
        if (e.target.value < 1 || Object.is(+e.target.value, NaN)) 
            e.target.classList.add('danger');
        if (e.target.classList.contains('danger') || e.target.value < 2) 
            neighbor.checked = false;
    }
}

