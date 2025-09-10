# RELEASE

## Versioning

Software Templates has three kinds of releases: `v[major].[minor].[patch]`.

**Minor** releases are planned and will typically include minor bug fixes, security patches, regular feature changes, and prior **Patch** changes on the previous minor. RHDH version updates / changes would be considered regular feature changes.

**Patch** releases only happen if a release has to be cut outside the normal release schedule and should only include critical bug fixes and critical security patches which do not break the current release. These are tied to the last **Minor**  release and are strongly recommended to end users on the same **Minor**  version to update when these releases are available.

**Major** releases happen when changes towards the templates could be incompatible with RHDH, GitOps service, Pipelines service, or the target cluster. Typically major releases will include breaking features or changes with no guarantee of compatibility (usually part of a milestone) and changes from previous **Minor**  and **Patch** releases.

## Schedule

Ad hoc for now.

### RHDH Releases

New releases of RHDH would trigger the effort of updating and making the necessary changes to support that new version of RHDH, when all migration changes are completed a new minor release of the components included in these changes will be cut.

## Changes

Release changes will consist of the merged PRs since the previous release.

### Noteworthy changes

Noteworthy changes should have the following criteria:
- Features should only include changes which directly impacts the user
- Bug Fixes should include changes reported by the team or outside the team
- Security Patches should include all changes
- Documentation should highlight additions of note

Changes within PRs can be highlighted as well with the PR as a base change.

## Release Separation

When **Major** & **Minor** releases happen there needs to be separation between the previous release and new release. In addition to tagging, we will also use multiple branches to track the states of the currently maintained major/minor releases.

## Checklist

> **Note**: Follow this checklist for any of the following repositories:
> - [redhat-ai-dev/ai-lab-app](https://github.com/redhat-ai-dev/ai-lab-app)
> - [redhat-ai-dev/ai-lab-samples](https://github.com/redhat-ai-dev/ai-lab-samples)
> - [redhat-ai-dev/rhdh-pipelines](https://github.com/redhat-ai-dev/rhdh-pipelines)
> - [redhat-ai-dev/ai-lab-template](https://github.com/redhat-ai-dev/ai-lab-template)
> - [redhat-ai-dev/ai-rhdh-installer](https://github.com/redhat-ai-dev/ai-rhdh-installer)
> 
> **Note**: If any of the following has a release there must be the same kind of release for [redhat-ai-dev/ai-lab-template](https://github.com/redhat-ai-dev/ai-lab-template):
> - [redhat-ai-dev/ai-lab-app](https://github.com/redhat-ai-dev/ai-lab-app)
> - [redhat-ai-dev/ai-lab-samples](https://github.com/redhat-ai-dev/ai-lab-samples)
> - [redhat-ai-dev/rhdh-pipelines](https://github.com/redhat-ai-dev/rhdh-pipelines)
> 
> **Note**: If there is a major or minor release of [redhat-ai-dev/ai-lab-template](https://github.com/redhat-ai-dev/ai-lab-template), the same kind of release must be created for [redhat-ai-dev/ai-rhdh-installer](https://github.com/redhat-ai-dev/ai-rhdh-installer).

- [ ] Create a new fork branch v[major].[minor].[patch] from main or the corresponding previous release branch.
  - Note: Target this branch for each repository for the following steps
- [ ] Prepare release changes

> **Software Templates** (release changes)
> 
> - Set the following to the release tag under the [properties](../properties) file
>   - PIPELINE_BRANCH
>   - SAMPLE_BRANCH
>   - GITOPS_BRANCH
> - Set the pipelinesascode.tekton.dev properties under [docker pull request](../skeleton/source-repo/.tekton/docker-pull-request.yaml) and [docker push](../skeleton/source-repo/.tekton/docker-push.yaml) tekton configs under the skeleton to reference the release tag instead of the main branch
> - Run generate.sh to apply the changes to all of the templates

> **RHDH Installer** (release changes)
> 
> - Set the [version field under the helm chart](https://github.com/redhat-ai-dev/ai-rhdh-installer/blob/main/chart/Chart.yaml) of the RHDH Installer
> - Update [catalog reference](https://github.com/redhat-ai-dev/ai-rhdh-installer/blob/main/catalogs.yaml) to point to the target Software Template release branch

- [ ] Create commit for the above release changes and push into your fork branch
- [ ] Create new PR from your fork branch targeting the new release branch release-v[major].[minor].x
- [ ] Follow release testing [checklist](https://docs.google.com/document/d/1v3G5R_1zf6Yfc1u5NHGNYbhRvYiWJYFI_JR-kpyR-uM/edit?tab=t.0#heading=h.73iqyy3e9ozp)
- [ ] Rebase your fork branch from main if changes are done
- [ ] Merge changes from PR when everything checks out
- [ ] Create release under GitHub repository, generate [release notes](#release-notes)
- [ ] For a Major/Minor release, announce version release on Slack channels and mailing lists using [templates](#release-announcement-template):
  - Slack channels
    - #forum-rhdh-plugins-and-ai
  - Mailing Lists
    - dev-ai
    - team-devfile@redhat.com

## Release Notes

Utilize the GitHub Release section changelog feature to generate release notes. You will have to click on the button and select the previous release to compare it to. As an example, check out the release v0.9.1 on the Templates repository.

## Release Announcement Template

Please refer to the Google Doc in the Team Drive under Software Templates directory.
