import { Head } from '@inertiajs/react'
import { Navbar } from '~/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { ServerIcon } from 'lucide-react'

type Server = {
  name: string
  identifier: string
}

type ServersProps = {
  servers: Server[]
}

export default function Servers({ servers }: ServersProps) {

  return (
    <>
      <Head title="Serveurs" />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col p-4 md:p-8">
          <div className="max-w-6xl w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Serveurs Minecraft</h2>
              <p className="text-muted-foreground">
                Liste des serveurs depuis Pterodactyl
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5" />
                  Liste des serveurs
                </CardTitle>
                <CardDescription>
                  {servers.length} serveur{servers.length > 1 ? 's' : ''} disponible{servers.length > 1 ? 's' : ''} sur Pterodactyl
                </CardDescription>
              </CardHeader>
              <CardContent>
                {servers.length === 0 ? (
                  <div className="text-center py-8">
                    <ServerIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun serveur trouvé sur Pterodactyl</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {servers.map((server) => (
                      <div
                        key={server.identifier}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          <ServerIcon />
                        </div>
                        <div>
                          <p className="font-medium">{server.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {server.identifier}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}
