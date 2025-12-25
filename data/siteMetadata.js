/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: "Terry's Blog",
  author: 'Terry',
  headerTitle: "Terry's Blog",
  description: '写作即思考 - A blog about technology and thinking',
  descriptions: [
    '写作即思考 - A blog about technology and thinking',
    '编程即创造 - Coding is creating',
    '分享即学习 - Sharing is learning'
  ],
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://your-domain.com',
  siteRepo: 'https://github.com/dszdsxc19',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  // mastodon: 'https://mastodon.social/@mastodonuser',
  email: 'address@yoursite.com',
  github: 'https://github.com/dszdsxc19',
  // x: 'https://twitter.com/x',
  // twitter: 'https://twitter.com/Twitter',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  // linkedin: 'https://www.linkedin.com/in/yourusername',
  // threads: 'https://www.threads.net/@yourusername',
  // instagram: 'https://www.instagram.com/yourusername',
  // medium: 'https://medium.com/@yourusername',
  // bluesky: 'https://bsky.app/profile/yourusername',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.

    // Umami Analytics 配置 (推荐)
    // 1. 注册 https://umami.is/ 或自建服务
    // 2. 在 .env 文件中添加: NEXT_UMAMI_ID=your-website-id
    // 3. 如果使用美国区 umami, 需要在 next.config.js 中配置 CSP
    //    umamiAnalytics: {
    //      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    //      src: 'https://us.umami.is/script.js'
    //    },
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    },

    // Plausible Analytics (轻量级替代方案)
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },

    // Simple Analytics (无cookie)
    // simpleAnalytics: {},

    // PostHog (功能丰富)
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },

    // Google Analytics (传统方案)
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    // Please add your .env file and modify it according to your selection
    // provider: 'buttondown', // 取消注释并配置
    provider: '', // 请选择上面的 provider 并在 .env 中配置相关环境变量
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: '', // supported providers: giscus, utterances, disqus, set to empty to disable

    // Giscus 配置 (基于 GitHub Discussions)
    // 1. 访问 https://giscus.app/ 配置并获取参数
    // 2. 在 .env 文件中添加:
    //    NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
    //    NEXT_PUBLIC_GISCUS_REPOSITORY_ID=your-repo-id
    //    NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
    //    NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: 'en',
    },

    // Utterances (基于 GitHub Issues)
    // provider: 'utterances',
    // utterancesConfig: {
    //   repo: '', // your-username/your-repo
    //   issueTerm: 'pathname',
    //   theme: 'github-light',
    //   darkTheme: 'github-dark',
    // },

    // Disqus (需要自建或付费服务)
    // provider: 'disqus',
    // disqusConfig: {
    //   shortname: '', // your-disqus-shortname
    // },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
