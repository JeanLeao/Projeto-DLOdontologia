
const {app, BrowserWindow} = require('electron')
const io = require('socket.io-client');
 
const socket = io('http://localhost:8080/');
//const path = require('path')
let mainWindow = null;

function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  mainWindow.loadFile('./telas/qr.html')
  // Open the DevTools.
  mainWindow.webContents.openDevTools(); 
}
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin'){
    socket.emit("fechando", "fechando");
    app.quit()
  } 
    
})

