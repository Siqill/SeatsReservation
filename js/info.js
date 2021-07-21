'use strict';

import {request} from './export.js'

for (let seat of getInfo(location.href)) {
    request('http://localhost:3000/seats/' + seat)
    .then(res => res.json())
    .then(res => {
        $('.seats').append(
            $('<span>').text(`- rząd: ${res.cords.x}, miejsce: ${res.cords.y}, id: ${res.id}`)
        );
    });
}

function getInfo(str) {
    return str.split('?').pop().split('&');
}