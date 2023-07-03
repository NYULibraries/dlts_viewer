#!/bin/bash -e

# ./sites/all/modules/dlts_viewer/bin/delete-by-nid.sh

cleanup () {
  if [[ -f ./delete-by-nid.pid ]];
    then
      rm -f ./delete-by-nid.pid
  fi
}

die () {
  echo "file: ${0} | line: ${1} | step: ${2} | message: ${3}";
  exit 1;
}

if [[ -f ./delete-by-nid.pid ]];
  then
    die ${LINENO} "error" "Fail: Process already running."
  else
    trap cleanup EXIT
fi

while [ `./vendor/bin/drush total-resources` -gt 0 ]; do  
  identifier=`./vendor/bin/drush pick-one-identifier`
  ./vendor/bin/drush delete-by-identifier --identifier=${identifier}  
  if [ $? -eq 1 ];
    then
      die ${LINENO} "error" "Something is wrong."
  fi;
done

exit 0
