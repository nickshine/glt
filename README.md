# glt


[![pipeline status](https://gitlab.com/nickshine/glt/badges/master/pipeline.svg)](https://gitlab.com/nickshine/glt/commits/master)
[![coverage report](https://gitlab.com/nickshine/glt/badges/master/coverage.svg)](https://gitlab.com/nickshine/glt/commits/master)
[![npm](https://img.shields.io/npm/v/glt.svg)](https://www.npmjs.com/package/glt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

https://gitlab.com/nickshine/glt

>A command-line interface for GitLab tasks.

---

* [Install](#install)
* [Usage](#usage)
* [Tasks](#tasks)
  * [`glt ci cancel`](#glt-ci-cancel)
  * [`glt env clean`](#glt-env-clean)
  * [`glt env stop`](#glt-env-stop)
* [Examples](#examples)
  * [Cancel Redundant Pipelines From GitLab CI](#cancel-running-pipelines)  
  * [Cancel Running Pipelines](#cancel-running-pipelines)
  * [Stop Environments Older than One Week From GitLab CI](#stop-environments-older-than-one-week)
* [Contributing](#contributing)

## Install

```bash
npm install -g glt

# or
npx glt
```
## Usage

#### `glt`

```
Usage: glt [options] [command]

A cli for GitLab tasks

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  ci             perform GitLab CI tasks
  env            perform tasks on GitLab environments
  help [cmd]     display help for [cmd]
```

#### `glt ci`

```
Usage: glt-ci [options] [command]

perform GitLab CI tasks

Options:
  -h, --help  output usage information

Commands:
  cancel      cancel pipelines
  help [cmd]  display help for [cmd]

```

#### `glt env`

```
Usage: glt-env [options] [command]

perform tasks on GitLab Environments

Options:
  -h, --help  output usage information

Commands:
  clean       clean environments
  stop        stop environments
  help [cmd]  display help for [cmd]
```

## Tasks

#### `glt ci cancel`

```
➜  glt ci cancel --help

Usage: glt-ci-cancel [options]

cancel pipelines

Options:
  -u, --url <url>         GitLab instance (default: '$GITLAB_URL' || 'https://gitlab.com')
  -t, --token <token>     GitLab Personal Access Token used to authenticate with the API (default: '$GITLAB_TOKEN'|| '$CI_JOB_TOKEN')
  -v, --verbose           make the operation more talkative
  -p, --project-id <id>   GitLab project id (default: '$CI_PROJECT_ID')
  -i, --pipeline-id <id>  cancel pipelines before pipeline id <id> (default: '$CI_PIPELINE_ID')
  -b, --ref <ref>         only look at pipelines on branch <ref> (default: '$CI_COMMIT_REF_NAME' || 'master')
  -h, --help              output usage information
```

__Description:__ cancel any previously-running pipelines on the given branch.
This task is intended to be run in a GitLab CI pipeline to reference `CI_PIPELINE_ID` as the
currently running pipeline.

__Use Case:__ GitLab CI currently (as of 11.x) only has the option
to auto-cancel __pending__ non-HEAD pipelines on a branch. This task is useful
for controlling runner availability for redundant __running__ pipelines on a
branch.

#### `glt env clean`

```bash
Usage: glt-env-clean [options]

clean environments (delete environments with zero deployments)

Options:
  -u, --url <url>        GitLab instance (default: '$GITLAB_URL' || 'https://gitlab.com')
  -t, --token <token>    GitLab Personal Access Token used to authenticate with the API (default: '$GITLAB_TOKEN'|| '$CI_JOB_TOKEN')
  -v, --verbose          make the operation more talkative
  -p, --project-id <id>  GitLab project id (default: '$CI_PROJECT_ID')
  -h, --help             output usage information
```

__Description:__ remove any existing environments that are "empty"
(environments with zero deployments).

__Use Case:__ Projects that have optional pipelines configured (with a manual
play button trigger) will generate __empty environments__ for each commit pushed
that is not executed/deployed, creating lots of "empty" environments that need
to be deleted.

#### `glt env stop`

```bash
Usage: glt-env-stop [options]

stop environments with deployments older than a specified age

Options:
  -u, --url <url>        GitLab instance (default: '$GITLAB_URL' || 'https://gitlab.com')
  -t, --token <token>    GitLab Personal Access Token used to authenticate with the API (default: '$GITLAB_TOKEN'|| '$CI_JOB_TOKEN')
  -v, --verbose          make the operation more talkative
  -p, --project-id <id>  GitLab project id (default: '$CI_PROJECT_ID')
  -a, --age <age>        stop environmments with deployments older than <age> (default: "1w")
  -h, --help             output usage information
```

__Description:__ stop environments that only have deployments older than a specified age.

__Use Case:__ Projects utilizing dynamic environments via the [Gitlab Review Apps][review-apps] 
feature may need to control environment quotas by forcing an environment of a
certain age to be stopped and [cleaned up][auto-stopping-env].

## Examples

##### Cancel Redundant Pipelines From GitLab CI

In a GitLab CI pipeline, the following example will use GitLab [Predefined environment variables][predefined-vars] to cancel any redundant running pipelines before executing tests. Running pipelines older than `CI_PIPELINE_ID` on project `CI_PROJECT_ID` for the the current branch `CI_COMMIT_REF_NAME` will be canceled using a provided [Personal Access Token][access-tokens] set on environment variable `GITLAB_TOKEN`.

```yaml
image: node:10

stages:
  - test

variables:
  GITLAB_TOKEN: $ACCESS_TOKEN       # ACCESS_TOKEN stored in project env vars

test:
  stage: test
  script:
    - npx glt ci cancel -v
    - npm install
    - npm run test
```

##### Cancel Running Pipelines

This example cancels all running pipelines on a branch `my-branch` for a project
at https://gitlab.com. This is run outside of a GitLab CI pipeline, using the
command-line flags:

```bash

TOKEN=<personal access token>
PROJECT_ID=<project id from gitlab.com>


npm install -g glt

glt ci cancel -t $TOKEN -p $PROJECT_ID -b my-branch -v

```

##### Stop Environments Older than One Week From GitLab CI

In a GitLab CI pipeline, the following example will stop environments with no
deployments younger than 1 week old on project `CI_PROJECT_ID` using a provided
[Personal Access Token][access-tokens] set on environment variable `GITLAB_TOKEN`.

```yaml
image: node:10

stages:
  - test

variables:
  GITLAB_TOKEN: $ACCESS_TOKEN       # ACCESS_TOKEN stored in project env vars

deploy:
  stage: deploy
  script:
    - npx glt env stop -a 1w
    - kubectl apply -f deployment.yaml
```

## Contributing

Contributions are welcome! Help add tasks to `glt`! See the [Contributing Guide](CONTRIBUTING.md).

[predefined-vars]:https://docs.gitlab.com/ee/ci/variables/#predefined-environment-variables
[access-tokens]:https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html
[review-apps]:https://docs.gitlab.com/ee/ci/review_apps/
[auto-stopping-env]:https://docs.gitlab.com/ee/ci/environments.html#automatically-stopping-an-environment
