#!/bin/bash -e

while IFS="" read -r p || [ -n "$p" ]
do
  drush add-epub --identifier=${p} --user=dlts.pa
done < $1

exit 0
