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

document.onkeyup = function(evt) {
    var eventObj = window.event? event : evt
    console.log(JSON.stringify(eventObj))
}