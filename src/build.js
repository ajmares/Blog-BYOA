const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Ensure public directory exists
fs.ensureDirSync('public');
fs.ensureDirSync('public/css');
fs.ensureDirSync('public/js');

// Read template
const template = fs.readFileSync('src/template.html', 'utf8');

// Function to process a directory of markdown files
function processDirectory(dir, outputDir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        // Skip index.md
        if (file === 'index.md') {
            return;
        }
        
        if (file.endsWith('.md')) {
            const markdown = fs.readFileSync(path.join(dir, file), 'utf8');
            const html = marked(markdown);
            
            // Get title from first h1 or filename
            const titleMatch = markdown.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');
            
            // Replace template variables
            const page = template
                .replace('{{title}}', title)
                .replace('{{content}}', html);
            
            // Create output directory if it doesn't exist
            fs.ensureDirSync(outputDir);
            
            // Write HTML file
            const outputFile = path.join(outputDir, path.basename(file, '.md') + '.html');
            fs.writeFileSync(outputFile, page);
        }
    });
}

// Process all content directories
processDirectory('pages', 'public');
processDirectory('pages/blog', 'public/blog');
processDirectory('pages/about', 'public/about');
processDirectory('pages/faq', 'public/faq');

console.log('Build complete!'); 