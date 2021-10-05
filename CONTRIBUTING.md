# Introduction

Thanks for your interest in contributing! This repository is free open
source and as such dependent on your contributions. These guidelines should help
you get started more quickly and should ensure a smooth contribution process for
both those contributing and those reviewing contributions. Please read them
thoroughly before contributing with a Pull Request, and at least skim them before adding an issue.

We are open to all kinds of contributions as long as you follow our
[Code of Conduct](./CODE_OF_CONDUCT.md). For very specific use case it might make more sense
though to create your own repository instead of adding to this one.

# How to ask for help

At the moment, it is totally fine to open an issue if you have any questions.
This might change though depending on the time needed to answer. Although,
please note that this is free and open source software and there is no
guarantees on any kind of support from our side.

# How to report a bug

**IMPORTANT!**

If you find a security vulnerability, do NOT open an issue. Email
[daniel@bartholomae.name](mailto:daniel@bartholomae.name&subject=Security%20vulnerability%20in%20repo)
instead. This reduces the risk of criminals getting aware and exploiting the
vulnerability before we got a chance to fix it.

In order to determine whether you are dealing with a security issue, ask yourself these two questions:
* Can I access something that's not mine, or something I shouldn't have access to?
* Can I disable something for other people?

If the answer to either of those two questions are "yes", then you're probably dealing with a security issue.
Note that even if you answer "no" to both questions, you may still be dealing with a security issue, so if you're
unsure, just email us at [daniel@bartholomae.name](mailto:daniel@bartholomae.name&subject=Security%20vulnerability%20in%20repo).

If the bug is not security related, please use the corresponding issue template
to submit it on GitHub.

# How to request a feature

Please use the corresponding issue template to submit your idea on GitHub. Given
that this repo is a free open source project, chances of your idea
coming into fruition are much higher if you are also willing to contribute a PR.
Please first open the issue, though, so we can discuss the feature before you
have to spend time on it.

# How to create a PR

## License

Any contributions you make will be under the MIT Software License. In short,
when you submit code changes, your submissions are understood to be under the
same [MIT License](./LICENSE) that covers the project. Feel free to contact the maintainers
if that's a concern.

## Rules

We strongly recommend to first open an issue discussing the contribution before
creating a PR, unless you are really sure that the contribution does not need
discussion (e. g. fixing a typo in documentation).

We expect every contributor to adhere to our
[Code of Conduct](./CODE_OF_CONDUCT.md). Additionally, please note that we can
only merge a PR if:
* Commit messages follow [Conventional Commits guidelines](https://www.conventionalcommits.org/en/v1.0.0/)
  with scopes being limited to the names of the individual packages
  (e. g. `feat(compose): add typing for more than 6 parameters`)
* The code is following our linting guidelines as defined via ESLint rules in
  each project (run `npm lint` to check)
* All tests pass, and the code has 100% test coverage (run `npm test` to check).
  If it does not make sense to cover a certain line of code, you can use
  a `/* istanbul ignore next */` comment.
* Bigger changes and new features are covered by an integration test.
* All relevant documentation is updated. Usually this means updating the JSDoc of the code you work on.
  README and docs/ folder will be automatically built.
* Additional dependencies are only added with a good reason.
* Code was reviewed by one of our regular contributors, taking into
  consideration code readability, security and whether the addition aligns with
  the long-term roadmap.

## Set up instructions

First please [fork this repository](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)
to be able to contribute any changes.

The code in this codebase is managed by [Git](https://git-scm.com/) for version
control [NodeJS](https://nodejs.org/en/) for running scripts, and [pnpm](https://pnpm.js.org/)
as package manager. Everything *has* to be installed globally to work with the
repository.

We recommend to read up on tools you are unfamiliar with.

After all tools are installed, please run `pnpm install` to install all
dependencies and then `pnpm test` and `pnpm run build` to ensure that everything is set up correctly.

Now you can create a new branch describing the change you are about to make,
e. g. `fix_typo_in_documentation`, and start coding.

## Your First Contribution

If you are interested in contributing, but don't have a specific issue at heart,
we would recommend looking through the issues labelled "help wanted".

If you are new to contributing to open source, we recommend to have a look at
a [free tutorial](http://makeapullrequest.com/) for this. Issues labelled "good first issue"
are meant specifically to get started in the repository.

If you are stuck at any point, feel free to comment in the issue you chose. We
try to be as helpful to newcomers as possible and you don't have to be afraid of
dumb questions.
