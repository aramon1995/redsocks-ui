const os = require('os');
const sudo = require('sudo-prompt');
const { exec } = require('child_process')
const fs = require('fs')

const BASEPATH = '/home/' + os.userInfo().username + '/.redsocksui/';
const CONFIGS = BASEPATH + 'configFiles/';
const DEFAULT = BASEPATH + 'default.iptables.rules';



const stop = 'sudo service redsocks stop';
const setDefault = 'iptables-restore ' + DEFAULT + ' && sudo iptables -F';
const start = 'cd ' + BASEPATH + ' && sudo ./iptable-redsock && sudo service redsocks start';

function activeRedsocks(password, callbackError) {
    if (password === '') {
        sudo.exec(setDefault + ' && ' + stop + ' && ' + start, { name: 'Electron' },
        function (error, stdout, stderr) {
            callbackError(error);
        });
    } else {
        exec('echo "' + password + '"|sudo -S ' + setDefault + ' && ' + stop + ' && ' + start, { name: 'Electron' },
            function (error, stdout, stderr) {
                callbackError(error);
            });
        }
}

function stopRedsocks(password, callbackError) {
    if (password === '') {
        sudo.exec(setDefault + ' && ' + stop, { name: 'Electron' },
        function (error, stdout, stderr) {
                callbackError(error);
            });
    } else {
        exec('echo "' + password + '"|sudo -S ' + setDefault + ' && ' + stop, { name: 'Electron' },
            function (error, stdout, stderr) {
                callbackError(error);
            });
        }
}

function changeRedsocksConfig(config, isActive, password, callbackError) {
    const setConfig = 'sudo cp ' + CONFIGS + config + ' /etc/redsocks.conf';
    if (isActive) {
        if (password === '') {
            sudo.exec(setDefault + ' && ' + stop + ' && ' + setConfig + ' && ' + start, { name: 'Electron' },
                function (error, stdout, stderr) {
                    callbackError(error);
                });
        } else {
            exec('echo "' + password + '"|sudo -S ' + stop + ' && ' + setConfig + ' && ' + start, { name: 'Electron' },
            function (error, stdout, stderr) {
                    callbackError(error);
                });
            }
    } else {
        if (password === '') {
            sudo.exec(setConfig, { name: 'Electron' },
                function (error, stdout, stderr) {
                    callbackError(error);
                });
        } else {
            exec('echo "' + password + '"|sudo -S cp ' + CONFIGS + config + ' /etc/redsocks.conf', { name: 'Electron' },
            function (error, stdout, stderr) {
                callbackError(error);
                });
        }
    }

}

function runOnStart(setRun, password, callbackError) {
    if (setRun) {
        if (password === '') {
            sudo.exec('sudo cp ' + BASEPATH + 'scripts/redsocks-ui.sh /etc/profile.d/redsocks-ui.sh', { name: 'Electron' },
                function (error, stdout, stderr) {
                    callbackError(error);
                });
        } else {
            exec('echo "' + password + '"|sudo -S cp ' + BASEPATH + 'scripts/redsocks-ui.sh /etc/profile.d/redsocks-ui.sh', { name: 'Electron' },
            function (error, stdout, stderr) {
                    callbackError(error);
                });
        }
    } else {
        if (fs.existsSync('/etc/profile.d/redsocks-ui.sh')) {
            if (password === '') {
                sudo.exec('sudo rm /etc/profile.d/redsocks-ui.sh', { name: 'Electron' },
                    function (error, stdout, stderr) {
                        callbackError(error);
                    });
            }else{
                exec('echo "'+ password +'"|sudo -S rm /etc/profile.d/redsocks-ui.sh', { name: 'Electron' },
                function (error, stdout, stderr) {
                    callbackError(error);
                });
            }
        }

    }
}

module.exports = { activeRedsocks, stopRedsocks, changeRedsocksConfig, runOnStart };