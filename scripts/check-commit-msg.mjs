import { readFile } from 'node:fs/promises';
import { conventionalPattern } from './validate-pr.mjs';

const file = process.argv[2];
if (!file) throw new Error('Usage: node scripts/check-commit-msg.mjs <commit-msg-file>');
const subject = (await readFile(file, 'utf8')).split(/\r?\n/, 1)[0];

// Let git's own generated messages through; they never reach main because PRs are squash-merged.
if (/^(Merge|Revert|fixup!|squash!) /.test(subject)) process.exit(0);

if (!conventionalPattern.test(subject)) {
  console.error(`commit-msg: "${subject}" is not a Conventional Commit.`);
  console.error('Use "type: description" or "type(scope): description".');
  console.error('Types: feat, fix, docs, content, refactor, style, test, chore, ci, perf, build.');
  process.exit(1);
}
