const path = require('path');

const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
app.commandLine.appendSwitch('disable-http-cache');
app.commandLine.appendSwitch('v', 0);
app.commandLine.appendSwitch('vmodule', 'console=0');

// Disable security warnings for now
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

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

  view.webContents.loadFile(path.resolve(__dirname, 'test.html'));
  win.loadFile(path.resolve(__dirname, 'welcome.html'));
  win.webContents.openDevTools({ mode: 'detach' });
  win.once('ready-to-show', () => win.show());
};

app.once('ready', () => {
  start();
});
app.on('window-all-closed', () => {
  app.quit();
});