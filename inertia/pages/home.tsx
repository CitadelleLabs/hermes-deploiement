import { Head, Link } from '@inertiajs/react'
import { useMemo, useState, useEffect } from 'react'
import { Navbar } from '~/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FolderIcon, FolderOpenIcon, ArrowRightIcon, PlugIcon, Search, X } from 'lucide-react'
import { formatSize, formatDate } from '~/lib/utils'
import { Input } from '~/components/ui/input'

type PluginVersion = {
  fileName: string
  path: string
  version: string
  commit: string
  size: number
  lastModified: string
  url: string
}

type PluginProfile = {
  id: string
  name: string
  category: string
  versions: PluginVersion[]
  latestVersion: PluginVersion
  isAutoUpdateEnabled: boolean
}

type PluginsByCategory = {
  [category: string]: PluginProfile[]
}

type HomeProps = {
  plugins: PluginsByCategory
}

export default function Home({ plugins }: HomeProps) {
  const categoryKeys = useMemo(() => Object.keys(plugins || {}), [plugins])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryKeys[0] || null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (categoryKeys.length > 0 && (!selectedCategory || !categoryKeys.includes(selectedCategory))) {
      setSelectedCategory(categoryKeys[0])
    }
  }, [categoryKeys, selectedCategory])

  const allProfiles = useMemo(() => {
    return Object.values(plugins || {}).flat()
  }, [plugins])

  const filteredSearchProfiles = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return allProfiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(q) ||
        profile.id.toLowerCase().includes(q)
    )
  }, [allProfiles, searchQuery])


  return (
    <>
      <Head title="Liste des Plugins" />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col p-4 md:p-8">
          <div className="max-w-6xl w-full mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Liste des Plugins</h2>
                <p className="text-muted-foreground">
                  Gérez et déployez les versions des plugins Minecraft sur vos serveurs Pterodactyl.
                </p>
              </div>
              <div className="relative max-w-xs w-full select-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Rechercher un plugin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {searchQuery.trim() !== '' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  Résultats de la recherche pour &ldquo;{searchQuery}&rdquo;
                  <span className="text-sm font-normal text-muted-foreground">
                    ({filteredSearchProfiles.length} résultat{filteredSearchProfiles.length > 1 ? 's' : ''})
                  </span>
                </h3>

                {filteredSearchProfiles.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground/80">
                      Aucun plugin ne correspond à votre recherche.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSearchProfiles.map((profile) => (
                      <Card key={profile.id} className="hover:shadow-sm transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <PlugIcon className="h-4 w-4" />
                                {profile.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-muted-foreground mr-1">
                                  ID: {profile.id}
                                </span>
                                <span className="inline-flex items-center rounded-md bg-stone-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-stone-600 dark:text-zinc-300 capitalize ring-1 ring-inset ring-neutral-200 dark:ring-zinc-700/50">
                                  Dossier: {profile.category}
                                </span>
                                {profile.isAutoUpdateEnabled && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-450 border border-emerald-500/20 dark:border-emerald-500/10 select-none">
                                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                    Mise à jour automatique
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="inline-flex items-center rounded-md bg-stone-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-stone-850 dark:text-zinc-200 ring-1 ring-inset ring-stone-200/55 dark:ring-zinc-700/50">
                                v{profile.latestVersion.version}
                              </span>
                              {profile.latestVersion.commit !== 'unknown' && (
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  commit: {profile.latestVersion.commit}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{formatSize(profile.latestVersion.size)}</span>
                            <span>Modifié le {formatDate(profile.latestVersion.lastModified)}</span>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-zinc-800/80">
                            <Link
                              href={`/plugins/${profile.id}`}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border shadow-sm hover:bg-neutral-100 dark:hover:bg-zinc-900 h-9 px-4 py-2 border-neutral-300 dark:border-zinc-800 dark:text-zinc-200"
                            >
                              Gérer & Déployer
                              <ArrowRightIcon className="h-4 w-4 ml-2" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {searchQuery.trim() === '' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground mr-auto uppercase tracking-wider">
                    Dossiers
                  </h3>
                  {categoryKeys.length === 0 ? (
                    <p className="text-muted-foreground">Aucun dossier trouvé dans le bucket R2.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {categoryKeys.map((catKey) => {
                        const isSelected = selectedCategory === catKey
                        const count = plugins[catKey].length
                        return (
                          <Card
                            key={catKey}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'border-zinc-900 bg-zinc-950/5 text-zinc-900 dark:border-zinc-200 dark:bg-white/10 dark:text-zinc-50' : 'hover:bg-accent/40'
                              }`}
                            onClick={() => {
                              setSelectedCategory(catKey)
                            }}
                          >
                            <CardContent className="flex items-center gap-4 p-5">
                              <div className={`p-3 rounded-lg ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-muted'}`}>
                                {isSelected ? (
                                  <FolderOpenIcon className="h-6 w-6" />
                                ) : (
                                  <FolderIcon className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <h3 className="font-semibold text-lg capitalize">{catKey}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {count} plugin{count > 1 ? 's' : ''}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>

                {selectedCategory && plugins[selectedCategory] && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FolderOpenIcon className="h-5 w-5" />
                      Plugins dans <span className="capitalize">{selectedCategory}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plugins[selectedCategory].map((profile) => (
                        <Card key={profile.id} className="hover:shadow-sm transition-all duration-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                  <PlugIcon className="h-4 w-4" />
                                  {profile.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs text-muted-foreground">
                                    ID: {profile.id}
                                  </span>
                                  {profile.isAutoUpdateEnabled && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-450 border border-emerald-500/20 dark:border-emerald-500/10 select-none">
                                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                      Mise à jour automatique
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="inline-flex items-center rounded-md bg-stone-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-stone-850 dark:text-zinc-200 ring-1 ring-inset ring-stone-200/55 dark:ring-zinc-700/50">
                                  v{profile.latestVersion.version}
                                </span>
                                {profile.latestVersion.commit !== 'unknown' && (
                                  <span className="font-mono text-[10px] text-muted-foreground">
                                    commit: {profile.latestVersion.commit}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{formatSize(profile.latestVersion.size)}</span>
                              <span>Modifié le {formatDate(profile.latestVersion.lastModified)}</span>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-zinc-800/80">
                              <Link
                                href={`/plugins/${profile.id}`}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border shadow-sm hover:bg-neutral-100 dark:hover:bg-zinc-900 h-9 px-4 py-2 border-neutral-300 dark:border-zinc-800 dark:text-zinc-200"
                              >
                                Gérer & Déployer
                                <ArrowRightIcon className="h-4 w-4 ml-2" />
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
