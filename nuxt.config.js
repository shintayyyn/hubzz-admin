import dotenv from 'dotenv'

dotenv.config()

import pkg from './package'

export default {
  mode: 'universal',

  env: {
    API_URL: process.env.API_URL
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/tailwind.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/socket-io',
      ssr: false
    },
    {
      src: '@/plugins/one-signal',
      ssr: false
    },
    {
      src: '@/plugins/vue-svgicon.js',
      ssr: true
    },
    {
      src: '@/plugins/moment.js',
      ssr: true
    },
    {
      src: "~/plugins/google-maps",
      ssr: true
    }

  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    // 'nuxt-material-design-icons',
    // ['nuxt-google-maps-module', {
    //   /* module options */
    //   key: 'GOOGLE MAPS KEY',
    // }],
    // 'bootstrap-vue/nuxt'
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          logout: null,
          user: {
            url: '/api/v1/me',
            method: 'get',
            propertyName: 'data.user'
          }
        }
      }
    }
  },

  oneSignal: {
    init: {
      appId: process.env.ONE_SIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
          disable: true
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: [/^vue2-google-maps($|\/)/],
    extend(config, ctx) {

    }
  },

}
