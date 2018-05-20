# @rxjs-inspector

Toolset for debugging and visualizing RxJs applications.

## WIP

This project is in early developpement stage.

## Packages

* [@rxjs-inspector/core](./packages/core) - Core library to include in the debug target
* [@rxjs-inspector/devtools](./packages/devtools) - Devtools library to enable communication with the devtools extension
* [@rxjs-inspector/extension](./packages/extension) - Devtools extension
* [@rxjs-inspector/panel](./packages/panel) - Devtools panel (built in the extension)

## Demo

First install locally

```
git clone https://github.com/TinyMan/rxjs-inspector.git
cd rxjs-inspector
npm install
npm run bootstrap
npm run build
```

Then you have to install the extension in chrome:

* Go to chrome://extension and tick "developper mode"
* Load unpacked extension
* Choose `<package root>/packages/extension/lib`

You can run the demo app:

```
npm run watch:demo
```

And the panel:

```
npm run watch:panel
```

Then visit http://localhost:1337 and http://localhost:4200.

## Features

## Contributing
