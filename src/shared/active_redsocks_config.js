import os from 'os';
import sudo from 'sudo-prompt';

const BASEPATH = '/home/' + os.userInfo().username + '/.redsocksui/';
const CONFIGS = BASEPATH + 'configFiles/';
const DEFAULT = BASEPATH + 'default.iptables.rules';



const stop = 'sudo service redsocks stop';
const setDefault = 'iptables-restore ' + DEFAULT + ' && sudo iptables -F';
const start = 'cd ' + BASEPATH + ' && sudo ./iptable-redsock && sudo service redsocks start';

export function activeRedsocks(callbackError) {
    sudo.exec(setDefault + ' && ' + stop + ' && ' + start, { name: 'Electron' },
        function (error, stdout, stderr) {
            callbackError(error);
        });
}

export function stopRedsocks(callbackError) {
    sudo.exec(setDefault + ' && ' + stop, { name: 'Electron' },
        function (error, stdout, stderr) {
            callbackError();
        });
}

export function changeRedsocksConfig(config, isActive, callbackError) {
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