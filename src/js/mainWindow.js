const electron = require('electron');
const url = require('url');
const fs = require('fs');
const path = require('path');

const BrowserWindow = electron.remote.BrowserWindow;

const randomize_num = [
    '1','2','3','4','5',
    '6','7','8','9','0'
];
const randomize_letters_uppercase = [
    'A','B','C','D','E','F',
    'G','H','I','J','K','L',
    'M','N','O','P','R','S',
    'T','U','V','X','Y','Z'
];
const randomize_letters_lowcase = [
    'a','b','c','d','e','f',
    'g','h','i','j','k','l',
    'm','n','o','p','r','s',
    't','u','v','x','y','z'
];
const randomize_symbols = [
    '~','@','$','(',')','`',
    '{','}','#','%','^','-','_'
];


// Starter function
$(document).ready(function () {

    if (!fs.existsSync('temp')) {
        fs.mkdir('temp', function(err) {
            if(err) {
                return console.log(err);
            }
        });
        fs.writeFile("temp/files.temp", '', function(err) {
            if(err) {
                return console.log(err);
            }
        });
        setTimeout(function () {
        }, 1000);
    }

    let data = fs.readFileSync('temp/files.temp');
    let selected_files = data.toString().split('\r\n');
    let selected_files_count = data.toString().split('\r\n').length - 1;
    if (selected_files_count > 0) {
        $('#files_selector_form').children('label').text(selected_files_count + ' files selected');
    }

    $('#files_list > table > tbody').html('<tr><td class="table_old_name informer">Old file name</td><td class="table_new_name informer">New file name</td></tr>');

    selected_files.forEach(function (element) {
        if (element !== '') {
            let file_old_name = JSON.parse(element).name;
            let file_new_name = JSON.parse(element).new_name;
            $('#files_list > table > tbody:last-child').append('<tr class="file_row">' + '<td class="table_old_name">' + file_old_name + ' </td>' + '<td class="table_new_name">' + file_new_name + ' </td>' + '</tr>');
        }
    });
});

$('#files_selector_form').change(function (e) {
    e.preventDefault();
    input = document.querySelector('#selector_files');
    let need_file_length = $('#symbols_count').val();
    for (let n = 0; n < input.files.length; n++) {

        selected_files = input.files[n].name + '\r\n';
        file_json = {};
        file_json.path = input.files[n].path;
        file_json.name = input.files[n].name;

        let Uncial = true;

        let data = fs.readFileSync('temp/files.temp');
        let selected_list_files = data.toString().split('\r\n');
        selected_list_files.forEach(function (element) {
            if (element !== '') {
                let existing_obj = JSON.parse(element);
                let existing = existing_obj.path;
                if (file_json.path === existing) {
                    Uncial = false;
                }
            }
        });

        if (Uncial) {
            let symbols_array = [];
            if (document.getElementById("checkbox_uppercase_letters").checked) {
                symbols_array = symbols_array.concat(randomize_letters_uppercase);
            }
            if (document.getElementById("checkbox_lowcase_letters").checked) {
                symbols_array = symbols_array.concat(randomize_letters_lowcase);
            }
            if (document.getElementById("checkbox_numbers").checked) {
                symbols_array = symbols_array.concat(randomize_num);
            }
            if (document.getElementById("checkbox_symbols").checked) {
                symbols_array = symbols_array.concat(randomize_symbols);
            }
            symbols_count = symbols_array.length;
            let file_new_name = '';
            for (i = 1; i <= need_file_length; i++) {
                symbol_int = Math.floor(Math.random() * (symbols_count));
                file_new_name += symbols_array[symbol_int];
            }

            let file_ext = path.extname(file_json.path).toLowerCase();
            if (file_ext.substr(1) === 'jpeg') {
                file_ext = '.jpg';
            }
            file_json.ext = file_ext.substr(1);
            file_new_name += file_ext;

            file_json.new_name = file_new_name;
            file_json_coded = JSON.stringify(file_json) + '\r\n';
            fs.appendFile("temp/files.temp", file_json_coded, function(err) {
                if(err) {
                    return console.log(err);
                }
            });
        }
    }
    document.getElementById("selector_files").value = "";

    setTimeout( function () {
        let data = fs.readFileSync('temp/files.temp');
        let selected_files = data.toString().split('\r\n');
        let selected_files_count = data.toString().split('\r\n').length - 1;
        if (selected_files_count > 0) {
            $('#files_selector_form').children('label').text(selected_files_count + ' files selected');
        }

        //$('#files_list > table > tbody').empty();
        $('#files_list > table > tbody').html('<tr><td class="table_old_name informer">Old file name</td><td class="table_new_name informer">New file name</td></tr>');

        selected_files.forEach(function (element) {
            if (element !== '') {
                let file_old_name = JSON.parse(element).name;
                let file_new_name = JSON.parse(element).new_name;
                $('#files_list > table > tbody:last-child').append('<tr class="file_row">' + '<td class="table_old_name">' + file_old_name + ' </td>' + '<td class="table_new_name">' + file_new_name + ' </td>' + '</tr>');
            }
        });
    } ,100);
});
$('#selected_files_clear').click(function (e) {
    e.preventDefault();
    fs.writeFile('temp/files.temp', '', function(err) {
        if(err) {
            return console.log(err);
        }
    });
    $('#files_list > table > tbody').html('<tr><td class="table_old_name informer">Old file name</td><td class="table_new_name informer">New file name</td></tr>');
    $('#files_selector_form').children('label').text('Select files');
});
$('#rename_settings').change(function() {
    $('#files_list > table > tbody').html('<tr><td class="table_old_name informer">Old file name</td><td class="table_new_name informer">New file name</td></tr>');

    let data = fs.readFileSync('temp/files.temp');
    let selected_files = data.toString().split('\r\n');
    fs.writeFile('temp/files.temp', '', function(err) {
        if(err) {
            return console.log(err);
        }
    });
    selected_files.forEach(function (element) {
        if (element !== '') {
            file_json = JSON.parse(element);

            let need_file_length = $('#symbols_count').val();
            let symbols_array = [];
            if (document.getElementById("checkbox_uppercase_letters").checked) {
                symbols_array = symbols_array.concat(randomize_letters_uppercase);
            }
            if (document.getElementById("checkbox_lowcase_letters").checked) {
                symbols_array = symbols_array.concat(randomize_letters_lowcase);
            }
            if (document.getElementById("checkbox_numbers").checked) {
                symbols_array = symbols_array.concat(randomize_num);
            }
            if (document.getElementById("checkbox_symbols").checked) {
                symbols_array = symbols_array.concat(randomize_symbols);
            }
            symbols_count = symbols_array.length;
            let file_new_name = '';
            for (i = 1; i <= need_file_length; i++) {
                symbol_int = Math.floor(Math.random() * (symbols_count));
                file_new_name += symbols_array[symbol_int];
            }
            file_new_name += '.' + file_json.ext;
            file_json.new_name = file_new_name;
            file_json_coded = JSON.stringify(file_json) + '\r\n';
            fs.appendFile("temp/files.temp", file_json_coded, function(err) {
                if(err) {
                    return console.log(err);
                }
            });

            let file_old_name = JSON.parse(element).name;
            $('#files_list > table > tbody:last-child').append('<tr class="file_row">' + '<td class="table_old_name">' + file_old_name + ' </td>' + '<td class="table_new_name">' + file_new_name + ' </td>' + '</tr>');
        }
    });
});


$('#rename_button').click(function (e) {
    e.preventDefault();

    let processWindow = new BrowserWindow({
        height: 150,
        width: 400,
        frame: false,
        resizable: false,
        center: true
    });
    processWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../pages/processWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    let need_file_length = document.querySelector('#symbols_count').value;
    const data = fs.readFileSync('temp/files.temp');

    let selected_files = data.toString().split('\r\n');
    selected_files.forEach(function (value) {
        if (value === '') {
            return;
        }
        let decoded_string = JSON.parse(value);
        let file_old_name = decoded_string.name;
        let file_old_path = decoded_string.path;
        let file_ext = decoded_string.ext;
        let file_new_name = decoded_string.new_name;
        path_leight = file_old_path.length - file_old_name.length;
        let file_new_path = file_old_path.substr(0, path_leight);
        if (document.getElementById("ext_sorting").checked) {
            file_new_path += file_ext + "\\";
        }

        if (!fs.existsSync(file_new_path)) {
            fs.mkdirSync(file_new_path)
        }

        file_new_path += file_new_name;

        if (document.getElementById("saveOriginal").checked) {
            fs.copyFileSync(file_old_path, file_new_path);
        } else {
            fs.renameSync(file_old_path, file_new_path);
        }
    });

    fs.writeFile('temp/files.temp', '', function(err) {
        if(err) {
            return console.log(err);
        }
    });
    $('#files_list > table > tbody').html('<tr><td class="table_old_name informer">Old file name</td><td class="table_new_name informer">New file name</td></tr>');
    $('#files_selector_form').children('label').text('Select files');

    processWindow.close();
});
