const fs = require('fs');
const path = require('path');

const selected_files_row = document.querySelector('#selected_files');
const files_count = document.querySelector('#files_count');

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

    files_count.removeChild(files_count.firstChild);
    let data = fs.readFileSync('temp/files.temp');
    let selected_files = data.toString().split('\r\n');
    let selected_files_count = data.toString().split('\r\n').length - 1;
    let selected_files_count_node = document.createTextNode(selected_files_count);
    files_count.appendChild(selected_files_count_node);

    while (selected_files_row.firstChild) {
        selected_files_row.removeChild(selected_files_row.firstChild);
    }

    selected_files.forEach(function (element) {
        if (element !== '') {
            let file_name = JSON.parse(element).name;
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(file_name));
            selected_files_row.appendChild(li);
        }
    });
});

$('#select_form').change(function (e) {
    e.preventDefault();
    input = document.querySelector('#selector_files');
    for (let i = 0; i < input.files.length; i++) {
        selected_files = input.files[i].name + '\r\n';
        let file_json = {};
        file_json.path = input.files[i].path;
        file_json.name = input.files[i].name;
        file_json_coded = JSON.stringify(file_json) + '\r\n';
        fs.appendFile("temp/files.temp", file_json_coded, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }
    document.getElementById("selector_files").value = "";

    setTimeout( function () {
        files_count.removeChild(files_count.firstChild);
        let data = fs.readFileSync('temp/files.temp');
        let selected_files = data.toString().split('\r\n');
        let selected_files_count = data.toString().split('\r\n').length - 1;
        let selected_files_count_node = document.createTextNode(selected_files_count);
        files_count.appendChild(selected_files_count_node);

        while (selected_files_row.firstChild) {
            selected_files_row.removeChild(selected_files_row.firstChild);
        }

        selected_files.forEach(function (element) {
            if (element !== '') {
                let file_name = JSON.parse(element).name;
                let li = document.createElement('li');
                li.appendChild(document.createTextNode(file_name));
                selected_files_row.appendChild(li);
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
    while (selected_files_row.firstChild) {
        selected_files_row.removeChild(selected_files_row.firstChild);
    }
    files_count.removeChild(files_count.firstChild);
    let selected_files_count_node = document.createTextNode('0');
    files_count.appendChild(selected_files_count_node);
});
$('#rename_button').click(function (e) {
    e.preventDefault();

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
        file_new_name += path.extname(file_old_path);
        path_leight = file_old_path.length - file_old_name.length;
        let file_new_path = file_old_path.substr(0, path_leight) + file_new_name;
        fs.copyFileSync(file_old_path, file_new_path);

        if (document.getElementById("delete_source").checked) {
            fs.unlinkSync(file_old_path);
        }
    });

    fs.writeFile('temp/files.temp', '', function(err) {
        if(err) {
            return console.log(err);
        }
    });
    while (selected_files_row.firstChild) {
        selected_files_row.removeChild(selected_files_row.firstChild);
    }
    files_count.removeChild(files_count.firstChild);
    let selected_files_count_node = document.createTextNode('0');
    files_count.appendChild(selected_files_count_node);
});
