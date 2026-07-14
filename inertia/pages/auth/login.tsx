import { Head, useForm, usePage } from '@inertiajs/react'
import { FormEvent } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { AlertCircle } from 'lucide-react'

type LoginErrors = {
  username?: string
  password?: string
}

export default function Login() {
  const { props } = usePage<{ errors?: LoginErrors }>()
  const { data, setData, post, processing, errors: formErrors } = useForm({
    username: '',
    password: '',
  })

  const errors = props.errors || formErrors

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <>
      <Head title="Connexion" />
      <div className="min-h-screen flex items-center justify-center bg-sand-2 dark:bg-zinc-950 text-foreground">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <img src="/logo.png" alt="Hermes Logo" className="h-12" />
            </div>
            <CardTitle className="text-center text-2xl">Bienvenue sur Hermes</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous pour accéder à la plateforme de déploiement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.username && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.username}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  type="text"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                  placeholder="utilisateur"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={processing}
              >
                {processing ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
