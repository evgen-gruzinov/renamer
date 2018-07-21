const fs = require('fs');
const path = require('path');

$(document).ready(function () {
    let data = fs.readFileSync('temp/files.temp');
    let selected_files = data.toString().split('\r\n');
    let selected_files_count = data.toString().split('\r\n').length - 1;

    $('#files_left').html(selected_files_count + ' files left');
});