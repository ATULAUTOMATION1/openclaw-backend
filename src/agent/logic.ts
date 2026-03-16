import { generateContentStrategy } from './ai-service';
import { postToTwitter } from './social/twitter';
import { postToInstagram } from './social/meta';
import { postToBlogCMS } from './cms/blog';
import { addLog } from './logger';

export async function runMarketingCycle() {
    addLog('SYSTEM', 'Starting New Marketing Cycle...');
    
    try {
        // Step 1: LLM Brainstorming
        const topic = "The Future of AI Automation for Agencies";
        addLog('AI', `Brainstorming strategy for: ${topic}`);
        
        const strategy = await generateContentStrategy(topic);
        if (!strategy) {
            addLog('ERROR', 'Failed to generate strategy. Aborting cycle.');
            return { success: false, error: 'AI generation failed' };
        }
        
        addLog('AI', 'Strategy Generated Successfully.');

        // Step 2: Push SEO Blog to CMS
        if (strategy.blog?.title && strategy.blog?.markdown_body) {
            addLog('BLOG', `Posting blog: ${strategy.blog.title}`);
            await postToBlogCMS(strategy.blog.title, strategy.blog.markdown_body);
        }

        // Step 3: Social Media Distribution
        // 3A - Twitter
        if (strategy.twitter?.copy) {
            addLog('SOCIAL', 'Posting to Twitter...');
            await postToTwitter(strategy.twitter.copy);
        }

        // 3B - Instagram
        if (strategy.instagram?.caption) {
            const imageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000";
            addLog('SOCIAL', 'Posting to Instagram...');
            await postToInstagram(imageUrl, strategy.instagram.caption);
        }
        
        addLog('SYSTEM', 'Marketing Cycle Pipeline Executed Successfully.');
        return { success: true, strategy };
    } catch (error: any) {
        addLog('ERROR', `Cycle failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}
