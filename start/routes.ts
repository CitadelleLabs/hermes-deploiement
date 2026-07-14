/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const PluginsController = () => import('#controllers/plugins_controller')
const ServersController = () => import('#controllers/servers_controller')
const DeploymentController = () => import('#controllers/deployment_controller')

router.get('/login', [AuthController, 'showLogin'])
router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/', [PluginsController, 'home'])
    router.get('/plugins/:id', [PluginsController, 'show'])
    router.post('/plugins/:id/auto-update', [PluginsController, 'toggleAutoUpdate'])
    router.get('/servers', [ServersController, 'index'])
    router.post('/servers/:identifier/deploy', [DeploymentController, 'deployPlugin'])
    router.post('/logout', [AuthController, 'logout'])
  })
  .use(middleware.auth())
