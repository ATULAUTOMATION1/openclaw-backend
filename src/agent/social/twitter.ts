import axios from 'axios';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

const TWITTER_API_KEY = process.env.TWITTER_API_KEY || '';
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || '';
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN || '';
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET || '';

export async function postToTwitter(text: string) {
    if (!TWITTER_API_KEY || !TWITTER_ACCESS_TOKEN) {
        console.warn("⚠️ TWITTER_API_KEY not found. Skipping live tweet via API.");
        return { success: false, reason: "Missing API Keys" };
    }

    try {
        console.log(`[Twitter Integration] Attempting to post tweet: "${text.substring(0, 50)}..."`);
        
        // OAuth 1.0a implementation for Twitter API v2
        const oauth = new OAuth({
            consumer: { key: TWITTER_API_KEY, secret: TWITTER_API_SECRET },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto.createHmac('sha1', key).update(base_string).digest('base64');
            },
        });

        const request_data = {
            url: 'https://api.twitter.com/2/tweets',
            method: 'POST',
        };

        const token = {
            key: TWITTER_ACCESS_TOKEN,
            secret: TWITTER_ACCESS_SECRET,
        };

        const response = await axios.post(
            request_data.url,
            { text },
            { 
               headers: {
                 ...oauth.toHeader(oauth.authorize(request_data, token)),
                 'Content-Type': 'application/json'
               } 
            }
        );

        console.log("✅ Successfully posted to Twitter:", response.data?.data?.id);
        return { success: true, id: response.data?.data?.id };
    } catch (error: any) {
        console.error("❌ Failed to post tweet:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}
