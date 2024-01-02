const axios = require('axios');

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'fortuna-admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // { hid: 'description', name: 'description', content: 'The admin backend for the FortunaAI project.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/style/favicon/favicon-admin.png' },
      { rel: 'stylesheet', href: '/style/admin-panel-theme.min.css' },
      { rel: 'stylesheet', href: '/style/fonts/fontawesome-6.4.2/css/all.css' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        // Add Babel loader for JavaScript files
        // config.module.rules.push({
        //   test: /\.js$/,
        //   loader: 'babel-loader',
        //   exclude: /(node_modules)/,
        //   options: {
        //     presets: ['@babel/preset-env'],
        //     plugins: [require('@babel/plugin-proposal-private-methods')],
        //   },
        // });

        // Add ESLint loader (optional, if not already present)
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },

    // /*
    // ** Run ESLint on save
    // */
    // extend (config, { isDev, isClient }) {
    //   if (isDev && isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
  },

  plugins: [
    '~/plugins/wording-plugin.js',
    // { src: '~/plugins/StulipanNotify.js', ssr: false },
    // { src: '~/plugins/StulipanNotifyW.js', ssr: false },
    // { src: '~/plugins/StulipanModal.js', ssr: false },
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

  // Define the dynamic route
  router: {
    extendRoutes(routes, resolve) {
      // // Find the index of the route with the name 'horoscope-texts-date'
      // const dateRouteIndex = routes.findIndex(route => route.name === 'horoscope-texts-date');
      //
      // // Check if the route was found
      // if (dateRouteIndex !== -1) {
      //   // Duplicate the route to create a new one with 'preview' as an optional parameter
      //   const dateRoute = { ...routes[dateRouteIndex] };
      //   dateRoute.path = `${dateRoute.path}/date/:date?/:preview?`; // Add '?' to make 'preview' optional
      //   dateRoute.name = 'horoscope-texts-date-preview'; // Choose a new name for the route
      //
      //   // Insert the modified route into the routes array
      //   routes.splice(dateRouteIndex + 1, 0, dateRoute);
      // }

      routes.push({
        name: 'horoscope-texts',
        path: '/horoscope-texts',
        component: resolve(__dirname, 'pages/horoscope-texts/index.vue')
      });

      routes.push({
        name: 'horoscope-texts-date',
        path: '/horoscope-texts/date/:date',
        component: resolve(__dirname, 'pages/horoscope-texts/index.vue')
      });

      // Add a new route for tags
      routes.push({
        name: 'horoscope-texts-tag',
        path: '/horoscope-texts/tag/:tag',
        component: resolve(__dirname, 'pages/horoscope-texts/index.vue')
      });


      // routes.push({
      //   name: 'horoscope-texts-all',
      //   path: '/horoscope-texts/',
      //   component: resolve(__dirname, 'pages/horoscope-texts/_date.vue')
      // });
      //
      // routes.push({
      //   name: 'horoscope-texts-date',
      //   path: '/horoscope-texts/date/:date',
      //   component: resolve(__dirname, 'pages/horoscope-texts/_date.vue')
      // });
      //
      // // Add a new route for tags
      // routes.push({
      //   name: 'horoscope-texts-tag',
      //   path: '/horoscope-texts/tag/:tag',
      //   component: resolve(__dirname, 'pages/horoscope-texts/_date.vue')
      // });


      routes.push({
        name: 'show-rewritten',
        path: '/show-rewritten/:date/:locale',
        component: resolve(__dirname, 'pages/show-rewritten/_date.vue')
      });
    }
  }
};
