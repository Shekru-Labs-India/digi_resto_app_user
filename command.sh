#!/bin/bash

# Git configurations to avoid file mode and line-ending issues
git config core.fileMode false
git config core.autocrlf false

# Add changes to the staging area and commit with a passed message
git add .
git commit -m "$1"

# Unstage files and re-add (to fix permission changes if any)
git rm -r --cached .
git add .
git commit -m "$1"

# Pull the latest changes from the remote master branch
git pull origin main

# Set correct permissions for the new repo
chmod -R 777 ../digi_resto_app_user/
chown -R root:root ../digi_resto_app_user/

# Push changes to master branch
git push origin HEAD:main
