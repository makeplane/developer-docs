# Contribution Guide

Thank you for considering contributing to the Plane developer documentation!
Your contributions help improve the quality and accessibility of our
documentation for all users. Please follow the guidelines outlined below to
ensure a smooth contribution process.

## 1. Create a new issue

If you encounter a problem or wish to suggest an improvement in the
documentation that hasn't been addressed yet, please create a [new issue](https://github.com/makeplane/developer-docs/issues/new). Be sure
to check existing [issues](https://github.com/makeplane/developer-docs/issues) to avoid duplication. Include a clear description of
the problem or enhancement you're suggesting.

## 2. Contributing

To contribute your changes, you have two options:

1. Edit the files directly on Github
   - Perfect for small, single-file changes. This is the easiest option but you
     won't be able quickly iterate on your changes with a running server.
1. Run this site locally
   - Excellent for any size of change.

## Option 1 - Edit on Github

1. While viewing our docs on [developers.plane.so](https://developers.plane.so), navigate to the page you want to change. Scroll to the bottom and click the 'Edit this page' link.
2. If prompted, click the 'Fork this repository' button
3. Make your edits
4. Click the 'Commit changes' button
5. Fill out the form, making sure the 'Commit message' is short and meaningful.
   In the 'Extended description' field, be sure to reference the related issue
   using GitHub's syntax (`#123`). This links your Pull Request to the
   issue and helps us understand your reason for the changes.
6. Click 'Propose changes'
7. Click the 'Create pull request' button

## Option 2 - Edit locally

Follow these steps to run this site and make your changes locally.

### 1. Clone this repository

```bash
git clone git@github.com:makeplane/developer-docs.git && cd developer-docs
```

### 2. Create a new branch

Before making any changes, create a new branch from the `main` branch. This
branch will contain your proposed changes and keep the `main` branch clean for
stable releases.

```bash
git checkout main
git pull origin main
git checkout -b <branch-name>
```

Next, install the dependencies.

```bash
corepack enable pnpm
pnpm install
```

### 3. Run the site locally

Start up a local development server so you can preview your changes before submitting them for review.

```bash
pnpm dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

#### About this site

This site is built using [Docusaurus](https://docusaurus.io/), an open source
static website generator along with
[docusaurus-openapi-docs](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs).

To find out which directories are served at which routes, [read this](https://docusaurus.io/docs/next/advanced/routing).

### 4. Make changes

Open the relevant documentation file and make your changes. Using your local
browser, review that your changes look as you expect and they align with our
current styles and tone across the documentation.

**Warning**: All files in `docs/api/*` are auto-generated. Do not edit by hand.

### 5. Commit your changes

When committing your changes, leave a clear and concise message that links to
the corresponding issue (if applicable) and explains the fix or enhancement
you've made.

```bash
git add .
git commit -m "Fixes #<issue-number>: Description of the fix or enhancement"
```

### 6. Link the Issue to the Pull Request

In your pull request description, be sure to reference the related issue using GitHub's syntax (`#<issue-number>`). This links the PR to the issue and helps maintain context.

### 7. Sign the Contributor License Agreement (CLA)

Before we can merge your contribution, you must sign our contributor license agreement (CLA). This agreement ensures that your contributions comply with our licensing terms.

### 8. Reviews

Once your Pull Request is submitted, a member of our team will be assigned to review your changes. They will provide feedback and may request revisions if necessary. Please respond promptly to any review comments to expedite the review and acceptance process.

## Thank you!

Thank you for contributing to our documentation! We greatly appreciate your efforts to help improve the Plane community.
