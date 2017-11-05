// This file is required by the prefernces.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const {ipcRenderer} = require('electron')

document.getElementById('launch-btn').addEventListener('click', function (e) {
  ipcRenderer.send('set-website', {
    url: document.getElementById('url-input').value,
    type: document.getElementById('select-type').value
  })
});