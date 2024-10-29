const fs = require('fs');
const path = require('path');

const postsDir = './site/posts';

fs.readdir(postsDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.endsWith('.markdown')) {
            const oldPath = path.join(postsDir, file);
            const newPath = path.join(postsDir, file.replace('.markdown', '.md'));
            
            fs.rename(oldPath, newPath, err => {
                if (err) {
                    console.error(`Error renaming ${file}:`, err);
                } else {
                    console.log(`Renamed ${file} to ${file.replace('.markdown', '.md')}`);
                }
            });
        }
    });
});