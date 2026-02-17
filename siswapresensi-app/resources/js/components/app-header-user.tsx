import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Home, FileText, ClipboardList, UserCheck } from 'lucide-react';
import { UserMenuContent } from '@/components/user-menu-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';
import type { NavItem, UserRole } from '@/types';

function getNavItems(role: UserRole): NavItem[] {
    const dashboardItem: NavItem = {
        title: 'Home',
        href: '/dashboard',
        icon: Home,
    };

    switch (role) {
        case 'guru':
            return [
                dashboardItem,
            ];
        case 'siswa':
            return [
                dashboardItem,
                { title: 'Riwayat', href: '/siswa/presensi', icon: ClipboardList },
            ];
        case 'orang_tua':
            return [
                dashboardItem,
                { title: 'Anak', href: '/orang-tua/presensi', icon: UserCheck },
                { title: 'Izin', href: '/orang-tua/izin', icon: FileText },
            ];
        default:
            return [dashboardItem];
    }
}

export function AppHeaderUser() {
    const { props, url } = usePage();
    const { auth } = props;
    const getInitials = useInitials();
    const navItems = getNavItems(auth.user.role);
    const currentUrl = url;
    
    // Check if we are on the dashboard (considering role-based dashboard URLs)
    const isDashboard = currentUrl === '/dashboard' || 
                        currentUrl === '/guru/dashboard' || 
                        currentUrl === '/siswa/dashboard' || 
                        currentUrl === '/orang-tua/dashboard';

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {!isDashboard ? (
                        <Button variant="ghost" size="icon" asChild className="mr-2">
                             <Link href="/dashboard">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                    ) : (
                        <Link href={dashboard()} className="flex items-center gap-2">
                            <AppLogo />
                        </Link>
                    )}
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const isActive = currentUrl.startsWith(item.href as string);
                            // Skip Home link on desktop if we have the logo
                            if (item.href === '/dashboard') return null;
                            
                            return (
                                <Link 
                                    key={item.href as string} 
                                    href={item.href as string}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        isActive ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
