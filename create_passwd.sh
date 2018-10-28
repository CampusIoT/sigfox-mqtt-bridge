#!/bin/bash

# Copyright (C) CampusIoT,  - All Rights Reserved
# Written by CampusIoT Dev Team, 2016-2018

if ! [ -x "$(command -v htpasswd)" ]; then
  echo 'htpasswd is not installed. Installing htpasswd ...'
  npm install -g htpasswd
fi

plainpasswordfile=htpasswd_plain
passwordfile=htpasswd

rm -f $passwordfile
touch $passwordfile

OLDIFS=$IFS
IFS=":"
while read username password
 do
  htpasswd -b $passwordfile $username $password
 done < $plainpasswordfile
IFS=$OLDIFS
