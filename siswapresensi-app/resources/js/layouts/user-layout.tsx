import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppHeaderUser } from '@/components/app-header-user';
import type { AppLayoutProps } from '@/types';

export default function UserLayout({ children }: AppLayoutProps) {
    return (
        <AppShell>
            <AppHeaderUser />
            <AppContent className="pb-20 md:pb-8 container max-w-7xl mx-auto">
                {children}
            </AppContent>
        </AppShell>
    );
}
