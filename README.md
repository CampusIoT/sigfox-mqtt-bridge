# Sigfox MQTT bridge

This application is a simple bridge between the Sigfox backend and MQTT subscribers

The callback for the device type must be configured in the Sigfox backend with the following URL:
http://campusiot.imag.fr:80/sigfox?time={time}&device={device}&duplicate={duplicate}&snr={snr}&station={station}&data={data}&avgSnr={avgSnr}&lat={lat}&lng={lng}&rssi={rssi}&seqNumber={seqNumber}

The published message looks like this : {"data":"1e2d","id":"1C178","time":"1471594359","snr":"12.13","station":"0AF0","avgSnr":"19.75","rssi":"-135.00","lat":"45","lng":"6","seqNumber":"2516","duplicate":"false"}
