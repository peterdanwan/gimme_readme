// src/defaultPrompt.js

export default `Take the code from each file sent and produce a response in markdown explaining the code. 
  Ensure that the markdown returned uses semantic headings (i.e., first heading should have one hashtag (#)).
  The first heading should be an appropriate title for the document (not README.md).

  Give a "level 2 heading" for:
  - the project structure
  - each file sent (do not make a heading for the relative path of the file)

  Ensure that in your explanation of the code that you refer to code snippets from the file(s) that are sent.\n\n`;
