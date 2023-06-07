const Rcon = require('rcon');
require('dotenv').config();

const host = process.env.host_ip; // ARKサーバーのIPアドレス
const port = process.env.host_port; // RCONポート番号
const password = process.env.password; //Rconパスワード

var conn = new Rcon(host, port, password, { encoding: 'utf8' });

process.stdin.resume();
process.stdin.setEncoding('utf8');

conn.on('auth', function() {
    console.log("サーバーコンソールへの接続完了");
    console.log("")
});

conn.on('response', function(str) {
    console.log(str);
});

conn.on('error', function(err) {
    if (err.message.startsWith("connect ECONNREFUSED")){
        console.log("再接続中...");
        conn.connect();
        return;
    }
    console.log("Error: " + err);
});

conn.on('end', function() {
    console.log("サーバーコンソールから切断されました");
    process.exit();
});

conn.connect();

process.stdin.on('data', function (input) {
    if (input.trim() === 'exit') {
        process.exit();
    }
    conn.send(input.trim());
});