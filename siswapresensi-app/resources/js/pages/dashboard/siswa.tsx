import { Head, Link } from '@inertiajs/react';
import { AlertCircle, FileText, HeartPulse, UserCheck } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Jadwal, Presensi, Siswa } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    siswa: Siswa;
    jadwalHariIni: Jadwal[];
    recentPresensi: Presensi[];
    stats: {
        hadir: number;
        izin: number;
        sakit: number;
        alpha: number;
    };
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

export default function SiswaDashboard({ siswa, jadwalHariIni, recentPresensi, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, {siswa.nama_lengkap}!</h2>
                        <p className="text-muted-foreground">Kelas: {siswa.kelas?.nama ?? '-'}</p>
                    </div>
                    <Button asChild>
                        <Link href="/siswa/qr-code">Lihat QR Code</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Hadir" value={stats.hadir} icon={UserCheck} />
                    <StatsCard title="Izin" value={stats.izin} icon={FileText} />
                    <StatsCard title="Sakit" value={stats.sakit} icon={HeartPulse} />
                    <StatsCard title="Alpha" value={stats.alpha} icon={AlertCircle} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {jadwalHariIni.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Tidak ada jadwal hari ini.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 text-left font-medium">Mapel</th>
                                                <th className="py-2 text-left font-medium">Kelas</th>
                                                <th className="py-2 text-left font-medium">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jadwalHariIni.map((jadwal) => (
                                                <tr key={jadwal.id} className="border-b last:border-0">
                                                    <td className="py-2">{jadwal.mapel?.nama ?? '-'}</td>
                                                    <td className="py-2">{jadwal.kelas?.nama ?? '-'}</td>
                                                    <td className="py-2">
                                                        {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                                                    </td>
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
                            <CardTitle>Riwayat Presensi Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentPresensi.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Belum ada riwayat presensi.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 text-left font-medium">Mapel</th>
                                                <th className="py-2 text-left font-medium">Status</th>
                                                <th className="py-2 text-left font-medium">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentPresensi.map((presensi) => (
                                                <tr key={presensi.id} className="border-b last:border-0">
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
