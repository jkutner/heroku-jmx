# Heroku Toolbelt Plugin for JMX

## Usage

Initialize your app (you'll need your ngrok key):

```
$ heroku jmx:init
```

Deploy your app:

```
$ git push heroku master
```

Look through your logs for this:

```
$ heroku logs -t
...
2016-06-... app[web.1]: Starting sshd for u123@172.0.0.1
```

Then use the <user>@<ip> value for this command:

```
$ heroku jmx:jconsole user123@172.0.0.1 0.tcp.ngrok.io:17152
```

JConsole will open. To use VisualVM, you'll have to set the VisualVM SOCKS proxy manually.