# Your first useful request

Start with a read-only task. This checks that you can find the right guidance without turning your first exercise into a repository change.

## Before you start

Complete the [reviewed installation](/guide/install) and open the harness in its reported workspace. For this exercise, select `asd-ste100-technical` if it fits the project, and confirm that the harness can discover its installed instructions. You also need a short technical explanation or a project procedure to review.

Do not install another skill automatically if the exercise's guidance is absent. Return to the approved setup process.

## Make one bounded request

Ask the agent in plain language:

```text
Use asd-ste100-technical to review this procedure for a new developer.
Keep commands, identifiers, conditions, risks, and uncertainty unchanged.
Suggest a clearer version in the conversation. Do not edit files or run commands.
```

Provide the text after that request. A named skill in a prompt is not a shell command or proof that the harness loaded it. Check the harness's resource view or the agent's explicit source acknowledgement.

## Check the result

You should get a clearer draft that keeps the technical meaning. Check that it:

- States prerequisites before the action that needs them.
- Uses exact commands and stable terminology.
- Preserves warnings, constraints, and unknowns.
- Does not claim an unexecuted command passed.
- Does not change repository files or start a later phase.

If the draft invents facts or drops a condition, ask for a correction against the original text. A readable answer alone does not prove factual accuracy or model compliance.

## Choose a next step only if needed

- Need to update a real developer task? Try [maintain task-based docs](/workflows/maintain-task-based-docs) under the project's write rules.
- Need evidence instead of an editing pass? Try [research a decision](/workflows/research-a-decision), resolving its required `grilling` instructions first.
- Already have approved code work? Try [implement a small change](/workflows/implement-a-small-change).

Stopping after the read-only exercise is a complete outcome. Installation checks, this agent walkthrough, and actual human usability testing are different kinds of evidence.
