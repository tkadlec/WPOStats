const fs = require('fs').promises;
const path = require('path');

async function addPermalinks() {
    const postsDir = path.join(__dirname, 'site', 'posts');
    
    try {
        const files = await fs.readdir(postsDir);
        
        for (const file of files) {
            if (file.endsWith('.md')) {
                const filePath = path.join(postsDir, file);
                let content = await fs.readFile(filePath, 'utf8');
                
                // Check if permalink already exists
                if (!content.includes('permalink:')) {
                    // Find the end of the frontmatter (marked by ---)
                    const frontmatterEnd = content.indexOf('---', 3);
                    if (frontmatterEnd !== -1) {
                        // Insert permalink before the closing ---
                        const newContent = content.slice(0, frontmatterEnd) +
                            `permalink: "/{{ page.date | date: '%Y/%m/%d' }}/{{ page.fileSlug }}/"\n` +
                            content.slice(frontmatterEnd);
                        
                        await fs.writeFile(filePath, newContent);
                        console.log(`Added permalink to ${file}`);
                    }
                } else {
                    console.log(`Skipping ${file} - permalink already exists`);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

addPermalinks();