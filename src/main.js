const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let helpWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        resizable: false,
        height: 675,
        width: 1000
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/pages/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        fs.writeFile(__dirname + "/temp/files.temp", '', function(err) {
            if(err) {
                return console.log(err);
            }
        });
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
});

function openHelp() {
    helpWindow = new BrowserWindow({
        resizable: false,
        width:600,
        height:750
    });
    helpWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/pages/helpWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
}

const mainMenuTemplate = [
    {
        label: 'App',
        submenu:[
            {
                label: 'Check updates'
            },
            {
                label: 'Help',
                click: function () {
                    openHelp()
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: function () {
                    app.quit()
                }
            }
        ]
    }
];

if (process.env.NODEJS_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu:[
            {
                label: 'DevTool',
                accelerator: 'CmdOrCtrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]

    })
}