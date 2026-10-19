import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import type { ComponentType } from 'react'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<ComponentType<any>>('./pages/**/*.tsx', {
        eager: true,
        import: 'default',
      })
      const page = pages[`./pages/${name}.tsx`]
      if (!page) throw new Error(`Page Inertia introuvable : ${name}`)
      return page
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
