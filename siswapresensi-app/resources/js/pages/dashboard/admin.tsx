import { Head } from '@inertiajs/react';
import { AlertCircle, FileText, GraduationCap, UserCheck } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { DashboardStats, Izin, Presensi } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats: DashboardStats;
    recentPresensi: Presensi[];
    pendingIzin: Izin[];
}

function statusBadgeVariant(status: string) {
    switch (status) {
        case 'hadir':
            return 'default';
        case 'izin':
            return 'secondary';
        case 'sakit':
            return 'outline';
        case 'alpha':
            return 'destructive';
        default:
            return 'default';
    }
}

export default function AdminDashboard({ stats, recentPresensi, pendingIzin }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Total Siswa" value={stats.total_siswa} icon={GraduationCap} />
                    <StatsCard title="Hadir Hari Ini" value={stats.hadir_hari_ini} icon={UserCheck} />
                    <StatsCard title="Izin Hari Ini" value={stats.izin_hari_ini} icon={FileText} />
                    <StatsCard title="Alpha Hari Ini" value={stats.alpha_hari_ini} icon={AlertCircle} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Presensi Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentPresensi.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Belum ada data presensi.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 text-left font-medium">Siswa</th>
                                                <th className="py-2 text-left font-medium">Mapel</th>
                                                <th className="py-2 text-left font-medium">Status</th>
                                                <th className="py-2 text-left font-medium">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentPresensi.map((presensi) => (
                                                <tr key={presensi.id} className="border-b last:border-0">
                                                    <td className="py-2">{presensi.siswa?.nama_lengkap ?? '-'}</td>
                                                    <td className="py-2">{presensi.jadwal?.mapel?.nama ?? '-'}</td>
                                                    <td className="py-2">
                                                        <Badge variant={statusBadgeVariant(presensi.status)}>
                                                            {presensi.status.charAt(0).toUpperCase() + presensi.status.slice(1)}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-2">{presensi.marked_at ?? presensi.created_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Izin Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingIzin.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Tidak ada izin pending.</p>
                            ) : (
                                <div className="space-y-3">
                                    {pendingIzin.map((izin) => (
                                        <div key={izin.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div>
                                                <p className="font-medium">{izin.siswa?.nama_lengkap ?? '-'}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {izin.jenis.charAt(0).toUpperCase() + izin.jenis.slice(1)} &middot; {izin.tanggal_mulai}
                                                </p>
                                            </div>
                                            <Badge variant="secondary">Pending</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
