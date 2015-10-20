'use strict';
var child = require('child_process');
let cli = require('heroku-cli-util');

module.exports = {
  topic: 'jmx',
  command: 'init',
  description: 'Initialize an app for JMX',
  help: 'Usage: heroku jmx:init',
  args: [],
  needsApp: true,
  needsAuth: true,
  run: cli.command(function (context, heroku) {
    heroku.apps(context.app).info(function (err, app) {
      console.log('Setting JMX buildpack...')
      child.execSync('heroku buildpacks:add -i 1 https://codon-buildpacks.s3.amazonaws.com/buildpacks/jkutner/jmx.tgz -a ' + context.app)

      console.log('Setting config vars...')
      child.execSync(`heroku config:set HEROKU_PROXY_URL=\"https:\/\/${process.env.HEROKU_PROXY_AUTH}@${process.env.HEROKU_PROXY_HOST}\" -a ${context.app}`)
        child.execSync(`heroku config:set HEROKU_APP_ID=\"${app.id}\" -a ${context.app}`)

      console.log('Done.')
    })
  })
}
