const fs = require('fs');
const os = require('os')

function readFiles(callback) {
    const configFiles = '/home/'+os.userInfo().username+'/.redsocksui/configFiles/';
    fs.readdir(configFiles, (err, f) => {
        if (err) {
            throw err;
        }
        var content = [];
        for (var file in f) {
            content.push(parseRedsocksConfig(f[file], fs.readFileSync(configFiles + f[file], 'utf8')));
        }
        callback(content);

    });
}

function readConfig(){
    const configDir = '/home/'+os.userInfo().username+'/.redsocksui/config.json';
    var config = ''
    if(fs.existsSync(configDir)){
        config = fs.readFileSync(configDir);
        config = JSON.parse(config);
    }
    return config;
}

function updateConfig(json){
    const configDir = '/home/'+os.userInfo().username+'/.redsocksui/config.json';
    fs.writeFileSync(configDir, JSON.stringify(json))
}

function saveFile(data, fileName) {
    const configFiles = '/home/'+os.userInfo().username+'/.redsocksui/configFiles/';
    fs.writeFileSync(configFiles + fileName, data);
}

function writeFile(file, data) {
    const section = new RegExp('(' + data.section + '(\\s|\\n)*\\{(\\n|.)*?)\\}');
    const target = new RegExp(data.target + '\\s=\\s.*?;');
    if (target.exec(file) === null) {
        return file.replace(section, '$1 ' + data.target + ' = ' + data.value + ';\n}');
    } else {
        if (data.value !== '') {
            if (data.target === 'login' || data.target === 'password') {
                return file.replace(target, data.target + ' = "' + data.value + '";');
            } else {
                return file.replace(target, data.target + ' = ' + data.value + ';');
            }
        } else {
            return file.replace(target, '');
        }
    }
}

function parseRedsocksConfig(fileName, content) {
    const user = /user\s=\s(.*)?;/.exec(content);
    const group = /group\s=\s(.*)?;/.exec(content);
    const local_ip = /local_ip\s=\s(.*)?;/.exec(content);
    const local_port = /local_port\s=\s(.*)?;/.exec(content);
    const ip = /ip\s=\s(.*)?;/.exec(content);
    const port = /port\s=\s(.*)?;/.exec(content);
    const login = /login\s=\s['"](.*?)['"];/.exec(content);
    const pass = /password\s=\s['"](.*?)['"];/.exec(content);
    const obj = {
        fileName: fileName,
        content: content,
        user: user !== null ? user[1] : null,
        group: group !== null ? group[1] : null,
        local_ip: local_ip !== null ? local_ip[1] : null,
        local_port: local_port !== null ? local_port[1] : null,
        ip: ip !== null ? ip[1] : null,
        port: port !== null ? port[1] : null,
        login: login !== null ? login[1] : null,
        password: pass !== null ? pass[1] : null
    };
    return obj;
}

module.exports = {readFiles,saveFile,writeFile,parseRedsocksConfig,readConfig, updateConfig};