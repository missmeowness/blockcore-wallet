# Web Browser Extension for Blockcore

Basic shell for our future web browser extension for digital signing, web site login and more.

## Run with Hot-Reload

```sh
npm install
npm start
```

This will run Angular in watch-mode and ensure it auto-reloads.

## Install Extension

To install the extension, follow the instructions here: [https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)

Choose the `dist` folder when picking folder for extension to load from.

## Restrictions

Currently the extension only activates when you're visiting the website [https://www.blockcore.net/](https://www.blockcore.net/).

## Manifest V2

The Blockcore Extension is built using V2 of the manifest file format: [https://developer.chrome.com/docs/extensions/mv2/](https://developer.chrome.com/docs/extensions/mv2/)

We should migrate to V3 when possible: [https://developer.chrome.com/docs/extensions/mv3/manifest/](https://developer.chrome.com/docs/extensions/mv3/manifest/)
