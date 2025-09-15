import express from 'express';
import aiAnalyzer from '../services/ai-analyzer.js';
import { validateAuditRequest } from '../middleware/validation.js';
const router = express.Router();

// POST /api/audit
router.post('/', validateAuditRequest, async (req, res) => {
    try {
        const { profileData, tweets} = req.body;
        console.log(`🔍 Analyzing profile: ${profileData.handle} with ${tweets.length} tweets`);

        // Process with AI service
        const auditResults = await aiAnalyzer.analyzeProfile(profileData, tweets);
        res.json({
            success: true,
            results: auditResults,
            metadata: {
                profileHandle: profileData.handle,
                tweetCount: tweets.length,
                analyzedAt: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('Audit error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        })
    }
})

export default router;