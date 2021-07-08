"use strict";

let numOfSeats = +localStorage.getItem('numOfSeats');

$(function () {
    draw();
    $('body').mousedown(function () { return false; });

    $(field).mouseover(function (e) {
        if ($(e.target).hasClass('border')) {
            let coords = e.target.getBoundingClientRect();
            $('body').append(
                $('<div>').addClass('message').text(`rzad:${e.target.dataset.y}, meijsce:${e.target.dataset.x}`),
            );

            $('.message').css({
                top: coords.bottom + $('.message').outerHeight() / 2,
                left: coords.left - $('.message').outerWidth() / 2 + $(e.target).outerWidth() / 2
            });

            $(this).mouseout(function () {
                $('.message').remove();
            });
        }
    });

    $(field).click(function (e) {
        const target = e.target;
        if ($(target).hasClass('reserved')) return;
        if (!$(target).hasClass('border')) return;

        $(target).toggleClass('selection');

        let numOfSelectSeats = $('#field .selection').length;

        if (numOfSelectSeats > numOfSeats) {
            $(target).removeClass('selection');
            return;
        }
        if ($(target).hasClass('proposition')) $(target).removeClass('proposition');

        if (localStorage.getItem('isNeibhor') == 'true') {
            $('.proposition').each(function () {
                $(this).removeClass('proposition');
            });

            if (numOfSelectSeats == numOfSeats || numOfSelectSeats == 0) return;

            highlightNeighbor($('#field .selection'));
        }

    });

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

            let text = '<h2>Twoja rezerwacja przebiegła pomyślnie!</h2><br><br>Wybrałeś miejsca:<br>';
            $(seats).each(function () {
                debugger
                text += `- rząd ${$(this).attr('data-y')}, miejsce ${$(this).attr('data-x')} (${$(this).attr('id')})<br>`;
                $(this).removeClass('selection');
            })
            text += '<br><br><h3>Dziękujemy! W razie problemów prosimy o kontakt z działem administracji.</h3>';
            $('body').html(
                $('<div>').addClass('container').html(text),
            )
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
    $(field).html(out);

    request('http://localhost:3000/seats')
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
}


async function request(url, method = "GET", body = null) {
    return await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body
    });
}