sigfox-mqtt-bridge
==================

Sigfox MQTT bridge is a simple bridge between the Sigfox backend and MQTT subscribers

The callback for the device type must be configured in the Sigfox backend with the following URL:
http://campusiot.imag.fr:80/sigfox?time={time}&device={device}&duplicate={duplicate}&snr={snr}&station={station}&data={data}&avgSnr={avgSnr}&lat={lat}&lng={lng}&rssi={rssi}&seqNumber={seqNumber}


The published message looks like this : 
```json
{"data":"1e2d","id":"1C178","time":"1471594359","snr":"12.13","station":"0AF0","avgSnr":"19.75","rssi":"-135.00","lat":"45","lng":"6","seqNumber":"2516","duplicate":"false"}
```
## Configure

Edit the settings.json configuration file.

Edit the htpasswd password file.

## Run
```bash

    docker run -ti --name sigfox-mqtt-bridge -p 8080:8080 campusiot/sigfox-mqtt-bridge:latest

    mosquitto_sub -h test.mosquitto.org -t campusiot/sigfox/#

    curl 'http://ftd:__SUPER_SECRET_TO_CHANGE__@localhost:8080/sigfox?time=1471594359&device=1C178&duplicate=false&snr=12.13&station=0AF0&data=1e2d&avgSnr=19.75&lat=45&lng=6&rssi=-135.00&seqNumber=2516'

    curl 'http://localhost:8080/sigfox?time=1471594359&device=1C178&duplicate=false&snr=12.13&station=0AF0&data=1e2d&avgSnr=19.75&lat=45&lng=6&rssi=-135.00&seqNumber=2516'
```

## Running with persistence

### Local directories / External Configuration

Alternatively you can use volumes to make the changes
persistent and change the configuration.

```bash
    mkdir -p ~/configuration/sigfox-mqtt-bridge/

    docker run -ti \
      --name sigfox-mqtt-bridge \
      -p 8080:8080 \
      -v ~/configuration/sigfox-mqtt-bridge/settings.json:/usr/src/app/settings.json:ro \
      -v ~/configuration/sigfox-mqtt-bridge/htpasswd:/usr/src/app/htpasswd:ro \
      campusiot/sigfox-mqtt-bridge:latest
```

Volumes: /usr/src/app/settings.json, /usr/src/app/htpasswd

## Running with Docker Compose

```bash
    mkdir -p ~/configuration/sigfox-mqtt-bridge/
    cp ./settings.json ~/configuration/sigfox-mqtt-bridge/
    ./create_passwd.sh
    cp ./htpasswd ~/configuration/sigfox-mqtt-bridge/
    docker-compose -f docker-compose.yml up

    mosquitto_sub -h test.mosquitto.org -t campusiot/sigfox/#

    curl 'http://ftd:__SUPER_SECRET_TO_CHANGE__@localhost:8080/sigfox?time=1471594359&device=1C178&duplicate=false&snr=12.13&station=0AF0&data=1e2d&avgSnr=19.75&lat=45&lng=6&rssi=-135.00&seqNumber=2516'

    curl 'http://localhost:8080/sigfox?time=1471594359&device=1C178&duplicate=false&snr=12.13&station=0AF0&data=1e2d&avgSnr=19.75&lat=45&lng=6&rssi=-135.00&seqNumber=2516'
```

## Build

```
    git clone https://github.com/campusiot/sigfox-mqtt-bridge.git
    cd sigfox-mqtt-bridge
    docker build -f Dockerfile -t campusiot/sigfox-mqtt-bridge:latest .

    # For saving the container image
    mkdir -p ~/docker-images
    docker save campusiot/sigfox-mqtt-bridge:latest | gzip > ~/docker-images/sigfox-mqtt-bridge.tgz

    # For loading the saved container image
    gunzip -c ~/docker-images/sigfox-mqtt-bridge.tgz | docker load
```

## Authors and license

sigfox-mqtt-bridge was written by:

* **Didier Donsez** | [GitHub](https://github.com/donsez/)
* With contributions from:
 * [Vivien Quéma](https://github.com/quema)

License: [EPLv2](https://www.eclipse.org/legal/epl-2.0/)

## Contact

Contact: Didier Donsez

## TODOLIST
[ ] Certificate per user
[ ] MQTT failover
[ ] Support POST with application/json
[ ] Get password from a SQL database

# Security considerations
* sigfox-mqtt-bridge HTTP endpoint should be secured with a TLS terminaison (ngnix, haproxy)
* sigfox-mqtt-bridge HTTP endpoint should be protected again brute-force password cracking using fail2ban

## Bonus track
* https://github.com/nicolsc/sigfox-callback-demo
