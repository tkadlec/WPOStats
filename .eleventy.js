const CleanCSS = require('clean-css');
const generateSearchIndex = require('./_11ty/generate-search-index');

module.exports = function(config) {
	config.addPassthroughCopy('site/img');
	config.addPassthroughCopy('site/fonts');
	config.addPassthroughCopy('site/sw.js');
	config.addPassthroughCopy('site/manifest.json');

	config.addFilter('cssmin', function(code) {
		return new CleanCSS({}).minify(code).styles;
	});

	let markdownIt = require("markdown-it");
	let markdownItDefList = require("markdown-it-deflist");
	let options = {
	  html: true,
	  linkify: true,
	  breaks: true
	};
	let markdownLib = markdownIt(options).use(markdownItDefList);
	
	config.setLibrary("md", markdownLib);

	config.addShortcode("year", () => `${new Date().getFullYear()}`);

	config.addCollection("posts", function(collection) {
		const posts = collection.getFilteredByGlob([
			"site/posts/**/*.md",
		]);
		posts.forEach(post => {
				const date = new Date(post.data.date);
				post.data.permalink = `/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${post.fileSlug}/`;
		});

		return posts;
	});

	config.addCollection("tagList", function(collection) {
		const tagsSet = new Set();
		collection.getAll().forEach(item => {
			if (!item.data.tags) return;
			const tags = Array.isArray(item.data.tags) ? item.data.tags : item.data.tags.split(',');
			tags.forEach(tag => {
				const trimmedTag = tag.trim();
				if (trimmedTag) {
					tagsSet.add(trimmedTag);
					console.log('Added tag:', trimmedTag);
				}
			});
		});
		const sortedTags = Array.from(tagsSet).sort();
		console.log('All tags:', sortedTags);
		return sortedTags;
	});

	config.addCollection("searchIndex", async function(collection) {
		return await generateSearchIndex(collection.getAll());
	});

	// Add global data
	config.addGlobalData("localhost", process.argv.includes("--serve"));

	return {
		dir: { input: 'site', output: 'dist', includes: '_includes' },
		passthroughFileCopy: true
	};
};