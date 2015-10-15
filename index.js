'use strict';
exports.topic = {
  name: 'jmx',
  description: 'Connect to a Java process with JMX'
};

exports.commands = [
  require('./commands/jconsole.js'),
  require('./commands/init.js')
];
