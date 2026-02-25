import { Link, router, usePage } from '@inertiajs/react'
import {
  ChevronRight,
  HomeIcon,
  LogOutIcon,
  PlugIcon,
  ServerIcon,
} from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '~/components/ui/sidebar'
import { DeployDialog } from '~/components/deploy_dialog'

type Plugin = {
  name: string
  path: string
  size: number
  lastModified: string
  url: string
}

type PluginsByCategory = {
  [category: string]: Plugin[]
}

type User = {
  id: number
  username: string
}

export function AppSidebar() {
  const { url, props } = usePage<{ plugins: PluginsByCategory; user: User }>()
  const pluginsByCategory = props.plugins || {}
  const user = props.user

  const handleLogout = () => {
    router.post('/logout')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src="/logo.png" alt="Logo" className="h-6 w-full object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Hermes</span>
                </div>  
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={url === '/'} tooltip="Accueil">
                <Link href="/">
                  <HomeIcon />
                  <span>Accueil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={url === '/servers'}
                tooltip="Serveurs"
              >
                <Link href="/servers">
                  <ServerIcon />
                  <span>Serveurs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {Object.keys(pluginsByCategory).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Catégories</SidebarGroupLabel>
            <SidebarMenu>
              {Object.entries(pluginsByCategory).map(([category, categoryPlugins]) => (
                <Collapsible
                  key={category}
                  asChild
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={category}>
                        <span className="capitalize">{category}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {categoryPlugins.map((plugin) => {
                          const pluginName = plugin.name.replace('.jar', '')

                          return (
                            <SidebarMenuSubItem key={plugin.path}>
                              <DeployDialog pluginPath={plugin.path} pluginName={pluginName}>
                                <SidebarMenuSubButton>
                                  <PlugIcon className="h-4 w-4" />
                                  <span>{pluginName}</span>
                                </SidebarMenuSubButton>
                              </DeployDialog>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium">Utilisateur : {user?.username}</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Déconnexion">
              <LogOutIcon />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}