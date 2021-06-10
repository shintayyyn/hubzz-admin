import dotenv from 'dotenv'

dotenv.config()

import path from 'path'

export default {
	mode: 'universal',

	env: {
		API_URL: process.env.API_URL,
		ONE_SIGNAL_APP_ID_ADMIN: process.env.ONE_SIGNAL_APP_ID_ADMIN,
	},

	head: {
		title: 'HQ | Hubzz',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'Hubzz Admin Web App' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css?family=Nunito'
			},
		],
		script: [
			{
				src: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js',
				defer: true,
			},
			{
				src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js',
			},
			{
				src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqkvPPMK1lBnOF1NpxUggGFzkfcoaHV24&libraries=places',
			},
		]
	},

	loading: { color: '#FFC72C' },

	css: [
		'~/assets/css/tailwind.css',
		'~/assets/css/main.css',
		'quill/dist/quill.snow.css',
		'quill/dist/quill.bubble.css',
		'quill/dist/quill.core.css',
	],

	plugins: [
		{
			src: '@/plugins/socket-io.js',
			mode: 'client',
		},
		// {
		// 	src: '@/plugins/one-signal.js',
		// 	mode: 'client',
		// },
		{
			src: '@/plugins/vue-svgicon.js',
			ssr: true,
		},
		{
			src: '@/plugins/moment.js',
			ssr: true,
		},
		{
			src: '~/plugins/google-maps',
			ssr: true,
		},
		{
			src: '~plugins/nuxt-quill-plugin.js',
			ssr: false,
		},
		{
			src: '@/plugins/mixin.js',
			ssr: true,
		},
		{
			src: '@/plugins/filters.js',
			ssr: true,
		},
		{
			src: '@/plugins/jspdf.js',
			mode: 'client',
		},
		{
			src: '@/plugins/html2canvas.js',
			mode: 'client',
		},
    {
      src: '@/plugins/broadcast-channel.js',
      mode: 'client',
    },
    {
      src: '@/plugins/validator.js',
      mode: 'client',
    },
    {
      src: '@/plugins/axios.js',
    },
	],

	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/auth',
	],

	axios: {
		baseURL: process.env.API_URL,
	},

	auth: {
		localStorage: {
			prefix: 'admin.hubzz.auth.'
		},
		cookie: {
			prefix: 'admin.hubzz.auth.',
			options: {
				path: '/',
				expires: 1825
			},
		},
		strategies: {
			local: {
				endpoints: {
					logout: null,
					user: {
						url: '/api/v1/admin/me',
						method: 'get',
						propertyName: 'data.user'
					},
				},
			},
		},
	},

	vue: {
		config: {
			productionTip: false,
			devtools: true,
		},
	},

	build: {
		postcss: {
			plugins: {
				tailwindcss: path.join(__dirname, 'tailwind.config.js'),
				autoprefixer: {},
			},
    },
    
    extractCSS: {
			ignoreOrder: true
		},

    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       styles: {
    //         name: 'styles',
    //         test: /\.(css|vue)$/,
    //         chunks: 'all',
    //         enforce: true
    //       }
    //     }
    //   }
    // },
		transpile: [
      /^vue2-google-maps($|\/)/,
      '@nuxtjs/axios',
    ],

		extend () {},


    babel: {
      babelrc: false,
      cacheDirectory: undefined,
      presets: [
        '@nuxt/babel-preset-app',
      ],
      plugins: [
        '@babel/plugin-transform-spread',
      ],
    },
	},
}
