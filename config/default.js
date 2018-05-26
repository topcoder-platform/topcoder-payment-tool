/**
 * Common configuration.
 */

module.exports = {
  /* Configuration of Topcoder APIs. */
  API: {
    V2: 'https://api.topcoder-dev.com/v2',
    V3: 'https://api.topcoder-dev.com/v3',
  },

  /* CDN configuration. */
  CDN: {
    PUBLIC: 'https://d1aahxkjiobka8.cloudfront.net',
  },

  /* Various URLs. Most of them lead to different segments of Topcoder
   * platform. */
  URL: {
    /* Connector URL of the TC accounts App. */
    ACCOUNTS_APP_CONNECTOR: 'https://accounts.topcoder-dev.com/connector.html',

    /* The remote address where the app is deployed. */
    APP: 'https://community-app.topcoder-dev.com',

    ARENA: 'https://arena.topcoder-dev.com',
    AUTH: 'http://accounts.topcoder-dev.com',
    BASE: 'https://www.topcoder-dev.com',
    BLOG: 'https://www.topcoder.com/blog',
    BLOG_FEED: 'https://www.topcoder-dev.com/feed',
    COMMUNITY: 'https://community.topcoder-dev.com',
    FORUMS: 'https://apps.topcoder-dev.com/forums',
    HELP: 'https://help.topcoder-dev.com',

    COMMUNITIES: {
      BLOCKCHAIN: 'https://blockchain.topcoder-dev.com',
      COGNITIVE: 'https://cognitive.topcoder-dev.com',
    },

    /* Dedicated section to group together links to various articles in
     * Topcoder help center. */
    INFO: {
      DESIGN_CHALLENGES: 'http://help.topcoder.com/hc/en-us/categories/202610437-DESIGN',
      DESIGN_CHALLENGE_CHECKPOINTS: 'https://help.topcoder.com/hc/en-us/articles/219240807-Multi-Round-Checkpoint-Design-Challenges',
      DESIGN_CHALLENGE_SUBMISSION: 'http://help.topcoder.com/hc/en-us/articles/219122667-Formatting-Your-Submission-for-Design-Challenges',
      DESIGN_CHALLENGE_TYPES: 'http://help.topcoder.com/hc/en-us/articles/217481388-Choosing-a-Design-Challenge',
      RELIABILITY_RATINGS_AND_BONUSES: 'https://help.topcoder.com/hc/en-us/articles/219240797-Development-Reliability-Ratings-and-Bonuses',
      STOCK_ART_POLICY: 'http://help.topcoder.com/hc/en-us/articles/217481408-Policy-for-Stock-Artwork-in-Design-Submissions',
      STUDIO_FONTS_POLICY:
      'http://help.topcoder.com/hc/en-us/articles/217959447-Font-Policy-for-Design-Challenges',
      TOPCODER_TERMS: 'https://www.topcoder.com/community/how-it-works/terms/',
    },

    IOS: 'https://ios.topcoder-dev.com',
    MEMBER: 'https://members.topcoder-dev.com',
    ONLINE_REVIEW: 'https://software.topcoder-dev.com',
    STUDIO: 'https://studio.topcoder-dev.com',
    TCO: 'https://www.topcoder.com/tco',
    TCO17: 'https://tco17.topcoder.com/',

    TOPGEAR: 'https://dev-topgear.wipro.com',

    USER_SETTINGS: 'https://lc1-user-settings-service.herokuapp.com',
    WIPRO: 'https://wipro.topcoder.com',
    COMMUNITY_API: 'http://localhost:8000',
    COMMUNITY_APP_GITHUB_ISSUES: 'https://github.com/topcoder-platform/community-app/issues',
  },

  /* Amount of time [seconds] before expiration of authentication tokens,
   * when the frontend will automatically trigger their refreshment. Once
   * ready, it will either write to the Redux store fresh token, or will
   * remove auth tokens from the store.
   * NOTE: With the current implementation of accounts-app this value must be
   * smaller than 60 seconds (earlier than 60 seconds before expiration of an
   * auth token, a call to the getFreshToken() method returns the old token,
   * due to caching). */
  REAUTH_TIME: 55,
};
