# Go Remote

Take control of your PC from any device with a web browser.

**NOTE**: This project uses [robotgo](https://github.com/go-vgo/robotgo) and has been tested on linux (Linux Mint 21.3).
You must install the following dependencies (check the robotgo repository for more information):

```sh
# gcc
sudo apt install gcc libc6-dev

# x11
sudo apt install libx11-dev xorg-dev libxtst-dev

# Clipboard
sudo apt install xsel xclip

# Bitmap
sudo apt install libpng++-dev

# GoHook
sudo apt install xcb libxcb-xkb-dev x11-xkb-utils libx11-xcb-dev libxkbcommon-x11-dev libxkbcommon-dev
```

```sh
# Run npm install first to get tailwindcss and esbuild.
$> npm install

$> make help
    air: Live reloading (listenAddr=8000 by default)
    build: Minify the final CSS and app.js and build the executable in the "bin" directory.
    js-build: Build the final app.js minified
    js-watch: Watch app.js for changes
    css-build: Minify the final CSS
    css-watch: Watch for CSS changes
    dev: runs tailwindcss and esbuild in watch mode and air for live-reloading
    help: Show help for each of the Makefile recipes.
```

```sh
# Build the executable (in the bin directory)
$> make build
# Run the server (by default is *:3000)
$> ./bin/app -addr=":8000" # will listen to *:8000
```
