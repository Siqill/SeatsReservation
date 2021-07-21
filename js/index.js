"use strict";

$(function () {
    $('.seats').focus(function () {
        if ($('.tip')[0]) {
            $('.tip').remove();
        }
        if ($(this).hasClass('danger')) {
            $(this).removeClass('danger').val('');
        }

        $(this).blur(function () {
            if (+$(this).val() < 1 || Object.is(+$(this).val(), NaN)) {
                $(this).addClass('danger');
            }
            if ($(this).hasClass('danger') || +$(this).val() < 2) {
                $('.neighbor').prop('checked', false);
            }
        });
    });

    $('.neighbor').click(function (e) {
        if ($('.tip')[0]) return false;

        if ($('.seats').hasClass('danger') || +$('.seats').val() < 2) {
            let coords = e.target.getBoundingClientRect();
            $('body').append(
                $('<div>').addClass('tip').html('Jeśli chcesz wybrać tę opcję<br>zaznacz więcej niż 1 miejsce')
            );

            $('.tip').css({
                top: coords.top - $('.tip').outerHeight() / 2 + $(this).outerHeight() / 2,
                left: coords.left - $('.tip').outerWidth() - 10
            });
            return false;
        }
    });

    $(submit).click(function (e) {
        if ($('.seats').hasClass('danger') || $('.seats').val() < 1) {
            e.preventDefault();
            alert('Proszę o wpisanie dodatniej liczby miejsc do rezerwacji');
            $('.seats').focus();
        }
    });
});