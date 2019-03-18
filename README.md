# glt

https://gitlab.com/nickshine/glt

>A command-line interface for GitLab tasks.

## Usage

```bash
npm install -g glt
glt --help

# or
npx glt --help
```

### Commands

#### `glt`

```
Usage: glt [options] [command]

A cli for GitLab tasks

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  ci             perform GitLab CI tasks
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

#### `glt ci cancel `

```
➜  glt ci cancel --help

Usage: glt-ci-cancel [options]

cancel pipelines

Options:
  -u, --url <url>         GitLab instance (default: '$GITLAB_URL' || 'http://gitlab.com')
  -t, --token <token>     GitLab Personal Access Token used to authenticate with the API (default: '$GITLAB_TOKEN'|| '$CI_JOB_TOKEN')
  -v, --verbose           make the operation more talkative
  -p, --project-id <id>   GitLab project id (default: '$CI_PROJECT_ID')
  -i, --pipeline-id <id>  cancel pipelines before pipeline id <id> (default: '$CI_PROJECT_ID')
  -b, --ref <ref>         only look at pipelines on branch <ref> (default: '$CI_COMMIT_REF_NAME' || 'master')
  -h, --help              output usage information
```



