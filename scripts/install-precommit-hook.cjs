const { existsSync, mkdirSync, writeFileSync, chmodSync } = require('node:fs');
const { join } = require('node:path');

const gitDir = join(process.cwd(), '.git');
const hooksDir = join(gitDir, 'hooks');
const hookPath = join(hooksDir, 'pre-commit');

if (!existsSync(gitDir)) {
	console.warn('Skipping pre-commit hook install: .git directory not found.');
	process.exit(0);
}

mkdirSync(hooksDir, { recursive: true });
writeFileSync(
	hookPath,
	`#!/bin/sh
node scripts/precommit-format.cjs
`,
);
chmodSync(hookPath, 0o755);
console.log('Installed pre-commit hook.');
