// src/prompt/defaultPrompt.js

export default `Take the code from each file sent and produce a comprehensive response in markdown format explaining the code. 

## Structure Requirements:
- Start with a level 1 heading (#) that serves as an appropriate title for the document. This title should not be "README.md".
- Create a level 2 heading (##) titled "Project Structure" to outline the directory structure of the project in a tree format.
- For each file sent, provide a separate level 2 heading (##) with the file name (do not include the relative path).
- Under each file heading, give a detailed explanation of the file's purpose and functionality, including code snippets where relevant.
  
## Explanation Requirements:
- Refer to code snippets from the provided files to illustrate your explanations.
- Ensure the explanation is clear, concise, and uses semantic markdown headings to separate different sections and concepts.
- If the file is a script or module, explain the key functions, classes, or exports it contains.
- If there are any dependencies or connections between the files, explain them under the appropriate headings.

## Example Output:
\`\`\`markdown
# Appropriate Title for the Document

## Project Structure
\`
├── src
│   ├── ai_models
│   │   └── geminiModels.js
│   ├── commanderProgram.js
│   ├── getFileContent.js
│   ├── ai.js
│   ├── defaultPrompt.js
│   └── _gr.js
\`

## ai_models/geminiModels.js
Explanation of the contents of geminiModels.js, including key functions, classes, and usage examples.

## commanderProgram.js
Explanation of commanderProgram.js, highlighting its role in the project, key functionality, and any important code snippets.

... (continue for each file)
\`\`\`

Ensure that the markdown uses the appropriate level of headings and references relevant code snippets for clarity.\n\n`;
