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

Try this on your terminal.

```bash
ctp -i '[{ "id":3, "text":"like" }, {"id":4, "text":"tea"}]'
```

Output:

![Screenshot](https://cdn.jsdelivr.net/gh/console-table-printer/table-printer-cli@master/static-resources/quick-print.v3.png)

You can also pipe the input from stdin

```bash
echo '[{ "id":3, "text":"like" }, {"id":4, "text":"tea"}]' | ctp -s
```

## Detailed usage

```text
Usage: ctp [options]

Options:
  -i, --input <value>  input string
  -s, --stdin          read input from stdin
  -h, --help           display help for command
```

## License

[MIT](https://github.com/console-table-printer/table-printer-cli/blob/master/LICENSE)
