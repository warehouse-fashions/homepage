"use strict";

$(document).ready(function(){
    $('#top-banner-container .read-more').click(function(){
        event.preventDefault();
        $(this).hide().parent().find('span').show();
    })
});
