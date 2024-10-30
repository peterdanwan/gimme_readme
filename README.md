# gimme_readme

`gimme_readme` is a command-line tool powered by AI that generates a comprehensive `README.md` file for your project. It analyzes multiple source code files at once, providing concise explanations of each file's purpose, functionality, and key components, all in a single, easy-to-read document.

![gimme_readme-0.1-demo-revised](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tqp31p7fm8m15ss3qkwl.gif)

See our [0.1 Release Demo](https://youtu.be/S6v-u9o_Xx8)!

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Usage](#2-usage)
3. [Example Usage](#3-example-usage)
4. [Supported Models by Providers](#4-supported-models-by-providers)
5. [Contributing](#5-contributing)
6. [Code of Conduct](#6-code-of-conduct)
7. [License](#7-license)
8. [Author](#8-author)

## 1. Getting Started

To get started with `gimme_readme`, follow these steps:

1. Install the latest version of [Node.js](https://nodejs.org/en/download/package-manager) for your operating system.
2. Run the following command to install `gimme_readme` globally:

   ```sh
   npm i -g gimme_readme
   ```

   NOTE: MAC/LINUX users may need to run `sudo npm i -g gimme_readme`

3. Generate a configuration file by running in _any_ folder you'd like:

   ```sh
   gr-ai -c
   ```

   This command creates a `.gimme_readme_config` file in your home directory. **Do not move this file from this location.**

4. Open the `.gimme_readme_config` file and add your API keys and preferred default values as prompted. Ensure you leave the variable names unchanged.

   - Subsequent runs of `gr-ai -c` will display the path to your existing config file.
   - See [here](./env.sample) for an example of what a `.gimme_readme_config` file looks like!

## 2. Usage

`gimme_readme` uses AI to generate a `README.md` file that explains a given source code file or files. Below are the available options:

| Option                         | Description                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `-v`, `--version`              | Output the current version                                                        |
| `-f`, `--file [files...]`      | Specify one or more files to generate explanations for                            |
| `-o`, `--outputFile <string>`  | Specify the file to output the generated README to                                |
| `-m`, `--model <string>`       | Choose a free-tier AI model to use (e.g., gemini, openai, grok)                   |
| `-p`, `--prompt <string>`      | Provide a custom prompt to the AI                                                 |
| `-pf`, `--promptFile <string>` | Specify a prompt file                                                             |
| `-c`, `--config`               | Show the location of the configuration file and provide links to examples         |
| `-t`, `--temperature <number>` | Set the level of determinism for the AI (value between 0 and 1)                   |
| `-tkn`, `--token`              | Get information on the tokens consumed (i.e., prompt, completion, & total tokens) |
| `-h`, `--help`                 | Display help for the command                                                      |

## 3. Example Usage

Below are some simple examples to help you get started with `gimme_readme`. For more detailed examples,
see [here](./_examples/README.md).

### Display Help

To display the help menu with all available commands:

```sh
gr-ai -h
```

### Display Version Number

To show the current version of `gimme_readme`:

```sh
gr-ai -v
```

### Generate a README for a Source File

To generate a `README.md` file for one or more source files:

```sh
gr-ai -f example.js anotherFile.py -o README.md -m gemini-1.5-flash
```

### Generate the number of tokens used during the API call

```sh
gr-ai -f example.js anotherFile.py -o README.md -m gemini-1.5-flash -tkn
gr-ai -f example.js anotherFile.py -o README.md -m llama3-8b-8192 --token
```

## 4. Supported Models by Providers

| Provider | Models           |
| -------- | ---------------- |
| `gemini` | gemini-1.5-flash |
| `groq`   | llama3-8b-8192   |

## 5. Contributing

We welcome contributions to improve `gimme_readme`! To get started with contributing, we ask that you read our [contributing guide](./CONTRIBUTING.md)

## 6. Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## 7. License

This project is licensed under the MIT license. You are free to use, modify, and distribute this code, subject to the terms in the [LICENSE](./LICENSE) file.

## 8. Author

Developed by [Peter Wan](https://github.com/peterdanwan).

For any questions or feedback, feel free to reach out through the GitHub repository.
