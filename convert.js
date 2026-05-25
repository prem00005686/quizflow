const fs = require('fs');
const path = require('path');

function htmlToJsx(html) {
    // Extract body inner
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let content = bodyMatch ? bodyMatch[1] : html;

    // Strip out script tags and their content
    content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

    // Basic attributes
    content = content.replace(/class=/g, 'className=')
                     .replace(/for=/g, 'htmlFor=')
                     .replace(/tabindex=/g, 'tabIndex=')
                     .replace(/viewbox=/g, 'viewBox=');

    // SVG and other attributes
    const svgAttrs = [
        'clip-path', 'clip-rule', 'fill-rule', 'fill-opacity', 
        'stroke-linecap', 'stroke-linejoin', 'stroke-width', 
        'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity'
    ];
    svgAttrs.forEach(attr => {
        const camel = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
        content = content.replace(new RegExp(attr + '=', 'g'), camel + '=');
    });

    // Self closing tags (basic regex - may not cover all edge cases but covers most generated HTML)
    const voidTags = ['img', 'input', 'br', 'hr', 'path', 'circle', 'line', 'polygon', 'rect', 'use'];
    voidTags.forEach(tag => {
        // Find tags that and ensure they self-close if they don't already have />
        // Note: this regex ensures we match <tag ... > and replaces with <tag ... />
        const tagRegex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
        content = content.replace(tagRegex, `<${tag}$1 />`);
        
        // Remove rogue closing tags like </input> or </img>
        const closeTagRegex = new RegExp(`</${tag}>`, 'gi');
        content = content.replace(closeTagRegex, '');
    });

    // Inline Styles
    content = content.replace(/style="([^"]*)"/g, (match, styles) => {
        const styleObj = styles.split(';').filter(Boolean).map(s => {
            let idx = s.indexOf(':');
            if (idx === -1) return '';
            let key = s.slice(0, idx).trim();
            let value = s.slice(idx + 1).trim();
            if (!key) return '';
            
            let finalKey;
            if (key.startsWith('--')) {
                // CSS Custom properties must be quoted
                finalKey = `'${key}'`;
            } else {
                finalKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
            }
            return `${finalKey}: '${value.replace(/'/g, "\\'")}'`;
        }).filter(Boolean).join(', ');
        return `style={{ ${styleObj} }}`;
    });

    // Replace HTML comments
    content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    return content;
}

const templates = [
    { file: 'quizflow-premium-mcq-learning-platform.html', page: 'frontend/src/pages/HomePage.jsx', name: 'HomePage' },
    { file: 'student-dashboard.html', page: 'frontend/src/pages/DashboardPage.jsx', name: 'DashboardPage' },
    { file: 'mock-test-42.html', page: 'frontend/src/pages/TestPage.jsx', name: 'TestPage' },
    { file: 'test-results-analysis.html', page: 'frontend/src/pages/ResultsPage.jsx', name: 'ResultsPage' }
];

let successCount = 0;
for (const t of templates) {
    try {
        const raw = fs.readFileSync(path.join('stitch-downloads', t.file), 'utf-8');
        const jsx = htmlToJsx(raw);
        
        const componentCode = `import React from 'react';\n\nexport default function ${t.name}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
        
        fs.mkdirSync(path.dirname(t.page), { recursive: true });
        fs.writeFileSync(t.page, componentCode);
        console.log('✅ Generated:', t.page);
        successCount++;
    } catch (e) {
        console.error(`❌ Failed on ${t.file}:`, e.message);
    }
}
console.log(`\nFinished: ${successCount} files written.`);