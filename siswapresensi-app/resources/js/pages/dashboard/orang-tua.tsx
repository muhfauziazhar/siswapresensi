import { Head } from '@inertiajs/react';
import { FileText, Users } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { OrangTua, Presensi, Siswa } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    orangTua: OrangTua;
    anak: Siswa[];
    recentPresensi: Presensi[];
    pendingIzinCount: number;
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

export default function OrangTuaDashboard({ orangTua, anak, recentPresensi, pendingIzinCount }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Orang Tua" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, {orangTua.nama}!</h2>
                    <p className="text-muted-foreground">Pantau kehadiran anak Anda di sini.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <StatsCard title="Total Anak" value={anak.length} icon={Users} />
                    <StatsCard title="Pending Izin" value={pendingIzinCount} icon={FileText} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Anak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {anak.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Belum ada data anak.</p>
                            ) : (
                                <div className="space-y-3">
                                    {anak.map((child) => (
                                        <div key={child.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div>
                                                <p className="font-medium">{child.nama_lengkap ?? `${child.nama_depan} ${child.nama_belakang}`}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    NIS: {child.nis} &middot; Kelas: {child.kelas?.nama ?? '-'}
                                                </p>
                                            </div>
                                            <Badge variant={child.status === 'aktif' ? 'default' : 'secondary'}>
                                                {child.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

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
                                                <th className="py-2 text-left font-medium">Tanggal</th>
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
                                                    <td className="py-2">{presensi.tanggal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
