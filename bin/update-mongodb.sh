#!/bin/bash -e

# ./sites/all/modules/dlts_viewer/bin/update-mongodb.sh

cleanup () {
  if [[ -f ./update-mongodb.pid ]];
    then
      rm -f ./update-mongodb.pid
  fi
}

die () {
  echo "file: ${0} | line: ${1} | step: ${2} | message: ${3}";
  exit 1;
}

if [[ -f ./update-mongodb.pid ]];
  then
    die ${LINENO} "error" "Fail: Process already running."
  else
    trap cleanup EXIT
fi

echo $$ > ./update-mongodb.pid

while [ `./vendor/bin/drush total-resources-to-update` -gt 0 ]; do  
  ./vendor/bin/drush update-resource-pages
  if [ $? -eq 1 ];
    then
      die ${LINENO} "error" "Something is wrong"
  fi;
done

exit 0
