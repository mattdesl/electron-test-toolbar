const remote = require('electron').remote;
window.addEventListener('click', () => remote.getCurrentWebContents().focus());
console.log(remote.getCurrentWebContents());