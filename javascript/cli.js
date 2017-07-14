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
var current_combo = []
document.onkeypress = function(e) {
    // ensure event is not null
    e = e || window.event
    console.log(e.which)
    switch (e.wich) {
        case 99:        // 'c'
            if (current_combo == []) {
                current_combo.concat('c')
            }
            break
        case 100:       // 'd'
            if (current_combo == ['c']) {
                current_combo.concat('d')
                console.log('command complete: cd')
            }
            break
        case 108:       // 'l'
            if (current_combo == []) {
                current_combo.concat('l')
            }
            break
        case 115:       // 's'
            if (current_combo == ['l']) {
                current_combo.concat('s')
                console.log('command complete: ls')
            }
            break
        case 109:       // 'm'
            if (current_combo == []) {
                current_combo.concat('m')
            }
            break
        case 97:        // 'a'
            if (current_combo == ['m']) {
                current_combo.concat('a')
            }
            break
        case 110:       // 'n'
            if (current_combo == ['m', 'a']) {
                current_combo.concat('n')
                console.log('command complete: man')
            }
            break
        default:
            console.log('value not in command' + e.which)
            break
    }
    // c+d = 99 + 100
    // <space> = 32
    // l+s = 108 + 115
    // m+a+n = 109 + 97 + 110
}