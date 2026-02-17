import { Head, Link } from '@inertiajs/react';
import { BookOpen, CalendarCheck, FileText } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Guru, Izin, Jadwal } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    jadwalHariIni: Jadwal[];
    pendingIzin: Izin[];
    todayPresensiCount: number;
    guru: Guru;
}

export default function GuruDashboard({ jadwalHariIni, pendingIzin, todayPresensiCount, guru }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Guru" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, {guru.nama}!</h2>
                    <p className="text-muted-foreground">Berikut ringkasan aktivitas Anda hari ini.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <StatsCard title="Jadwal Hari Ini" value={jadwalHariIni.length} icon={CalendarCheck} />
                    <StatsCard title="Total Presensi Hari Ini" value={todayPresensiCount} icon={BookOpen} />
                    <StatsCard title="Pending Izin" value={pendingIzin.length} icon={FileText} />
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
                                                <th className="py-2 text-left font-medium">Aksi</th>
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
                                                    <td className="py-2">
                                                        <Button asChild size="sm">
                                                            <Link href={`/guru/presensi/${jadwal.id}`}>Ambil Presensi</Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {pendingIzin.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Izin Pending</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
