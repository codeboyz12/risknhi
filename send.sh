#!/bin/bash

API="http://localhost:8000/api/addPatient"

jq -c '.[]' mockPatient.json | while read row; do
  echo "Sending: $row"
  curl -X POST -H "Content-Type: application/json" \
       -d "$row" \
       "$API"
  echo
done
