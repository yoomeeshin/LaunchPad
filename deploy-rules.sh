#!/bin/bash

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "Firebase CLI found. Continuing..."
fi

# Log in to Firebase if not already logged in
firebase login --no-localhost

# Deploy Firestore rules
echo "Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo "Deployment complete!" 