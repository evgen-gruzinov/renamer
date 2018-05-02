const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let infoWindow;

let need_icon = __dirname  + '/../icons/';

if (process.platform === 'win32') {
    need_icon = need_icon + 'win.ico'
} else if (process.platform === 'darwin') {
    need_icon = need_icon + 'mac.ico'
}

// Start application
app.on('ready', function () {
    mainWindow = new BrowserWindow({
        height: 675,
        width: 1000,
        icon: need_icon
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../pages/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        fs.writeFile(__dirname + "/../../temp/files.temp", '', function(err) {
            if(err) {
                return console.log(err);
            }
        });
        app.quit();
    });
    
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
});


// Create basic menu template
const mainMenuTemplate = [
    {
        label: 'App',
        submenu:[
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                // Quit app when click
                click() {
                    app.quit()
                }
            }
        ]
    }
];

// Add development block in menu if app is not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu:[
            {
                label: 'DevTool',
                accelerator: 'CmdOrCtrl+D',
                // Toggle Chrome DevTools when click
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