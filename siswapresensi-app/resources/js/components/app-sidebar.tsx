import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ClipboardList,
    FileText,
    Folder,
    GraduationCap,
    LayoutGrid,
    QrCode,
    ScanLine,
    School,
    UserCheck,
    Users,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, UserRole } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

function getNavItems(role: UserRole): NavItem[] {
    const common: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    switch (role) {
        case 'admin':
            return [
                ...common,
                { title: 'Kelas', href: '/admin/kelas', icon: School },
                { title: 'Mata Pelajaran', href: '/admin/mapel', icon: BookOpen },
                { title: 'Guru', href: '/admin/guru', icon: Users },
                { title: 'Siswa', href: '/admin/siswa', icon: GraduationCap },
                { title: 'Orang Tua', href: '/admin/orang-tua', icon: Users },
                { title: 'Jadwal', href: '/admin/jadwal', icon: Calendar },
            ];
        case 'guru':
            return [
                ...common,
                { title: 'Presensi', href: '/guru/presensi', icon: ClipboardList },
                { title: 'Scan QR', href: '/guru/presensi/scan', icon: ScanLine },
                { title: 'Izin Siswa', href: '/guru/izin', icon: FileText },
            ];
        case 'siswa':
            return [
                ...common,
                { title: 'QR Code', href: '/siswa/qr-code', icon: QrCode },
                { title: 'Riwayat Presensi', href: '/siswa/presensi', icon: ClipboardList },
            ];
        case 'orang_tua':
            return [
                ...common,
                { title: 'Presensi Anak', href: '/orang-tua/presensi', icon: UserCheck },
                { title: 'Izin', href: '/orang-tua/izin', icon: FileText },
            ];
        default:
            return common;
    }
}

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const mainNavItems = getNavItems(auth.user.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
