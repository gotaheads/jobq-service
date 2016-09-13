#!/bin/bash

if [ -z "$1" ]
  then
    echo "You must specify the message for release"
    exit 1
fi
MSG=$1

if [ -z "$2" ]
  then
    echo "You must specify the new version such as 1.0.12"
    exit 1
fi
VERSION=$2

echo "pushing to master with $MSG"

git add --all .
#git rm -r $(git ls-files --deleted) 
git commit -m "$MSG"
git push origin master

./patch.sh 

#npm run dist

git add --all .
#git rm -r $(git ls-files --deleted)
git commit -m "$MSG"
git push origin master
echo "creating tag with $VERSION"
./tag.sh $VERSION

