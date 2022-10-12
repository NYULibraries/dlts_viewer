#!/bin/bash -e

# ./sites/all/modules/dlts_viewer/bin/update-resource-pages.sh

cleanup () {
  if [[ -f ./update-resource-pages.pid ]];
    then
      rm -f ./update-resource-pages.pid
  fi
}

die () {
  echo "file: ${0} | line: ${1} | step: ${2} | message: ${3}";
  exit 1;
}

if [[ -f ./update-resource-pages.pid ]];
  then
    die ${LINENO} "error" "Fail: Process already running."
  else
    trap cleanup EXIT
fi

echo $$ > ./update-resource-pages.pid

while [ `./vendor/bin/drush total-resources-to-update` -gt 0 ]; do  
  ./vendor/bin/drush update-resource-pages
  if [ $? -eq 1 ];
    then
      die ${LINENO} "error" "Something is wrong."
  fi;
done

exit 0
