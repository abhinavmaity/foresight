
import { SidebarContext, useSidebar } from "./context"
import { 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarInset, 
  SidebarInput, 
  SidebarSeparator 
} from "./sidebar-layout"
import { 
  SidebarMenu, 
  SidebarMenuAction, 
  SidebarMenuBadge, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSkeleton,
  sidebarMenuButtonVariants 
} from "./sidebar-menu"
import { SidebarProvider, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SIDEBAR_WIDTH_MOBILE } from "./sidebar-provider"
import { SidebarRail } from "./sidebar-rail"
import { Sidebar } from "./sidebar-base"
import { SidebarTrigger } from "./sidebar-trigger"
import { 
  SidebarGroup, 
  SidebarGroupAction, 
  SidebarGroupContent, 
  SidebarGroupLabel 
} from "./sidebar-group"
import { 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem 
} from "./sidebar-submenu"

// Import the type separately to export with export type
import type { SidebarState } from "./context"

export {
  Sidebar,
  SidebarContent,
  SidebarContext,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
  sidebarMenuButtonVariants,
  useSidebar,
}

// Export the type with export type syntax
export type { SidebarState }
