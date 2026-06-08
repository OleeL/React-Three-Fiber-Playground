const { execFileSync } = require('node:child_process');

const prettierExtensions = new Set([
	'.css',
	'.html',
	'.js',
	'.json',
	'.jsx',
	'.md',
	'.scss',
	'.ts',
	'.tsx',
	'.yml',
	'.yaml',
]);

const stagedFiles = execFileSync(
	'git',
	['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
	{ encoding: 'utf8' },
)
	.split('\n')
	.map(file => file.trim())
	.filter(Boolean)
	.filter(file => prettierExtensions.has(file.match(/\.[^.]+$/)?.[0]));

if (stagedFiles.length === 0) {
	process.exit(0);
}

execFileSync('npx', ['prettier', '--write', ...stagedFiles], {
	stdio: 'inherit',
});
execFileSync('git', ['add', ...stagedFiles], { stdio: 'inherit' });
