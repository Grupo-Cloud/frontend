import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function MobileNav() {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src="/avatars/01.png" alt="@username" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </div>
        <Separator className="mb-4" />
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-100/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}

