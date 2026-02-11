import { router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Checkbox } from '~/components/ui/checkbox'
import { RocketIcon, ServerIcon, Search } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Input } from '~/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'

type Server = {
  name: string
  identifier: string
}

type DeployDialogProps = {
  pluginPath: string
  pluginName: string
  children?: React.ReactNode
}

export function DeployDialog({ pluginPath, pluginName, children }: DeployDialogProps) {
  const { props } = usePage<{ servers?: Server[] }>()
  const servers = props.servers || []
  
  const [open, setOpen] = useState(false)
  const [selectedServers, setSelectedServers] = useState<string[]>([])
  const [deploying, setDeploying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deploymentStatus, setDeploymentStatus] = useState<{
    [identifier: string]: 'pending' | 'success' | 'error'
  }>({})

  const SERVERS_PER_PAGE = 5

  const filteredServers = servers.filter((server) => {
    const query = searchQuery.toLowerCase()
    return (
      server.name.toLowerCase().includes(query) ||
      server.identifier.toLowerCase().includes(query)
    )
  })

  const totalPages = Math.ceil(filteredServers.length / SERVERS_PER_PAGE)
  const startIndex = (currentPage - 1) * SERVERS_PER_PAGE
  const endIndex = startIndex + SERVERS_PER_PAGE
  const paginatedServers = filteredServers.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const toggleServer = (identifier: string) => {
    setSelectedServers((prev) =>
      prev.includes(identifier) ? prev.filter((id) => id !== identifier) : [...prev, identifier]
    )
  }

  const handleDeploy = async () => {
    if (selectedServers.length === 0) return

    setDeploying(true)
    setDeploymentStatus({})

    for (const identifier of selectedServers) {
      setDeploymentStatus((prev) => ({ ...prev, [identifier]: 'pending' }))

      await new Promise<boolean>((resolve) => {
        router.post(
          `/servers/${identifier}/deploy`,
          { pluginPath },
          {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
              setDeploymentStatus((prev) => ({ ...prev, [identifier]: 'success' }))
              resolve(true)
            },
            onError: () => {
              setDeploymentStatus((prev) => ({ ...prev, [identifier]: 'error' }))
              resolve(false)
            },
          }
        )
      })
    }

    setDeploying(false)
    setTimeout(() => {
      const allSuccess = selectedServers.every((id) => deploymentStatus[id] === 'success')
      if (allSuccess) {
        setOpen(false)
        setSelectedServers([])
        setDeploymentStatus({})
      }
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className='border hover:bg-black hover:text-white'>
            <RocketIcon className="h-4 w-4 mr-2" />
            Déployer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Déployer {pluginName}</DialogTitle>
          <DialogDescription>
            Sélectionnez un ou plusieurs serveurs sur lesquels déployer ce plugin.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {servers.length === 0 ? (
            <Alert>
              <ServerIcon className="h-4 w-4" />
              <AlertDescription>
                Aucun serveur configuré. Ajoutez un serveur dans la section Serveurs.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {filteredServers.length === 0 ? (
                <Alert>
                  <ServerIcon className="h-4 w-4" />
                  <AlertDescription>
                    Aucun serveur ne correspond à votre recherche.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    {paginatedServers.map((server) => (
                <div
                  key={server.identifier}
                  className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={`server-${server.identifier}`}
                    checked={selectedServers.includes(server.identifier)}
                    onCheckedChange={() => toggleServer(server.identifier)}
                    disabled={deploying}
                  />
                  <label
                    htmlFor={`server-${server.identifier}`}
                    className="flex-1 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <ServerIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{server.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {server.identifier}</p>
                      </div>
                    </div>
                  </label>
                  {deploymentStatus[server.identifier] === 'pending' && (
                    <span className="text-xs text-blue-500">Déploiement...</span>
                  )}
                  {deploymentStatus[server.identifier] === 'success' && (
                    <span className="text-xs text-green-500">✓ Réussi</span>
                  )}
                  {deploymentStatus[server.identifier] === 'error' && (
                    <span className="text-xs text-red-500">✗ Erreur</span>
                  )}
                </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className='hover:bg-black hover:text-white'>
            Annuler
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={selectedServers.length === 0 || deploying}
            className='bg-black hover:bg-white hover:text-black hover:border-black hover:border text-white'
          >
            {deploying
              ? 'Déploiement en cours...'
              : `Déployer sur ${selectedServers.length} serveur${selectedServers.length > 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
