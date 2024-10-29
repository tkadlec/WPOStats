const CleanCSS = require('clean-css');

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
		console.log("Found posts:", posts.length);
		posts.forEach(post => {
			console.log("Post path:", post.inputPath);
		});
		return posts;
	});

	return {
		dir: { input: 'site', output: 'dist', includes: '_includes' },
		passthroughFileCopy: true
	};
};