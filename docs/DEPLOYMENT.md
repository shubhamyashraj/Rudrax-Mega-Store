# Deployment Guide: Firebase & GitHub Actions

Configure corporate-standard automated continuous deployment pipelines for your React application and Firestore security structure with the steps below.

## Step 1: Firebase Project Setup
Ensure your project contains `firebase-applet-config.json` at the root with active API credentials.

## Step 2: GitHub Action Configuration
Place the following inside `.github/workflows/build-and-deploy.yml`:
```yaml
name: Deploy Rudrax Mega Store

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-size: 18

      - name: Install Dependencies
        run: npm ci

      - name: Build Assets
        run: npm run build

      - name: Deploy to Firebase Hosting and Firestore
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_RUDRAX }}'
          channelId: live
```

## Step 3: Deploying Security Rules manually
Run:
```bash
firebase deploy --only firestore:rules
```
