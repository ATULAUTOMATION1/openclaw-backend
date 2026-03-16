import fs from 'fs';
import path from 'path';

// Since Atul Automation is a Next.js app, we will generate raw Markdown files
// that can be picked up by the main website's blog renderer (like Contentlayer or dynamic routing).
export async function postToBlogCMS(title: string, markdownContent: string) {
    console.log(`[Blog CMS Interface] Formatting new blog post: "${title}"`);

    // Create a SEO friendly URL slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const date = new Date().toISOString().split('T')[0];
    
    // Frontmatter formatting
    const fileContent = `---
title: "${title}"
date: "${date}"
author: "Atul Automation AI"
slug: "${slug}"
---

${markdownContent}
`;

    // Define the output directory (in a real scenario, this might push directly to a GitHub repo via API or a database)
    const blogDir = path.join(process.cwd(), 'generated_blogs');
    
    try {
        if (!fs.existsSync(blogDir)) {
            fs.mkdirSync(blogDir, { recursive: true });
        }
        
        const filePath = path.join(blogDir, `${slug}.md`);
        fs.writeFileSync(filePath, fileContent, 'utf8');
        
        console.log(`✅ Successfully saved blog post to: ${filePath}`);
        return { success: true, filePath, slug };
    } catch (error: any) {
        console.error("❌ Failed to save blog post:", error.message);
        return { success: false, error: error.message };
    }
}
