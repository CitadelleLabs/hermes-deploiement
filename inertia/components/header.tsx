import { PanelLeftIcon } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { Button } from '~/components/ui/button'
import { useSidebar } from '~/components/ui/sidebar'
import { useIsMobile } from '~/hooks/use-mobile'

export function Header() {
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9"
        >
          <PanelLeftIcon className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      )}
      <Separator orientation="vertical" className="mr-2 h-4" />
    </header>
  )
}