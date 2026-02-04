import { router, usePage } from '@inertiajs/react'
import { useState } from 'react'
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
import { RocketIcon, ServerIcon } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/alert'

type Server = {
  id: number
  name: string
  serverId: string
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
  const [selectedServers, setSelectedServers] = useState<number[]>([])
  const [deploying, setDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<{
    [serverId: number]: 'pending' | 'success' | 'error'
  }>({})

  const toggleServer = (serverId: number) => {
    setSelectedServers((prev) =>
      prev.includes(serverId) ? prev.filter((id) => id !== serverId) : [...prev, serverId]
    )
  }

  const handleDeploy = async () => {
    if (selectedServers.length === 0) return

    setDeploying(true)
    setDeploymentStatus({})

    for (const serverId of selectedServers) {
      setDeploymentStatus((prev) => ({ ...prev, [serverId]: 'pending' }))

      await new Promise<boolean>((resolve) => {
        router.post(
          `/servers/${serverId}/deploy`,
          { pluginPath },
          {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
              setDeploymentStatus((prev) => ({ ...prev, [serverId]: 'success' }))
              resolve(true)
            },
            onError: () => {
              setDeploymentStatus((prev) => ({ ...prev, [serverId]: 'error' }))
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
              {servers.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={`server-${server.id}`}
                    checked={selectedServers.includes(server.id)}
                    onCheckedChange={() => toggleServer(server.id)}
                    disabled={deploying}
                  />
                  <label
                    htmlFor={`server-${server.id}`}
                    className="flex-1 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <ServerIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{server.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {server.serverId}</p>
                      </div>
                    </div>
                  </label>
                  {deploymentStatus[server.id] === 'pending' && (
                    <span className="text-xs text-blue-500">Déploiement...</span>
                  )}
                  {deploymentStatus[server.id] === 'success' && (
                    <span className="text-xs text-green-500">✓ Réussi</span>
                  )}
                  {deploymentStatus[server.id] === 'error' && (
                    <span className="text-xs text-red-500">✗ Erreur</span>
                  )}
                </div>
              ))}
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
