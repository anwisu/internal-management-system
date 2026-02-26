import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('slate-')) {
        const newContent = content.replace(/slate-/g, 'blue-gray-');
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
        changedFiles++;
    }
});

console.log(`\nSuccessfully updated ${changedFiles} files replacing 'slate-' with 'blue-gray-'.`);
