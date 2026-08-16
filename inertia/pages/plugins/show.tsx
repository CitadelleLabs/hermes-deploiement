import { Head, Link, router } from '@inertiajs/react'
import { Navbar } from '~/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
    ArrowLeft,
    ClockIcon,
    PlugIcon,
    FolderIcon,
    RocketIcon,
    HardDriveIcon,
    RefreshCw,
} from 'lucide-react'
import { cn, formatSize, formatDate } from '~/lib/utils'
import { DeployDialog } from '~/components/deploy_dialog'

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
}

type ShowProps = {
    plugin: PluginProfile
    isAutoUpdateEnabled: boolean
}

export default function Show({ plugin, isAutoUpdateEnabled }: ShowProps) {
    const handleToggleAutoUpdate = (checked: boolean) => {
        router.post(`/plugins/${plugin.id}/auto-update`, {
            isEnabled: checked,
        }, {
            preserveScroll: true,
        })
    }

    return (
        <>
            <Head title={`Plugin | ${plugin.name}`} />
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <main className="flex-1 flex flex-col p-4 md:p-8">
                    <div className="max-w-6xl w-full mx-auto space-y-6">

                        <div>
                            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour à la liste des plugins
                                </Link>
                            </Button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-4 bg-neutral-100 dark:bg-zinc-900 rounded-xl">
                                    <PlugIcon className="h-10 w-10 text-neutral-800 dark:text-zinc-200" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-3xl font-extrabold tracking-tight">{plugin.name}</h2>
                                        <span className="inline-flex items-center rounded-md bg-stone-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-stone-855 dark:text-zinc-200 ring-1 ring-inset ring-stone-200/55 dark:ring-zinc-700/50">
                                            v{plugin.latestVersion.version}
                                        </span>
                                    </div>
                                    <p className="font-mono text-xs text-muted-foreground">ID: {plugin.id}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <FolderIcon className="h-4 w-4" />
                                        <span className="capitalize">{plugin.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <DeployDialog pluginPath={plugin.latestVersion.path} pluginName={plugin.latestVersion.fileName}>
                                    <Button className="bg-black text-white hover:bg-neutral-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 h-10 px-4 py-2">
                                        <RocketIcon className="h-4 w-4 mr-2" />
                                        Déployer la dernière version
                                    </Button>
                                </DeployDialog>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-6 col-span-1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
                                            Informations clés
                                        </CardTitle>
                                        <CardDescription>Dernière version compilée</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <span className="text-xs text-muted-foreground block uppercase font-medium">Taille</span>
                                            <span className="text-lg font-bold">{formatSize(plugin.latestVersion.size)}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground block uppercase font-medium">Commit SHA</span>
                                            <span className="text-lg font-mono font-bold bg-neutral-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
                                                {plugin.latestVersion.commit !== 'unknown' ? plugin.latestVersion.commit : 'Aucun'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground block uppercase font-medium">Dernière mise à jour</span>
                                            <span className="text-base font-semibold">{formatDate(plugin.latestVersion.lastModified)}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={cn(
                                    "transition-all duration-300 border-2",
                                    isAutoUpdateEnabled
                                        ? "border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-950/10 shadow-sm shadow-emerald-500/5"
                                        : "border-zinc-200 dark:border-zinc-800"
                                )}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <RefreshCw
                                                    className={cn(
                                                        "h-4 w-4 transition-colors",
                                                        isAutoUpdateEnabled ? "text-emerald-500" : "text-muted-foreground"
                                                    )}
                                                    style={{ animation: isAutoUpdateEnabled ? 'spin 8s linear infinite' : 'none' }}
                                                />
                                                Mise à jour automatique
                                            </CardTitle>
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none transition-colors",
                                                isAutoUpdateEnabled
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400"
                                            )}>
                                                <span className={cn(
                                                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                                                    isAutoUpdateEnabled ? "bg-emerald-500 animate-pulse scale-110" : "bg-neutral-400"
                                                )} />
                                                {isAutoUpdateEnabled ? "Activé" : "Désactivé"}
                                            </span>
                                        </div>
                                        <CardDescription>Mise à jour globale en arrière-plan</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <label
                                            htmlFor="auto-update"
                                            className={cn(
                                                "flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-colors border select-none group",
                                                isAutoUpdateEnabled
                                                    ? "bg-white dark:bg-zinc-950 border-emerald-500/20 dark:border-emerald-500/10 hover:border-emerald-500/30"
                                                    : "bg-neutral-50 dark:bg-zinc-900/40 border-neutral-200 dark:border-zinc-800 hover:bg-neutral-100/50 dark:hover:bg-zinc-900/80"
                                            )}
                                        >
                                            <div className="space-y-0.5 pr-2">
                                                <span className="text-sm font-semibold group-hover:text-foreground transition-colors block">
                                                    {isAutoUpdateEnabled ? "Désactiver les mises à jour" : "Activer les mises à jour"}
                                                </span>
                                                <p className="text-[11px] text-muted-foreground leading-normal">
                                                    Vérification automatique toutes les 5 minutes & déploiement sans action manuelle.
                                                </p>
                                            </div>
                                            <Checkbox
                                                id="auto-update"
                                                checked={isAutoUpdateEnabled}
                                                onCheckedChange={(checked) => handleToggleAutoUpdate(checked === true)}
                                                className={cn(
                                                    "size-5 border-2 rounded transition-all duration-200 scale-110 shrink-0",
                                                    isAutoUpdateEnabled
                                                        ? "border-emerald-600 dark:border-emerald-500 bg-emerald-600 text-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                                        : "border-neutral-400 dark:border-zinc-650"
                                                )}
                                            />
                                        </label>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="col-span-1 md:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                        Historique des builds
                                    </CardTitle>
                                    <CardDescription>
                                        Toutes les versions de ce plugin détectées dans le stockage
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border-collapse">
                                            <thead>
                                                <tr className="border-b border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/50 text-muted-foreground font-medium text-xs uppercase animate-none">
                                                    <th className="p-4">Version</th>
                                                    <th className="p-4">Commit</th>
                                                    <th className="p-4">Taille</th>
                                                    <th className="p-4">Date</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {plugin.versions.map((ver) => (
                                                    <tr key={ver.path} className="border-b border-neutral-100 dark:border-zinc-800/80 hover:bg-neutral-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                                        <td className="p-4 font-semibold">v{ver.version}</td>
                                                        <td className="p-4 font-mono text-xs">
                                                            {ver.commit !== 'unknown' ? (
                                                                <span className="bg-neutral-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
                                                                    {ver.commit}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground italic">Aucun</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-muted-foreground">{formatSize(ver.size)}</td>
                                                        <td className="p-4 text-xs text-muted-foreground">
                                                            {formatDate(ver.lastModified)}
                                                        </td>
                                                        <td className="p-2 text-right">
                                                            <DeployDialog pluginPath={ver.path} pluginName={ver.fileName}>
                                                                <Button variant="outline" size="sm" className="border-neutral-300 dark:border-zinc-800 dark:text-zinc-200">
                                                                    <RocketIcon className="h-3.5 w-3.5 mr-1" />
                                                                    Déployer
                                                                </Button>
                                                            </DeployDialog>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </main>
            </div>
        </>
    )
}
