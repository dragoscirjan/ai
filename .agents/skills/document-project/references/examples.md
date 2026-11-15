# Writing examples and scenario checks

These examples illustrate completeness and review technique. Receipt Maker is a fictional application. Its UI labels, files, and results are invented for this example, not inspected or tested product behavior. Do not copy them as factual instructions for a real tool.

## Replace shorthand with a complete task

An unclear instruction:

> Configure the output path and execute export.

An illustrative how-to for a nontechnical reader:

### Save your receipt as a PDF

This example uses Windows with a PDF reader already installed. Start with Receipt Maker open and a completed receipt visible. You need permission to save a file in your Documents folder.

1. Select **Export** above the receipt. A window named **Save receipt** opens.
2. In that window, select **PDF** from the **File type** list.
3. Select your **Documents** folder as the save location.
4. Enter `receipt.pdf` in the **File name** box.
5. Select **Save**. The application displays **Receipt saved**.
6. Press the Windows key and E together. File Explorer opens so you can find files on your computer.
7. Select **Documents** on the left side of File Explorer.
8. Double-click `receipt.pdf`. Your PDF reader opens the saved receipt.
9. Check that the receipt details are correct.

If the file name already exists, choose another name to keep the old receipt. If the application reports that it cannot save the file, choose a folder where your account can save files. Do not change system permissions to work around the error.

This is a how-to with an explicit starting state, not a complete installation guide. A first-use guide must also explain how to obtain and open the real application, enter or load sample input, and reach that state. Verify those steps and labels against the actual product.

## Do not hide technical prerequisites

An unclear command example:

```text
$ tool run --input <file>
```

A reader cannot know whether to copy the dollar sign, where to run the command, which program provides `tool`, or how to replace `<file>`.

For a real CLI guide:

- Explain what the terminal is and how to open it on the supported platform, or link directly to a complete prerequisite guide.
- Explain how to reach the intended working directory. Do not use an unexplained `<project-root>` placeholder.
- State how the tool is installed and how the reader can check that it is available.
- Provide safe sample input and explain how to obtain or create the file.
- Show the verified command without the prompt. Explain placeholders before the command, or use concrete non-sensitive sample values.
- Show the expected result and where to find any output file. Explain a likely error and its recovery.
- If the reader needs technical knowledge the guide cannot provide, name the limitation. Do not invent a simpler interface.

Do not claim an illustrative command or output was executed.

## Review the workflow against these situations

Use these as walkthrough scenarios, not claims that tests have passed:

| Situation | Expected behavior |
|---|---|
| A new command or UI action changes the user's workflow. | Update the affected guide and example alongside the implementation. Explain prerequisites, exact actions, success, and likely errors. |
| A public option or default changes. | Update affected examples and reference together. Remove obsolete instructions and check links. |
| The relevant page is dense or repeats itself. | Rewrite, split, or move the affected material to make the task followable. Do not append another summary or expand unrelated cleanup. |
| An internal refactor changes no reader task or public behavior. | Give a concrete no-change explanation. Do not make cosmetic documentation edits merely to show activity. |
| A new repository has no documentation site. | Propose a minimal VitePress baseline and wait for approval before creating it or installing dependencies. |
| An old repository has poor documentation or uses another site generator. | Maintain affected pages in the current site. Propose broader cleanup or VitePress migration separately and preserve useful content and links. |
| A guide needs credentials, paid actions, destructive operations, or unfamiliar code. | Explain the prerequisites and risks before the action. Obtain required authorization and use safe sample data. Never expose secrets. |
| The build or example environment is unavailable. | Report the missing check and obtain an explicit owner decision before treating blocked required work as complete. Do not report a pass. |
| A site builds but instructions omit the starting files or required knowledge. | The documentation is not ready. Repair the guide; rendering is not evidence of task completion. |

## Research behind the approach

The owner-selected examples support different parts of the workflow:

- [mise getting started](https://mise.jdx.dev/getting-started.html) develops one example and shows observable results.
- [Task quick start](https://taskfile.dev/docs/getting-started) and [configuration reference](https://taskfile.dev/docs/reference/config) serve learning and lookup separately.
- [AI Hero's learning map](https://www.aihero.dev/learn) organizes material around reader questions.
- [PR-Agent's overview](https://docs.pr-agent.ai/) demonstrates useful output before advanced configuration.
- [Cursor's technical-writing guidance](https://github.com/cursor/plugins/blob/bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7/pstack/skills/technical-writing/SKILL.md) distinguishes tutorials, how-to guides, reference, and explanations. Adapt its guidance, not its repository-specific requirements.

These observations came from content and navigation inspection. They are not a comparative usability study.
