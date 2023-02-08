import { appBuilder, appDependenciesBuilder } from './builders'

// addEventListener('fetch', (event) => {
//   event.respondWith(new Response('Hello Miniflare!'))
// })

export default appBuilder(appDependenciesBuilder)
