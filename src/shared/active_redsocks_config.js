const os = require('os');
const sudo = require('sudo-prompt');
const { exec } = require('child_process')

const BASEPATH = '/home/' + os.userInfo().username + '/.redsocksui/';
const CONFIGS = BASEPATH + 'configFiles/';
const DEFAULT = BASEPATH + 'default.iptables.rules';



const stop = 'echo Profeazul1!|sudo -S service redsocks stop';
const setDefault = 'iptables-restore ' + DEFAULT + ' && echo Profeazul1!|sudo -S iptables -F';
const start = 'cd ' + BASEPATH + ' && echo Profeazul1!|sudo -S ./iptable-redsock && echo Profeazul1!|sudo -S service redsocks start';

function activeRedsocks(callbackError) {
    exec(setDefault + ' && ' + stop + ' && ' + start, { name: 'Electron' },
        function (error, stdout, stderr) {
            callbackError(error);
        });
    // sudo.exec(setDefault + ' && ' + stop + ' && ' + start, { name: 'Electron' },
    //     function (error, stdout, stderr) {
    //         callbackError(error);
    //     });
}

function stopRedsocks(callbackError) {
    sudo.exec(setDefault + ' && ' + stop, { name: 'Electron' },
        function (error, stdout, stderr) {
            callbackError();
        });
}

function changeRedsocksConfig(config, isActive, callbackError) {
    const setConfig = ' sudo cp ' + CONFIGS + config + ' /etc/redsocks.conf';
    if (isActive) {
        sudo.exec(setConfig + setDefault + ' && ' + stop + ' && ' + start, { name: 'Electron' },
            function (error, stdout, stderr) {
                callbackError(error);
            });
    } else {
        sudo.exec(setConfig, { name: 'Electron' },
            function (error, stdout, stderr) {
                callbackError(error);
            });
    }

}

module.exports = { activeRedsocks, stopRedsocks, changeRedsocksConfig };