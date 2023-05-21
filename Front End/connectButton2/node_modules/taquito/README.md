# Git Repository Status Tools

## A collection of Git Tools for Mozu Development


Override configs by creating ``config/local.json``


*TODO: BCRIPPS DOCUMENTATION*

## Commands

### Check Merges

```bash
$ taquito checkMerges --source 1.17
```

Checks to see if a the `--source` branch has been merged into the `--target` branch. The default values for `--source` and `--target` are `master`.

![Image of Merge Checks]
(https://s3-us-west-2.amazonaws.com/taquito/taquito-merges.png)

### Deploys
```bash
$ taquito deploys
```

![Image of Deploys]
(https://s3-us-west-2.amazonaws.com/taquito/taquito-deploys.png)

### Releases

```bash
$ taquito releases --repos SiteBuilder
```

Requires one repository name to be specified.

![Image of Releases]
(https://s3-us-west-2.amazonaws.com/taquito/taquito-releases.png)