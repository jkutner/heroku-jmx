# Heroku Toolbelt Plugin for JMX

The idea is this:

```
$ heroku jmx:jconsole web.1
# request tunnel info from ppp
# copy down .ssh/id_rsa to local
# launches socks proxy to dynoUser@tunnelHost:dynoPort
# opens jconsole with socks, and dynoIp:jmxPort
```
