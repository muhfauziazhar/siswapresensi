import { usePage } from '@inertiajs/react';
import { FlashMessages } from '@/components/flash-messages';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import UserLayout from '@/layouts/user-layout';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { auth } = usePage().props;
    const items = breadcrumbs || []; // Handle undefined breadcrumbs
    
    // Admin uses the comprehensive sidebar layout
    if (auth.user.role === 'admin') {
        return (
            <AppSidebarLayout breadcrumbs={items} {...props}>
                <FlashMessages />
                {children}
            </AppSidebarLayout>
        );
    }

    // Others (Guru, Siswa, Orang Tua) use the simplified mobile-friendly layout
    return (
        <UserLayout breadcrumbs={items} {...props}>
            <FlashMessages />
            {children}
        </UserLayout>
    );
}
