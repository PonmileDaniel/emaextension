const validateAuditRequest = (req, res, next) => {
  const { profileData, tweets } = req.body;
  
  // Check if required data exists
  if (!profileData || !tweets || !Array.isArray(tweets)) {
    return res.status(400).json({ 
      error: 'Invalid request data. Expected profileData and tweets array.' 
    });
  }

  // Check minimum tweet count
  if (tweets.length < 5) {
    return res.status(400).json({ 
      error: 'Need at least 5 tweets for analysis' 
    });
  }

  // Validate profile data structure
  if (!profileData.handle || !profileData.name) {
    return res.status(400).json({ 
      error: 'Profile data must include handle and name' 
    });
  }

  // Validate tweet structure
  const invalidTweets = tweets.filter(tweet => 
    !tweet.text || !tweet.metrics || 
    typeof tweet.metrics.likes !== 'number'
  );

  if (invalidTweets.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid tweet data structure' 
    });
  }

  next();
};

export { validateAuditRequest };