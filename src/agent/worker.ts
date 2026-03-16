import cron from 'node-cron';
import dotenv from 'dotenv';
import { generateContentStrategy } from './ai-service';
import { postToTwitter } from './social/twitter';
import { postToInstagram } from './social/meta';
import { postToBlogCMS } from './cms/blog';

// Load environment variables locally
dotenv.config();

console.log("==========================================");
console.log("🤖 OPENCLAW MARKETING AGENT INITIALIZED  ");
console.log("==========================================");

// The Core Logic Loop
async function runMarketingCycle() {
    console.log(`\n[${new Date().toISOString()}] Starting New Marketing Cycle...`);
    
    // Step 1: LLM Brainstorming
    const strategy = await generateContentStrategy("The Future of AI Automation for Agencies");
    if (!strategy) {
        console.error("❌ Failed to generate strategy. Aborting cycle.");
        return;
    }
    
    console.log("✅ Strategy Generated Successfully.");

    // Step 2: Push SEO Blog to CMS
    if (strategy.blog?.title && strategy.blog?.markdown_body) {
        await postToBlogCMS(strategy.blog.title, strategy.blog.markdown_body);
    }

    // Step 3: Social Media Distribution
    // 3A - Twitter
    if (strategy.twitter?.copy) {
        await postToTwitter(strategy.twitter.copy);
    }

    // 3B - Instagram (Placeholder Image until API keys are provided for DALL-E)
    if (strategy.instagram?.caption) {
        // Fallback placeholder image URL
        const imageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000";
        await postToInstagram(imageUrl, strategy.instagram.caption);
    }
    
    console.log(`[${new Date().toISOString()}] Marketing Cycle Pipeline Executed.`);
}

// -----------------------------------------------------
// CRON SCHEDULES
// -----------------------------------------------------
// Run daily at 9:00 AM UTC
cron.schedule('0 9 * * *', () => {
    runMarketingCycle();
});

// Run immediate test upon startup (for sandbox environments)
if (process.env.NODE_ENV !== 'production') {
    setTimeout(() => runMarketingCycle(), 2000);
}

// Keep PM2 process alive
setInterval(() => {}, 1000 * 60 * 60);
