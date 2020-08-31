# Contributing to License Text Normalizer

## Before you begin

* Please read our [Code of Conduct](CODE-OF-CONDUCT.md) and [License](LICENSE).
* When possible, identify an existing issue or create a new one prior to submitting a PR: https://github.com/quic/license-text-normalizer-js/issues.

## Quick-start Guide

### Commands

* `yarn install`
* `yarn test`
* `yarn test --coverage`
* `yarn build`
* `yarn lint`
* `yarn lint-and-fix`

### Sample Workflow

1. Fork https://github.com/quic/license-text-normalizer-js

1. Clone your fork e.g.

    ```bash
    git clone https://github.com/<username>/license-text-normalizer-js.git
    ```

1. Use topic branches for feature development. Create an upstream `remote` to make it easier to keep your branches up-to-date:

    ```bash
    git remote add upstream https://github.com/quic/license-text-normalizer-js.git
    ```

1. Install dependencies

    ```bash
    yarn install
    ```

1. Make your changes, run the tests

    ```bash
    yarn test
    yarn lint-and-fix
    ```

1. Commit your changes using the [DCO](http://developercertificate.org/). You can attest to the DCO by committing with the **-s** or **--signoff** options, e.g.

    ```bash
    git commit -s
    ```

1. After committing your changes on your topic branch, sync it with `upstream/master` to ensure you have the latest:

    ```bash
    git pull --rebase upstream master
    ```

1. Push the branch to your fork and then submit a PR at https://github.com/quic/license-text-normalizer-js

    ```bash
    git push -u origin <your-topic-branch>
    ```

    The `-u` is shorthand for `--set-upstream`. This will set up the tracking reference so subsequent runs of `git push` or `git pull` can omit the remote and branch.

## Guidelines

* Follow the existing code style when possible
* Add or update unit tests as necessary
* Keep PRs small and focused
* Write a [good commit message](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
* Every commit must be signed-off with the [Developer Certificate of Origin](https://developercertificate.org/) (by adding the -s option to your git commit command, e.g. `git commit -s`). This adds a line at the end of your commit, e.g. "Signed-off-by: Your Name <your@email.com>", which certifies that you wrote or otherwise have the right to submit the contribution.

## Releasing

Release instructions for maintainers:

* Update version in package.json, push to master
* Create a release/tag in GitHub
* `npm login`
* `npm publish`
