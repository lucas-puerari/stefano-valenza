import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePullRequest } from './validate-pr.mjs';

const body = `## Summary

Add a review to the site.

## Type of change

- [x] Content
- [ ] Feature
- [ ] Fix
- [ ] Maintenance

## Verification

Ran npm run check and npm run build.

## Publishing notes

No new images.
`;
const valid = { branch: 'content/new-review', title: 'content: add a review', body, commits: ['content: add a review\n\nMore detail.'] };

test('accepts a conventional PR with a completed template', () => {
  assert.deepEqual(validatePullRequest(valid), []);
});

test('rejects non-semantic branches, titles, and commits', () => {
  const errors = validatePullRequest({ ...valid, branch: 'my-branch', title: 'New article', commits: ['Add article'] });
  assert.equal(errors.length, 3);
});

test('requires template content, not just placeholders or empty checkboxes', () => {
  const errors = validatePullRequest({
    ...valid,
    body: body.replace('Add a review to the site.', '<!-- Describe what changed and why. -->')
      .replace('- [x] Content', '- [ ] Content')
      .replace('Ran npm run check and npm run build.', '<!-- Fill in later. -->'),
  });
  assert.equal(errors.length, 3);
});

test('requires all four template headings', () => {
  const errors = validatePullRequest({ ...valid, body: body.replace('## Publishing notes', '## Notes') });
  assert.ok(errors.some((error) => error.includes('Publishing notes')));
});
