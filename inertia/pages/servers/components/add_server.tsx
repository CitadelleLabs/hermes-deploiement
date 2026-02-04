import { router } from '@inertiajs/react'
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
import { Input } from '~/components/ui/input'
import { PlusIcon } from 'lucide-react'

export function AddServerDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [serverId, setServerId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    router.post(
      '/servers',
      { name, serverId },
      {
        onSuccess: () => {
          setOpen(false)
          setName('')
          setServerId('')
        },
        onFinish: () => setLoading(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='hover:bg-black/90 hover:text-white border border-black'>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un serveur
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-white'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau serveur</DialogTitle>
            <DialogDescription>
              Créez un nouveau serveur Minecraft en renseignant son nom et son identifiant unique.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom du serveur
              </label>
              <Input
                id="name"
                placeholder="Spawn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="serverId" className="text-sm font-medium">
                Identifiant du serveur
              </label>
              <Input
                id="serverId"
                placeholder="3e4643b7"
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le serveur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
