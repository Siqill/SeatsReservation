"use strict";


let request;
let seats = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];


{
    draw();

    //prevents selection
    document.querySelector('.container').onmousedown = function () { return false; };

    field.onmouseover = function (e) {
        if (!e.target.classList.contains('border')) return;
        let message;
        message = document.createElement('div');
        message.className = 'message';
        message.innerText = `rzad:${e.target.dataset.y}, meijsce:${e.target.dataset.x}`;
        document.body.append(message);
        let coords = e.target.getBoundingClientRect();
        message.style.top = coords.bottom + message.offsetHeight / 2 + "px";
        message.style.left = coords.left + e.target.offsetWidth / 2 - message.offsetWidth / 2 + 'px';

        field.onmouseout = function () {
            if (message) message.remove();
        };
    };

    field.onclick = function (e) {
        if (!e.target.classList.contains('border')) return;
        if (e.target.classList.contains('reserved')) return;

        // does not allow you to select more seats than you marked early
        if (field.querySelectorAll('.selection').length == localStorage.getItem('numOfSeats')) {
            e.target.classList.remove('selection');
            return;
        }

        e.target.classList.toggle('selection');
        if (localStorage.getItem('isNeibhor') == 'true') getNeighbor(e.target);
    };


    reserve.onclick = function () {
        let seats = field.querySelectorAll('.selection');
        if (!seats.length) return;
        let div = document.createElement('div');
        div.className = 'container';
        div.innerHTML = '<h2>Twoja rezerwacja przebiegła pomyślnie!</h2><br><br>Wybrałeś miejsca:<br>';
        for (let seat of seats) {
            div.innerHTML += `- rząd ${seat.dataset.y}, miejsce ${seat.dataset.x} (${seat.id})<br>`;
            seat.classList.add('reserved');
            seat.classList.remove('selection');
        }
        div.innerHTML += '<br><br><h3>Dziękujemy! W razie problemów prosimy o kontakt z działem administracji.</h3>';
        document.body.innerHTML = "";
        document.body.append(div);

    };
}

// Błąd w db.json dlatego tak maluje miejsca
function draw() {
    let out = '';
    for (let i = 0; i < seats.length; i++) {
        let arr = seats[i];
        for (let j = 0; j < arr.length; j++) {
            out += `<div class="field-block" data-x="${j}" data-y="${i}"></div>`;
        }
        out += '<br>';
    }
    document.querySelector('#field').innerHTML = out;

    getRequest();

    request.onload = function () {
        let data = JSON.parse(request.response);
        for (let seat of data) {
            let x = seat.cords.x;
            let y = seat.cords.y;
            for (let node of document.querySelectorAll('.field-block')) {
                if (node.dataset.x == y && node.dataset.y == x) {
                    node.id = seat.id;
                    node.classList.add('border');
                    if (seat.reserved)
                        node.classList.add('reserved');
                }

            }
        }
    }









}

function getRequest() {
    request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:3000/seats');
    request.send();
}

function getNeighbor(elem) {
    let x = +elem.dataset.x;
    let y = +elem.dataset.y;
    let next = field.querySelector(`.border[data-x="${x + 1}"][data-y="${y}"]`);
    let previous = field.querySelector(`.border[data-x="${x - 1}"][data-y="${y}"]`);
    if (next && !next.classList.contains('reserved')) {
        next.classList.toggle('proposition');
    }
    if (previous && !previous.classList.contains('reserved')) {
        previous.classList.toggle('proposition');
    }

}

