import axios from 'axios';

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || '';
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID || '';

export async function postToInstagram(imageUrl: string, caption: string) {
    if (!META_ACCESS_TOKEN || !INSTAGRAM_ACCOUNT_ID) {
        console.warn("⚠️ META_ACCESS_TOKEN not found. Skipping live Instagram post.");
        return { success: false, reason: "Missing API Keys" };
    }

    try {
        console.log(`[Instagram Integration] Preparing to post image with caption...`);
        
        // Step 1: Create the media container (upload the image to Meta's servers)
        const mediaCreationRes = await axios.post(
            `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}/media`,
            null,
            {
                params: {
                    image_url: imageUrl,
                    caption: caption,
                    access_token: META_ACCESS_TOKEN
                }
            }
        );

        const creationId = mediaCreationRes.data.id;
        console.log(`[Instagram Integration] Media container created. ID: ${creationId}`);

        // Step 2: Publish the media container to the feed
        const publishRes = await axios.post(
            `https://graph.facebook.com/v19.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
            null,
            {
                params: {
                    creation_id: creationId,
                    access_token: META_ACCESS_TOKEN
                }
            }
        );

        console.log("✅ Successfully posted to Instagram:", publishRes.data?.id);
        return { success: true, id: publishRes.data?.id };

    } catch (error: any) {
        console.error("❌ Failed to post to Instagram:", error.response?.data?.error?.message || error.message);
        return { success: false, error: error.message };
    }
}
