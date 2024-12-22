// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{blue.50}',
          100: '{blue.100}',
          200: '{blue.200}',
          300: '{blue.300}',
          400: '{blue.400}',
          500: '{blue.500}',
          600: '{blue.600}',
          700: '{blue.700}',
          800: '{blue.800}',
          900: '{blue.900}',
          950: '{blue.950}'
      }
  }
});

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-sanctum',
    '@nuxt/icon',
    '@primevue/nuxt-module'
  ],
  sanctum: {
      baseUrl: process.env.BACKEND_URL,
      redirectIfAuthenticated: true,
      redirectIfUnauthenticated: true,
      redirect: {
        keepRequestedRoute: true,
        onLogin: '/',
        onLogout: '/',
        onGuestOnly:'/dashboard'
      },
      globalMiddleware: {
          enabled: true,
      },
  },
  primevue: {
      options: {
          theme: {
              preset: MyPreset,
              options: {
                  prefix: 'p',
                  darkModeSelector: '.color-scheme-dark',
                  cssLayer: false
              }
          }
      }
  }
})