import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Prism from 'markdown-it-prism'
import vitedge from 'vitedge/plugin.js'
// Import Tailwind config directly to avoid ES issues in WindiCSS plugin
import tailwindConfig from './tailwind.config'
// Rollup Plugins
// import commonjs from '@rollup/plugin-commonjs'
// import { nodeResolve } from '@rollup/plugin-node-resolve'
// import json from '@rollup/plugin-json'
// import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'
// import copyAssets from 'rollup-plugin-copy-imported-assets'
// import nodePolyfills from 'rollup-plugin-node-polyfills'
// import nodeGlobals from 'rollup-plugin-node-globals'

// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(process.cwd(), 'src')}/`,
    },
  },
  // build: {
  //   rollupOptions: {
  //     plugins: [
  //       // Converts CommonJS modules to ES6.
  //       commonjs({
  //         transformMixedEsModules: true,
  //       }),

  //       // Resolves JSON files as objects.
  //       json(),

  //       // Resolves non-JavaScript files, like images or text.
  //       // copyAssets({
  //       //   include: /\./,
  //       //   exclude: /\.(c|m)(j|t)sx?$/,
  //       // }),

  //       // Resolves NPM packages from node_modules/.
  //       nodeResolve({
  //         browser: true,
  //       }),
  //       NodeGlobalsPolyfillPlugin({
  //         process: true,
  //         buffer: true,
  //         define: { 'process.env.NODE_ENV': '"production"' }, // https://github.com/evanw/esbuild/issues/660
  //       }),
  //       NodeModulesPolyfillPlugin(),

  //       // Resolves non-toplevel imports using static analysis.
  //       // dynamicImportVars({
  //       //   warnOnError: true,
  //       // }),
  //     ],
  //   },
  // },
  plugins: [
    vitedge(),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    // @ts-ignore
    Pages.default({
      extensions: ['vue', 'md'],
      extendRoute(route: any) {
        if (route.component.endsWith('.md')) {
          return {
            ...route,
            meta: {
              // Disable page props for static MD routes
              propsGetter: false,
            },
          }
        }
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    // @ts-ignore
    Layouts.default(),

    // https://github.com/antfu/vite-plugin-md
    // @ts-ignore
    Markdown.default({
      wrapperClasses: 'prose prose-sm m-auto text-left',
      headEnabled: false, // This relies on useHead
      markdownItSetup(md: any) {
        // https://prismjs.com/
        md.use(Prism)
      },
    }),

    // https://github.com/antfu/vite-plugin-components
    // @ts-ignore
    ViteComponents.default({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      customLoaderMatcher: (id: string) => id.endsWith('.md'),

      // auto import icons
      customComponentResolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    // @ts-ignore
    ViteIcons.default(),

    // https://github.com/antfu/vite-plugin-windicss
    // @ts-ignore
    WindiCSS.default({
      config: tailwindConfig,
      safelist: 'prose prose-sm m-auto',
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      manifest: {
        name: 'Vitesse',
        short_name: 'Vitesse',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // https://github.com/intlify/vite-plugin-vue-i18n
    // @ts-ignore
    VueI18n.default({
      include: [path.resolve(process.cwd(), 'src/i18n/translations/**')],
    }),
  ],

  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core', 'faunadb'],
    exclude: ['vue-demi'],
  },
})
