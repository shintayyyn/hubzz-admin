import dotenv from "dotenv";

dotenv.config();

import pkg from "./package";

export default {
  mode: "universal",

  env: {
    API_URL: process.env.API_URL,
    ONE_SIGNAL_APP_ID_ADMIN: process.env.ONE_SIGNAL_APP_ID_ADMIN
  },

  /*
   ** Headers of the page
   */
  head: {
    title: "HQ | Hubzz",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Nunito"
      }
    ],
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"
      },
      {
        src:
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyCqkvPPMK1lBnOF1NpxUggGFzkfcoaHV24&libraries=places"
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fa9716" },

  /*
   ** Global CSS
   */
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/main.css",
    "quill/dist/quill.snow.css",
    "quill/dist/quill.bubble.css",
    "quill/dist/quill.core.css"
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: "@/plugins/socket-io.js",
      ssr: false
    },
    {
      src: "@/plugins/one-signal.js",
      ssr: false
    },
    {
      src: "@/plugins/vue-svgicon.js",
      ssr: true
    },
    {
      src: "@/plugins/moment.js",
      ssr: true
    },
    {
      src: "~/plugins/google-maps",
      ssr: true
    },
    {
      src: "~plugins/nuxt-quill-plugin.js",
      ssr: false
    },
    {
      src: "@/plugins/mixin.js",
      ssr: true
    },
    {
      src: "@/plugins/jspdf.js",
      mode: 'client'
    },
    {
      src: "@/plugins/html2canvas.js",
      mode: 'client'
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    // ['nuxt-google-maps-module', {
    //   /* module options */
    //   key: 'GOOGLE MAPS KEY',
    // }],
    "@nuxtjs/onesignal",
    [
      "@nuxtjs/pwa",
      {
        workbox: false,
        meta: false,
        icon: false,
        manifest: false
      }
    ]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL
  },

  auth: {
    localStorage: {
      prefix: "admin.hubzz.auth."
    },
    cookie: {
      prefix: "admin.hubzz.auth.",
      options: {
        path: "/",
        expires: 1825
      }
    },
    strategies: {
      local: {
        endpoints: {
          logout: null,
          user: {
            url: "/api/v1/admin/me",
            method: "get",
            propertyName: "data.user"
          }
        }
      }
    }
  },

  oneSignal: {
    init: {
      appId: process.env.ONE_SIGNAL_APP_ID_ADMIN,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      }
    }
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true
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
    extend(config, ctx) {}
  }
};
