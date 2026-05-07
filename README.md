# Pinboard Saver — Safari Extension

A tiny Safari extension that saves the current tab to [pinboard.in](https://pinboard.in) with one click on the toolbar button. Right-click the toolbar button to open pinboard.in in a new tab.

## Status

This is a vibe-coded personal project. It's free to use under the MIT license, but **there is no support** — I will not reply to issues, pull requests, or feature requests. Fork it and do whatever you want.

## What it does

- **Click toolbar button** → POSTs the current tab's URL + title to the Pinboard `posts/add` API. Badge flashes ✓ on success, ! on failure.
- **Right-click toolbar button → "Open pinboard.in"** → opens pinboard.in in a new tab.
- **First click with no token configured** → opens the options page so you can paste your API token.

That's the whole thing. No popup, no UI, no syncing, no tag picker, no read-later toggle. It saves silently as private + not-to-read.

## Setup

### 1. Get your Pinboard API token

Go to <https://pinboard.in/settings/password> and copy the auth token. It looks like `username:ABC123DEF456...`.

### 2. Wrap the WebExtension as a Safari app

The `extension/` directory holds the raw WebExtension files. To run it in Safari you need to wrap them in an Xcode project once:

```sh
xcrun safari-web-extension-converter ./extension \
  --project-location ./xcode \
  --app-name "Pinboard Saver" \
  --bundle-identifier com.local.pinboard-saver \
  --no-prompt --force
```

This generates an Xcode project in `xcode/`. The `xcode/` directory is gitignored-friendly (build artifacts only) — the source of truth is `extension/`.

### 3. Build & run

```sh
open xcode/Pinboard\ Saver/Pinboard\ Saver.xcodeproj
```

Hit ▶ Run in Xcode. A stub host app launches; you can quit it. The extension is now installed.

### 4. Enable in Safari

1. Safari → Settings → Advanced → check **Show Develop menu in menu bar**.
2. Develop menu → check **Allow Unsigned Extensions** (you'll need to redo this after each Safari restart unless you sign with a paid Apple Developer cert).
3. Safari → Settings → Extensions → enable **Pinboard Saver**.
4. Click the puzzle-piece icon in the Safari toolbar and pin the Pinboard Saver button.

### 5. Set your token

Click the toolbar button once. The options page opens. Paste your token, click Save.

## Updating the extension

Edit files in `extension/`. To pick up changes in Safari, re-run the converter (it'll patch the Xcode project) and hit Run again, or just re-run from Xcode if only JS/HTML changed.

## License

MIT — see [LICENSE](LICENSE).
