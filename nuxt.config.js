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
      { hid: 'description', name: 'description', content: 'The admin backend for the FortunaAI project.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/style/admin-panel-theme.min.css' }
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
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  modules: [
    '@nuxtjs/axios',
  ],

  // Define the dynamic route
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'show-rewritten',
        path: '/show-rewritten/:date/:locale',
        component: resolve(__dirname, 'pages/show-rewritten/_date.vue')
      });
    }
  }
};

// const axios = require('axios');
//
// module.exports = {
//   /*
//   ** Headers of the page
//   */
//   head: {
//     title: 'fortuna-admin',
//     meta: [
//       { charset: 'utf-8' },
//       { name: 'viewport', content: 'width=device-width, initial-scale=1' },
//       { hid: 'description', name: 'description', content: 'The admin backend for the FortunaAI project.' }
//     ],
//     link: [
//       { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
//       { rel: 'stylesheet', href: '/style/admin-panel-theme.min.css' }
//     ],
//     // css: [
//     //   '~/assets/style/admin-panel-theme.css'
//     // ],
//   },
//   /*
//   ** Customize the progress bar color
//   */
//   loading: { color: '#3B8070' },
//   /*
//   ** Build configuration
//   */
//   build: {
//     /*
//     ** Run ESLint on save
//     */
//     extend (config, { isDev, isClient }) {
//       if (isDev && isClient) {
//         config.module.rules.push({
//           enforce: 'pre',
//           test: /\.(js|vue)$/,
//           loader: 'eslint-loader',
//           exclude: /(node_modules)/
//         })
//       }
//     }
//   },
//
//   modules: [
//     '@nuxtjs/axios',
//   ],
//
//   // Define the dynamic route
//   router: {
//     extendRoutes(routes, resolve) {
//       routes.push({
//         name: 'show-rewritten',
//         path: '/show-rewritten/:date',
//         component: resolve(__dirname, 'pages/show-rewritten/_date.vue')
//         // component: 'pages/show-rewritten'
//       });
//     }
//   }
// }
//
