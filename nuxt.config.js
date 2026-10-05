// const webpack = require('webpack');
const axios = require('axios');

export default {
  // Statikus SPA build (Apache-on fut, Node nélkül)
  ssr: false,
  target: 'static',

  // Backend címe (felülírható a BACKEND_URL környezeti változóval)
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'https://fortuna.tulipanfutar.hu',
  },

  head: {
    title: 'fortuna-admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // { hid: 'description', name: 'description', content: 'The admin backend for the FortunaAI project.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/admin/style/favicon/favicon-admin.png' },
      { rel: 'stylesheet', href: '/admin/style/admin-panel-theme.min.css' },
      { rel: 'stylesheet', href: '/admin/style/fonts/fontawesome-6.4.2/css/all.css' },
    ],
  },
  /* Customize the progress bar color */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extend(config, { isDev, isClient }) {
      // // Remove comments from JavaScript files
      // config.plugins.push(
      //   new webpack.optimize.minimize({
      //     comments: false
      //   })
      // );

      if (isDev && isClient) {
        // Add ESLint loader (optional, if not already present)
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },

  plugins: [
    '~/plugins/axios-config.js',
  ],

  modules: [
    '@nuxtjs/axios',
  ],

  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    timeout: 10000, // Set a timeout value in milliseconds (e.g., 10 seconds)
  },

  // Axios configuration // Added by Stulipan
  axios: {
    // baseURL: 'https://api.example.com', // Your API base URL
    timeout: 10000, // Set a timeout value in milliseconds (e.g., 10 seconds)

  },

  publicRuntimeConfig: {
    BACKEND_API_TOKEN: process.env.BACKEND_API_TOKEN,
  },

  // Define the dynamic route
  router: {
    base: '/admin/',
    extendRoutes(routes, resolve) {
      // EZ NEM KELL MERT, ALAPBOL EZ IGY VAN
      // DE MEGIS KELL, mert nelkule nem frissul az oldal F5-re!
      routes.push({
        // name: 'horoscope-texts',
        path: '/horoscope-texts',
        component: resolve(__dirname, 'pages/horoscope-texts/index.vue')
      });

      routes.push({
        // name: 'horoscope-texts-date',
        path: '/horoscope-texts/date/:date',
        component: resolve(__dirname, 'pages/horoscope-texts/index.vue')
      });

      // Add a new route for tags
      routes.push({
        // name: 'horoscope-texts-tag',
        path: '/horoscope-texts/tag/:tag',
        component: resolve(__dirname, 'pages/horoscope-texts/index.vue')
      });

      // EZ NEM KELL MERT, ALAPBOL EZ IGY VAN
      // DE MEGIS KELL, mert nelkule nem frissul az oldal F5-re!
      routes.push({
        // name: 'show-rewritten',
        path: '/show-rewritten/',
        component: resolve(__dirname, 'pages/show-rewritten/index.vue')
      });

      routes.push({
        // name: 'show-rewritten-date',
        path: '/show-rewritten/:date/:locale',
        component: resolve(__dirname, 'pages/show-rewritten/_date.vue')
      });
    }
  },
};
