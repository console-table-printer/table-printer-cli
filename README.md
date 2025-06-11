# table-printer-cli

### 📟🍭Printing Pretty Tables on your terminal

[![codecov](https://codecov.io/gh/console-table-printer/table-printer-cli/graph/badge.svg?token=xSI9V5U9S9)](https://codecov.io/gh/console-table-printer/table-printer-cli)
[![npm version](https://badge.fury.io/js/table-printer-cli.svg)](https://badge.fury.io/js/table-printer-cli)
[![install size](https://packagephobia.now.sh/badge?p=table-printer-cli@latest)](https://packagephobia.now.sh/result?p=table-printer-cli)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Synopsis

Printing Simple Table on your bash terminal. Its useful when you want to present some tables on console. There is a library that you can use similar way in nodejs/typescript Projects. [console-table-printer](https://www.npmjs.com/package/console-table-printer)

## Installation

### Using npm

```bash
npm install --global table-printer-cli
```

### Using yarn

```bash
yarn global add table-printer-cli
```

## Basic Example

Try this simple example first:

```bash
ctp -i '[{"name":"Alice","score":95},{"name":"Bob","score":82}]'
```

![Basic Example](https://cdn.jsdelivr.net/gh/console-table-printer/table-printer-cli@master/static-resources/1.quick-print.v4.png)

You can also pipe JSON data from other commands:

```bash
# Pipe data from another command
echo '[{"name":"Alice","role":"Developer"},{"name":"Bob","role":"Designer"}]' | ctp -s
```

![Pipe Example](https://cdn.jsdelivr.net/gh/console-table-printer/table-printer-cli@master/static-resources/2.pipe-data.v1.png)

### Using Table Options

Customize your tables with colors, styles, and more using the `--tableOptions` parameter. These options are compatible with [console-table-printer](https://www.npmjs.com/package/console-table-printer) library.

```bash
# Colorize specific columns
ctp -i '[
  {"name": "John", "status": "active", "score": 95},
  {"name": "Jane", "status": "inactive", "score": 82},
  {"name": "Bob", "status": "active", "score": 78}
]' --tableOptions '{
  "title": "Employee Status",
  "columns": [
    {"name": "status", "color": "green", "alignment": "right"},
    {"name": "score", "color": "yellow"}
  ]
}'
```
![Complex Example](https://cdn.jsdelivr.net/gh/console-table-printer/table-printer-cli@master/static-resources/3.complex-example1.v1.png)

## Detailed Usage

```text
Usage: ctp [options]

Options:
  -v, --version              output the current version
  -i, --input <value>        input string
  -s, --stdin               read input from stdin
  -t, --tableOptions <value> table options in JSON format
  -h, --help               display help for command
```

## License

[MIT](https://github.com/console-table-printer/table-printer-cli/blob/master/LICENSE)
