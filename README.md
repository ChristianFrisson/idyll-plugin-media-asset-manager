# idyll-plugin-media-asset-manager

Idyll plugin to manage media assets.

## Author

- [Christian Frisson](http://frisson.re)

## Features

- Checks in Idyll document AST for specific attributes (for now: `src`, `url`).
- Checks if the values of such attributes contain a specific path (for now: `media`).
- Copies matching files to `build` with same path.

## Installation

```
npm install https://github.com/ChristianFrisson/idyll-plugin-media-asset-manager.git --save-dev
```

Add it to your idyll configuration in `package.json`:

```json
"idyll": {
  "compiler": {
    "postProcessors": ["idyll-plugin-media-asset-manager"]
  }
}
```
