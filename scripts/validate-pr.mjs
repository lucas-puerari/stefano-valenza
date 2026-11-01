import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const branchPattern = /^(feat|fix|docs|content|refactor|style|test|chore|ci|perf|build)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const conventionalPattern = /^(feat|fix|docs|content|refactor|style|test|chore|ci|perf|build)(\([a-z0-9]+(?:-[a-z0-9]+)*\))?!?: .{3,}$/;

function section(body, heading) {
  const match = body.match(new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm'));
  return match?.[1]?.replace(/<!--[^]*?-->/g, '').trim() ?? '';
}

export function validatePullRequest({ branch, title, body, commits }) {
  const errors = [];
  if (!branchPattern.test(branch)) errors.push(`Branch "${branch}" must be type/short-slug (e.g. content/new-review).`);
  if (!conventionalPattern.test(title)) errors.push(`PR title "${title}" must follow Conventional Commits (e.g. content: add a review).`);
  if (!Array.isArray(commits) || commits.length === 0) errors.push('The PR must contain at least one commit.');
  for (const message of commits ?? []) {
    const subject = message.split(/\r?\n/, 1)[0];
    if (!conventionalPattern.test(subject)) errors.push(`Commit "${subject}" must follow Conventional Commits.`);
  }
  for (const heading of ['Summary', 'Type of change', 'Verification', 'Publishing notes']) {
    if (!new RegExp(`^## ${heading}\\s*$`, 'm').test(body)) errors.push(`PR description must include "## ${heading}".`);
  }
  if (!section(body, 'Summary')) errors.push('Fill in the Summary section of the PR template.');
  if (!section(body, 'Verification')) errors.push('Fill in the Verification section of the PR template.');
  if (!/^\s*- \[[xX]\] (Content|Feature|Fix|Maintenance)\s*$/m.test(section(body, 'Type of change'))) {
    errors.push('Check at least one Type of change box in the PR template.');
  }
  return errors;
}

async function fetchCommits(repository, number, token) {
  const commits = [];
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/repos/${repository}/pulls/${number}/commits?per_page=100&page=${page}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!response.ok) throw new Error(`Unable to list PR commits: HTTP ${response.status}`);
    const batch = await response.json();
    commits.push(...batch.map(({ commit }) => commit.message));
    if (batch.length < 100) return commits;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { GITHUB_EVENT_PATH, GITHUB_REPOSITORY, GH_TOKEN } = process.env;
  if (!GITHUB_EVENT_PATH || !GITHUB_REPOSITORY || !GH_TOKEN) throw new Error('Missing GitHub Actions event, repository, or token.');
  const { pull_request: pr, number } = JSON.parse(await readFile(GITHUB_EVENT_PATH, 'utf8'));
  if (!pr || !number) throw new Error('This check requires a pull_request event.');
  const commits = await fetchCommits(GITHUB_REPOSITORY, number, GH_TOKEN);
  const errors = validatePullRequest({ branch: pr.head.ref, title: pr.title, body: pr.body ?? '', commits });
  for (const error of errors) console.error(`::error::${error}`);
  if (errors.length) process.exitCode = 1;
  else console.log(`PR convention check passed (${commits.length} commit(s)).`);
}
