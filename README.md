# gimme_readme

## Table of Contents

1. [What is gimme_readme?][1-what-is-gimme-readme]
2. [Dependencies][2-dependencies]
3. [Example Usage][3-example-usage]
4. [Contributing][4-contributing]

## 1. What is gimme_readme?

`gimme_readme` is a command-line tool that uses `OpenAI` to generate a `README.md` file that explains a given source code file.

## 2. Dependencies

To use the `gimme_readme`, you must do the following:

1. Install the latest version of [Python `3`, which comes with the `PIP` package manager](https://www.python.org/downloads/) (this will _not_ work with earlier versions of `Python`).
2. Install [openai] via the following command:

   ```sh
   pip install openai
   ```

   - NOTE: If you are on `Windows`, you must run this command as an `Administrator`.

3. Have a copy of `gr.py`, the main source file which will handle creating a `README.md` file based on your source code.

## 3. Example Usage

### On Linux / Mac OS

```sh
./gr.py FILE
```

### On Windows

```sh
py ./gr.py FILE
```

## 4. Contributing

Contributions to this project is welcomed! Please look for any [issues](https://github.com/peterdanwan/gimme_readme/issues)

[1-what-is-gimme-readme]: #1-what-is-gimme_readme
[2-dependencies]: #2-dependencies
[3-example-usage]: #3-example-usage
