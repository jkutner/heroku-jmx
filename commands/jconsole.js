'use strict';
let cli = require('heroku-cli-util');
var https = require('https')
var fs = require('fs')
var socks = require('socksv5'),
    Client = require('ssh2').Client;

module.exports = {
  topic: 'ports',
  command: 'open',
  description: 'snagglepuss',
  help: 'Usage: heroku jmx:jconsole [dyno]:[port]',
  args: [ {name: 'dyno_port'} ],
  needsApp: true,
  needsAuth: true,
  run: cli.command(function (context, heroku) {
    heroku.apps(context.app).info(function (err, app) {
      if (err) { throw err; }
      var dyno = context.args.dyno_port.split(':')[0]
      var port = context.args.dyno_port.split(':')[1]
      var path = `/reservation?id=${app.id}&dyno=${dyno}&port=${port}`
      console.log('PATH: ' + path)
      var req = https.request({
        host: 'mighty-ridge-8684.herokuapp.com',
        auth: 'heroku:snagglepuss',
        path: path,
        method: 'GET'
      }, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            //body = JSON.parse(body);
            console.log(body)

            // TODO download the key

            var tunnelUserAndHost = body.split(':')[0]
            var tunnelUser = body.split('@')[0]
            var tunnelHost = body.split(':')[0]
            var tunnelPort = body.split(':')[1]

            console.log('HOST: ' + tunnelHost)
            console.log('PORT: ' + tunnelPort)
            socksv5({
              host: tunnelHost,
              port: tunnelPort,
              username: tunnelUser,
              privateKey: fs.readFileSync('/Users/jkutner/.ssh/heroku_id_rsa')
            })
        })
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
      req.end();
    });
  })
};

function socksv5(ssh_config) {
  socks.createServer(function(info, accept, deny) {
    // NOTE: you could just use one ssh2 client connection for all forwards, but
    // you could run into server-imposed limits if you have too many forwards open
    // at any given time
    var conn = new Client();
    conn.on('ready', function() {
      conn.forwardOut(info.srcAddr,
                      info.srcPort,
                      info.dstAddr,
                      info.dstPort,
                      function(err, stream) {
        if (err) {
          conn.end();
          return deny();
        }

        var clientSocket;
        if (clientSocket = accept(true)) {
          stream.pipe(clientSocket).pipe(stream).on('close', function() {
            conn.end();
          });
        } else
          conn.end();
      });
    }).on('error', function(err) {
      deny();
    }).connect(ssh_config);
  }).listen(1080, 'localhost', function() {
    console.log('SOCKSv5 proxy server started on port 1080');
  }).useAuth(socks.auth.None());
}
