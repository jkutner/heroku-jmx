'use strict';

var child = require('child_process');
let cli = require('heroku-cli-util');
let co = require('co');

module.exports = {
  topic: 'jmx',
  command: 'init',
  description: 'Initialize an app for JMX',
  help: 'Usage: heroku jmx:init',
  args: [],
  needsApp: true,
  needsAuth: true,
  run: cli.command(co.wrap(run))
}

function * run(context, heroku) {
  var ngrokKey = yield cli.prompt('ngrok auth token', {hide: true})

  let buildpacks = yield heroku.request({
    path: `/apps/${context.app}/buildpack-installations`,
    headers: {Range: ''}
  });

  if (buildpacks.length === 0) {
    cli.log(`${context.app} has no Buildpack URL set. You must deploy your application first!`);
  } else {
    heroku.apps(context.app).info(function (err, app) {
      var jmxBuildpack = "https://github.com/jkutner/heroku-buildpack-jmx"
      var firstBuildpack = buildpacks[0]['buildpack']['url']

      if (firstBuildpack != jmxBuildpack) {
        console.log('Setting JMX buildpack...')
        child.execSync(`heroku buildpacks:add -i 1 ${jmxBuildpack} -a ${context.app}`)
      }

      console.log('Setting config vars...')
      child.execSync(`heroku config:set NGROK_API_TOKEN=\"${ngrokKey}\" -a ${context.app}`)
      child.execSync(`heroku config:set JMX_ENABLED=\"true\" -a ${context.app}`)

      console.log('')
      console.log('Run `heroku logs` to find the "JConsole Command". Then run that command.')
    })
  }
}
