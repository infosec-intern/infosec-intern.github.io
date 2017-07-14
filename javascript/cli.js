/*
    This script contains functions for emulating terminal behavior on this website
*/
function changeDirectory(destination) {
    // mimic the 'cd' command
}

function listDirectory(destination) {
    // mimic the 'ls' command
}

function showManual(command) {
    // mimic the 'man' command
}

// https://stackoverflow.com/questions/16006583/capturing-ctrlz-key-combination-in-javascript
document.onkeyup = function(e) {
    // ensure event is not null
    e = e || window.event
    console.log(JSON.stringify(e))
}