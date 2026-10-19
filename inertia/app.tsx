import './css/app.css';
import type { ComponentType } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'Hermes'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob<ComponentType<any>>('./pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    hydrateRoot(el, <App {...props} />)
  },
});
