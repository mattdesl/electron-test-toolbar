const path = require('path');
const url = require('url');
const { app, BrowserView, BrowserWindow } = require('electron');
app.commandLine.appendSwitch('disable-http-cache');
app.commandLine.appendSwitch('v', 0);
app.commandLine.appendSwitch('vmodule', 'console=0');

let win;
let view;
function start () {
  const isHighSierra = process.platform === 'darwin' && Number(require('os').release().split('.')[0]) >= 17;
  win = new BrowserWindow({
    titleBarStyle: isHighSierra ? null : 'hiddenInset',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  const updateViewBounds = () => {
    const { width, height } = win.getContentBounds();
    view.setBounds({ x: 0, y: 40, width, height });
  };
  view = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  });
  win.setBrowserView(view);
  win.on('resize', () => updateViewBounds());
  win.on('blur', () => {
    console.log('blur');
  });
  win.on('focus', () => {
    console.log('focus');
  });
  updateViewBounds();

  if (process.platform === 'darwin') {
    win.setSheetOffset(40);
  }

  view.webContents.loadURL(url.format({
    pathname: path.join(__dirname, 'test.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'welcome.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.webContents.openDevTools({ mode: 'detach' });
  win.once('ready-to-show', () => win.show());
}

app.once('ready', () => {
  start();
});
app.on('window-all-closed', () => {
  app.quit();
});
