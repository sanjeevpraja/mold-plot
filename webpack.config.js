const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const fs = require('fs');
const glob = require('glob');


const blockEntries = glob.sync('./src/**/block.json').reduce((entries, blockJsonPath) => {
	const blockDir = path.dirname(blockJsonPath);
	const name = path.relative('./src', blockDir).replace(/\\/g, '/'); // e.g., block-one

	const editorScriptPath = path.resolve(blockDir, 'index.js');
	if (fs.existsSync(editorScriptPath)) {
		entries[`${name}/index`] = editorScriptPath;
	}

	const frontendScriptPath = path.resolve(blockDir, 'frontend.js');
	if (fs.existsSync(frontendScriptPath)) {
		entries[`${name}/frontend`] = frontendScriptPath;
	}

	const editorStylePath = path.resolve(blockDir, 'editor.scss');
	if (fs.existsSync(editorStylePath)) {
		entries[`${name}/editor`] = editorStylePath;
	}

	const stylePath = path.resolve(blockDir, 'style.scss');
	if (fs.existsSync(stylePath)) {
		entries[`${name}/style`] = stylePath;
	}

	return entries;
}, {});

// filter
const filterEntries = glob.sync('./src/addfilter/**/index.js');
for (const filterEntryPath of filterEntries) {
	try {
			const blockDir = path.dirname(filterEntryPath);
			const name = path.relative('./src/addfilter', blockDir).replace(/\\/g, '/');

			// Add main entry
			blockEntries[`${name}/index`] = path.resolve(blockDir, 'index.js');

			// Add editor style if exists
			const editorStylePath = path.resolve(blockDir, 'editor.scss');
			if (fs.existsSync(editorStylePath)) {
					blockEntries[`${name}/editor`] = editorStylePath;
			}

			// Add frontend style if exists
			const stylePath = path.resolve(blockDir, 'style.scss');
			if (fs.existsSync(stylePath)) {
					blockEntries[`${name}/style`] = stylePath;
			}
	} catch (error) {
			console.error(`Error processing block at ${filterEntryPath}:`, error);
	}
}

// Optional: Add global SCSS
blockEntries['styles/global'] = path.resolve(__dirname, 'src/styles/global.scss');
blockEntries['styles/global-editor'] = path.resolve(__dirname, 'src/styles/global-editor.scss');

module.exports = {
	...defaultConfig,
	entry: blockEntries,
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js',
	}
};