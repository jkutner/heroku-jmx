# Heroku CLI Plugin for JMX

Uses [ngrok](https://ngrok.com) to tunnel a JMX connection into a dyno.

```
$ heroku plugins:install heroku-jmx
```

![JMX Demo](demo.gif)

## Usage

Initialize your app (you'll need your [ngrok](https://ngrok.com) auth token):

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
2016-06...app[web.1]: Start JConsole: heroku jmx:jconsole u26027@172.17.103.234 0.tcp.ngrok.io:13379
```

Then run that command:

```
$ heroku jmx:jconsole u26027@172.17.103.234 0.tcp.ngrok.io:13379
```

JConsole will open and information that it is an insecure connection (but it's actually secured via SSH).

To use VisualVM, leave the `jmx:jconsole` command running. Then set the VisualVM SOCKS proxy manually to `localhost:1080`.