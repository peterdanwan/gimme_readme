# gimme_readme

## Table of Contents

1. [What is gimme_readme?][1-what-is-gimme-readme]
2. [Getting Started][2-getting-started]
3. [Example Usage][3-example-usage]
4. [List of supported models by providers][4-list-of-supported-models-by-providers]
5. [Contributing][5-contributing]

## 1. What is gimme_readme?

`gimme_readme` is a command-line tool that uses `OpenAI` to generate a `README.md` file that explains a given source code file.

## 2. Getting Started

To use the `gimme_readme`, you must:

1. Install the latest version of [node](https://nodejs.org/en/download/package-manager) for your `operating system`.
2. Run `npm i -g gimme_readme`, which installs `gimme_readme` globally.
3. Run `gr-ai -c` to generate your own `.gimme_readme_config` file in your `home` directory.
   - `NOTE`: Do _not_ move this file from this location.
   - Follow the prompts in recently created `.gimme_readme_config` file to add your API keys and preferred default values
   - Leave the variable names in the newly generated config file alone.
   - subsequent runs of `gr-ai -c` will just show you the path of your config file

## 3. Example Usage

### Display all details

```sh
gr
```

### Display version number

```sh
# Can do this
gr -v
# Or this
gr --version
```

## 4. List of supported models by providers

| Provider | Models           |
| -------- | ---------------- |
| `gemini` | gemini-1.5-flash |
| `groq`   | llama3-8b-8192   |

## 5. Contributing

Contributions to this project are welcomed!

We ask that you first check to see if the issue you've encountered or feature you wish to add is under the existing list of [issues](https://github.com/peterdanwan/gimme_readme/issues).

If your issue or suggested feature is already, please add onto the existing issue by adding your comments or making `pull request` with what you believe to be a valid change to the code.

Otherwise, if your issue or suggestion is not already list, please feel free to create a new issue, and if possible create a `pull request` that you think will resolve your issue.

[1-what-is-gimme-readme]: #1-what-is-gimme_readme
[2-getting-started]: #2-getting-started
[3-example-usage]: #3-example-usage
[4-list-of-supported-models-by-providers]: #4-list-of-supported-models-by-providers
[5-contributing]: #5-contributing
