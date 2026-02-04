import { Head, router } from '@inertiajs/react'
import { AppSidebar } from '~/components/app_sidebar'
import { SidebarProvider, SidebarInset } from '~/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { ServerIcon, TrashIcon } from 'lucide-react'
import { AddServerDialog } from './components/add_server'

type Server = {
  id: number
  name: string
  serverId: string
  createdAt: string
  updatedAt: string
}

type ServersProps = {
  servers: Server[]
}

export default function Servers({ servers }: ServersProps) {
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce serveur ?')) {
      router.delete(`/servers/${id}`)
    }
  }

  return (
    <>
      <Head title="Serveurs" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="max-w-6xl w-full mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Serveurs Minecraft</h2>
                  <p className="text-muted-foreground">
                    Gérez les serveurs sur lequels vous souhaitez déployer des plugins
                  </p>
                </div>

                <AddServerDialog />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ServerIcon className="h-5 w-5" />
                    Liste des serveurs
                  </CardTitle>
                  <CardDescription>
                    {servers.length} serveur{servers.length > 1 ? 's' : ''} enregistré
                    {servers.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {servers.length === 0 ? (
                    <div className="text-center py-8">
                      <ServerIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Aucun serveur enregistré</p>
                      <AddServerDialog />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {servers.map((server) => (
                        <div
                          key={server.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                              <ServerIcon/>
                            </div>
                            <div>
                              <p className="font-medium">{server.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {server.serverId}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(server.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
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
