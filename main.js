"use strict";

let numOfSeats = +localStorage.getItem('numOfSeats');

{
    draw();

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

        e.target.onmouseout = function () {
            message.remove();
        };
    };

    field.onclick = function (e) {
        let target = e.target;
        if (!target.classList.contains('border')) return;
        if (target.classList.contains('reserved')) return;

        target.classList.toggle('selection');
        let selectSeats = field.querySelectorAll('.selection');
        let numOfSelectSeats = selectSeats.length;


        if (numOfSelectSeats > numOfSeats) {
            target.classList.remove('selection');
            return;
        }


        if (target.classList.contains('proposition')) target.classList.remove('proposition');

        if (localStorage.getItem('isNeibhor') == 'true') {

            field.querySelectorAll('.proposition').forEach(node => {
                node.classList.remove('proposition');
            });

            if (numOfSelectSeats == numOfSeats || numOfSelectSeats == 0)
                return;

            highlightNeighbor(selectSeats);
        }

    };

    reserve.onclick = function () {
        let seats = field.querySelectorAll('.selection');

        if (!seats.length) {
            alert('Proszę wybrać mejsce');
            return;
        }
        else {
            if (seats.length != numOfSeats) {
                let text = `Chciales kupic ${numOfSeats} bilety, ale zaznaczyles tylko ${seats.length}, contynujemy?`;
                if (!confirm(text)) return;
            }
            let div = document.createElement('div');
            div.className = 'container';
            div.innerHTML = '<h2>Twoja rezerwacja przebiegła pomyślnie!</h2><br><br>Wybrałeś miejsca:<br>';
            for (let seat of seats) {
                div.innerHTML += `- rząd ${seat.dataset.y}, miejsce ${seat.dataset.x} (${seat.id})<br>`;
                seat.classList.remove('selection');
            }
            div.innerHTML += '<br><br><h3>Dziękujemy! W razie problemów prosimy o kontakt z działem administracji.</h3>';
            document.body.innerHTML = "";
            document.body.append(div);
            
            // updateDate('http://127.0.0.1:3000/seats', seats);
        }
    };

}


function highlightNeighbor(seats) {
    for (let seat of seats) {
        let x = +seat.dataset.x;
        let y = +seat.dataset.y;
        let next = field.querySelector(`.border[data-x="${x + 1}"][data-y="${y}"]`);
        let previous = field.querySelector(`.border[data-x="${x - 1}"][data-y="${y}"]`);

        if (next) {
            if (!next.classList.contains('reserved') && !next.classList.contains('selection'))
                next.classList.add('proposition');
        }

        if (previous) {
            if (!previous.classList.contains('reserved') && !previous.classList.contains('selection'))
                previous.classList.add('proposition');
        }

    }

}

function draw() {
    let seats = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    let out = '';
    for (let i = 0; i < seats.length; i++) {
        let arr = seats[i];
        for (let j = 0; j < arr.length; j++) {
            out += `<div class="field-block" data-x="${j}" data-y="${i}"></div>`;
        }
        out += '<br>';
    }
    document.querySelector('#field').innerHTML = out;


    fetch('http://localhost:3000/seats')
        .then(response => response.json())
        .then(response => {
            for (let seat of response) {
                let x = seat.cords.x;
                let y = seat.cords.y;
                let square = document.querySelector(`.field-block[data-x="${y}"][data-y="${x}"]`);
                if (square) {
                    square.id = seat.id;
                    square.classList.add('border');
                    if (seat.reserved)
                        square.classList.add('reserved');
                }
            }
        })
        .catch(() => {
            document.body.innerHTML = 'Bad connevtion with server';
        })

}

// async function updateDate(url, seats) {
//     let data;
//     await fetch(url)
//     .then(res => res.json())
//     .then(res => {
//         for (let seat of seats) {
//         console.log(seat)
//         let x = +seat.dataset.x;
//         let y = +seat.dataset.y;
//         res.find(value => value.cords.x == y && value.cords.y == x).reserved == true;
//         }
//         data = res;
//     })
//     .catch(err => alert(err))

//     await fetch(url, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data),
//     })
// }