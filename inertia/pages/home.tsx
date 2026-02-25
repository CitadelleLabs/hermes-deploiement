import { Head } from '@inertiajs/react'
import { useMemo } from 'react'
import { AppSidebar } from '~/components/app_sidebar'
import { SidebarProvider, SidebarInset} from '~/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { FolderIcon, ClockIcon } from 'lucide-react'
import { formatSize, formatDate } from '~/lib/utils'
import { DeployDialog } from '~/components/deploy_dialog'
import { Header } from '~/components/header'

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

type HomeProps = {
  plugins: PluginsByCategory
}

export default function Home({ plugins }: HomeProps) {
  const recentPlugins = useMemo(() => {
    const allPlugins: Plugin[] = Object.values(plugins || {}).flat()
    
    return allPlugins
      .sort((a: Plugin, b: Plugin) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      )
      .slice(0, 5)
  }, [plugins])

  return (
    <>
      <Head title="Homepage" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="max-w-6xl w-full mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bienvenue sur Hermes</h2>
                <p className="text-muted-foreground">
                  Service de deploiement centralisé de plugins Minecraft multi serveurs.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" />
                    Plugins modifiés récemment
                  </CardTitle>
                  <CardDescription>Les 5 derniers plugins ajoutés ou modifiés</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPlugins.length === 0 ? (
                    <p className="text-muted-foreground">Aucun plugin disponible</p>
                  ) : (
                    <div className="space-y-3">
                      {recentPlugins.map((plugin) => {
                        const parts = plugin.path.split('/')
                        const category = parts.length > 1 
                          ? parts.slice(0, -1).join('/')
                          : 'root'
                        const fileName = plugin.name.replace('.jar', '')

                        return (
                          <div
                            key={plugin.path}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex-1">
                                <p className="font-medium">{fileName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatSize(plugin.size)} • {formatDate(plugin.lastModified)}
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <FolderIcon className="h-4 w-4" />
                                <span className="capitalize">{category}</span>
                              </div>
                              </div>
                            </div>
                            <DeployDialog pluginPath={plugin.path} pluginName={fileName} />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}