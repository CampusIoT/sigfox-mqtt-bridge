/*
 * Copyright (C) CampusIoT,  - All Rights Reserved
 * Written by CampusIoT Dev Team, 2016-2018
 * Authors: Didier Donsez, Vivien Quéma
 */

/*
 * bridge between the Sigfox backend and MQTT subscribers
 */

// Retrieve the settings
var SETTINGS = require('./settings.json');

const ID = SETTINGS.id;
const NAME = SETTINGS.name;
const ENV = SETTINGS.env;

const DEBUG = SETTINGS.loglevel.debug;
const INFO = SETTINGS.loglevel.info;
const ERROR = SETTINGS.loglevel.error;

var PORT = SETTINGS.http.port;
var PATH = SETTINGS.http.path;

var MQTT_BROKER_URL = SETTINGS.mqtt.url;
var MQTT_OPTIONS = SETTINGS.mqtt.options;
var MQTT_TOPIC = SETTINGS.mqtt.topic;

/*
TODOLIST

Certificat per user
MQTT failover
Support POST with application/json

*/
var auth = require('http-auth');
var basic = auth.basic({
    realm: SETTINGS.http.realm,
    file: SETTINGS.http.passwordfile
});

basic.on('success', (result, req) => {
    console.log(`User authenticated: user=${result.user} ip=${req.ip} hostname=${req.hostname}`);
});

basic.on('fail', (result, req) => {
    console.log(`User authentication failed : user=${result.user} ip=${req.ip} hostname=${req.hostname}`);
});

basic.on('error', (error, req) => {
    console.log(`Authentication error: ${error.code + " - " + error.message}`);
});

var express = require('express');

var app = express();
app.use(auth.connect(basic));

var mqtt    = require('mqtt');
var client  = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);
var mqttConnected = false;

client.on('connect', function () {
  mqttConnected = true;
  console.log('Sigfox callback server : MQTT connected to ',MQTT_BROKER_URL);
});

client.on('reconnect', function () {
  mqttConnected = true;
  console.log('Sigfox callback server : MQTT reconnected to ',MQTT_BROKER_URL);
});

client.on('offline', function () {
  mqttConnected = false;
  console.log('Sigfox callback server : MQTT offline ');
});


client.on('close', function () {
  mqttConnected = false;
  console.log('Sigfox callback server : MQTT closed');
});

client.on('error', function (error) {
  mqttConnected = false;
  console.log('Sigfox callback server : MQTT Error ',error);
});

function handler(req, res) {

  console.log("Received GET ", JSON.stringify(req.query), "user="+req.user);

  if(mqttConnected) {

     client.publish(MQTT_TOPIC + "/" + req.user, JSON.stringify(req.query));

     // published message looks like this : Received GET  {"data":"1723","id":"1AEA29","time":"1481821861","snr":"19.06","station":"0FAD","avgSnr":"37.66","rssi":"-132.00","lat":"45.0","lng":"6.0","seqNumber":"4084","duplicate":"true"}

     res.send('Callback received');
  } else {
    res.status(500).send('Could not delivered callback');
  }
}

app.get(PATH, handler);
app.post(PATH, handler);

app.listen(PORT, function () {
  console.log('Listening on port='+PORT, "path="+PATH);
});
