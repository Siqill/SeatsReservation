"use strict";

import {request} from './export.js'

let numOfSeats = +getInfo(location.href).seats;
let neighborChecked = getInfo(location.href).neighbor;


$(function () {
    draw();

    $('body').mousedown(function () { return false; });

    $(reserve).click(function () {
        let seats = $('#field .selection');
        if (!seats.length) {
            alert('Proszę wybrać mejsce');
            return;
        }
        else {
            if (seats.length != numOfSeats) {
                let text = `Chciales kupic ${numOfSeats} bilety, ale zaznaczyles tylko ${seats.length}, contynujemy?`;
                if (!confirm(text)) return;
            }
        
            let text = '?';
            $(seats).each(function () {
                text += this.id + '&';
            });
            text = text.substr(0, text.length - 1);
            updateData(seats);
            
            location.href = 'http://127.0.0.1:8080/info.html' + text;
        }
    });

});

// --------------------------------------

function highlightNeighbor(seats) {
    $(seats).each(function () {
        let x = $(this).attr('data-x');
        let y = $(this).attr('data-y');

        let next = $(`.border[data-x="${+x + 1}"][data-y="${y}"]`);
        let previous = $(`.border[data-x="${+x - 1}"][data-y="${y}"]`);

        if (next) {
            if (!$(next).hasClass('reserved') && !$(next).hasClass('selection'))
                $(next).addClass('proposition')
        }

        if (previous) {
            if (!$(previous).hasClass('reserved') && !$(previous).hasClass('selection'))
                $(previous).addClass('proposition')
        }
    });
}

async function draw() {
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
    $(field).html(out);

    await request('http://localhost:3000/seats')
        .then(response => response.json())
        .then(response => {
            $(response).each(function () {
                let x = $(this)[0].cords.x;
                let y = $(this)[0].cords.y;
                let square = $(`.field-block[data-x="${y}"][data-y="${x}"]`);
                if (square) {
                    $(square).addClass('border').attr('id', $(this)[0].id);
                    if ($(this)[0].reserved)
                        $(square).addClass('reserved');
                }

            });
        })
        .catch(() => {
            $('body').html('Bad connevtion with server');
        });

    $('#field .border').each(function () {
        $(this).hover(function (e) {
            let coords = e.target.getBoundingClientRect();
            $('body').append(
                $('<div>').addClass('message').text(`rzad:${e.target.dataset.y}, meijsce:${e.target.dataset.x}`),
            );

            $('.message').css({
                top: coords.bottom + $('.message').outerHeight() / 2,
                left: coords.left - $('.message').outerWidth() / 2 + $(e.target).outerWidth() / 2
            });
        }, function () {
            $('.message').remove();
        }
        );
    })
        .click(function (e) {
            const target = e.target;
            if ($(target).hasClass('reserved')) return;

            $(target).toggleClass('selection');

            let numOfSelectSeats = $('#field .selection').length;

            if (numOfSelectSeats > numOfSeats) {
                $(target).removeClass('selection');
                return;
            }
            if ($(target).hasClass('proposition')) $(target).removeClass('proposition');

            if (neighborChecked == 'on') {
                $('.proposition').each(function () {
                    $(this).removeClass('proposition');
                });

                if (numOfSelectSeats == numOfSeats || numOfSelectSeats == 0) return;

                highlightNeighbor($('#field .selection'));
            }
        });
}

function getInfo(str) {
    let arr = str.split('?').pop().split('&');
    return {
        "seats": arr[0].split('=').pop(),
        "neighbor": arr[1] ? arr[1].split('=').pop() : "",
    }
}

function updateData(seats) {
    for (let seat of seats) {
        request('http://localhost:3000/seats/' + seat.id, 'put', JSON.stringify({
            "id": seat.id,
            "cords": {
                "x": +seat.dataset.y,
                "y": +seat.dataset.x
            },
            "reserved": true
        }));
    }
}