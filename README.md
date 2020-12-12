# VSinder

A dating app for programmers where you swipe on code.

![swiping code](https://media.giphy.com/media/Vhw2lTXYI6FhGrbE2G/giphy.gif)

Context: https://youtu.be/bfd8RyAJh6c

## Get the app for push notifications

[iOS](https://apps.apple.com/us/app/vsinder/id1542523079?itsct=apps_box&itscg=30200)

[Android](https://play.google.com/store/apps/details?id=com.benawad.vsinder)

## How to run locally

### API (you'll need this if you want to run the extension or iOS/Android app)

0. `packages/api`
1. Have PostgreSQL running and create a db called `vsinder`
2. Have Redis running
3. Copy .env.example to .env and fill in GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (you will have to register a [GitHub OAuth app](https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-an-oauth-app) and set the callback url to: http://localhost:3001/auth/github/callback)
4. Run `yarn` to install deps
5. Run `yarn watch` to compile TypeScript
6. Run `yarn dev` to start server

### Extension

0. `packages/extension`
1. Run `yarn` to install deps
2. Create `src/places-api-key.ts` and stick this inside:
```
export const placesApiKey = "";
```
3. Run `yarn watch` to compile TypeScript & Svelte
4. Press f5 to trigger VSCode debugger which launches the extension

### App

0. `packages/app`
1. Run `yarn` to install deps
2. Create `src/places-api-key.ts` and stick this inside:
```
export const placesApiKey = "";
```
3. Create `src/dsn.ts` and stick this inside:
```
export const SENTRY_DSN = ""
```
4. Run `yarn start` to start Expo
