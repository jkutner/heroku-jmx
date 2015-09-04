# Heroku Toolbelt Plugin for JMX

The idea is this:

```
$ heroku jmx:init
# sets APP_ID (until we get dyno meta-data)
# sets JMX_PORT... or goes with default
# adds buildpack (if possible)

$ heroku jmx:jconsole web.1
# request tunnel info from ppp
# copy down .ssh/id_rsa to local
# launches socks proxy to dynoUser@tunnelHost:dynoPort
# opens jconsole with socks, and rmiHost:jmxPort
```
