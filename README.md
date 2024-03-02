# @swifti/body-parser

> Body parser for Swifti applications.

## Installation

```bash
npm install @swifti/body-parser
```

## Use

```ts
// filename: middlewares.ts
import bodyParser from '@swifti/body-parser'

export default [bodyParser.raw(/* options */)]
```

## Options

- `limit`: Allowed limit.
- `errorStatusCode`: Code returned when an error occurs.

## Methods

By default all methods include the original buffer of the request body in the `ctx.state.rawBody` (except requests with forms and when the `raw` method is used)

- `raw`: Get the original buffer of the body.
- `form`: Receive form bodies (includes [files](#file-object))
- `xml`: Receive xml bodies.
- `urlencoded`: Receive urlencoded bodies.
- `json`: Receive json bodies.

## File Object

- `fieldname`: Name of the field where the file came from.
- `originalname`: Original file name.
- `filename`: File name.
- `size`: File size.
- `extname`: File extname.
- `path`: Absolute file path.
- `move`: Function to move the file to a new location.
- `data`: Get the content of the file.

## License

[MIT License](https://github.com/by-aoi/swifti/blob/main/LICENSE)
