import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function SiswaDashboard({ siswa, jadwalHariIni, recentPresensi, stats }: Props) {
    const totalPresensi = stats.hadir + stats.izin + stats.sakit + stats.alpha;
    const attendanceRate = totalPresensi > 0 ? Math.round((stats.hadir / totalPresensi) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Siswa" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Hai, {siswa.nama_depan}!</h2>
                    <p className="text-muted-foreground text-lg">Semangat belajar hari ini.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Attendance Health Card */}
                    <Card className="md:col-span-1 shadow-sm">
                        <CardHeader>
                            <CardTitle>Kehadiran Kamu</CardTitle>
                            <CardDescription>Statistik semester ini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="relative flex items-center justify-center">
                                    <svg className="h-32 w-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            className="text-muted/20"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            strokeDasharray={351.86}
                                            strokeDashoffset={351.86 - (351.86 * attendanceRate) / 100}
                                            className={`transition-all duration-1000 ease-out ${
                                                attendanceRate >= 90 ? 'text-green-500' : attendanceRate >= 75 ? 'text-yellow-500' : 'text-red-500'
                                            }`}
                                        />
                                    </svg>
                                    <span className="absolute text-3xl font-bold">{attendanceRate}%</span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground font-medium">Tingkat Kehadiran</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                    <span className="text-2xl font-bold text-green-600">{stats.hadir}</span>
                                    <span className="text-xs text-green-700">Hadir</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                    <span className="text-2xl font-bold text-red-600">{stats.alpha}</span>
                                    <span className="text-xs text-red-700">Alpha</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <span className="text-2xl font-bold text-blue-600">{stats.izin}</span>
                                    <span className="text-xs text-blue-700">Izin</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <span className="text-2xl font-bold text-orange-600">{stats.sakit}</span>
                                    <span className="text-xs text-orange-700">Sakit</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule Timeline */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Jadwal Hari Ini</CardTitle>
                                <CardDescription>
                                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {jadwalHariIni.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                        <div className="rounded-full bg-muted p-4 mb-4">
                                            <Calendar className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-lg font-medium">Libur!</h3>
                                        <p>Tidak ada jadwal pelajaran hari ini.</p>
                                    </div>
                                ) : (
                                    <div className="relative border-l border-muted pl-6 space-y-8 ml-2">
                                        {jadwalHariIni.map((jadwal) => (
                                            <div key={jadwal.id} className="relative">
                                                <span className="absolute -left-[2.35rem] flex h-5 w-5 items-center justify-center rounded-full bg-background ring-4 ring-background">
                                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                                </span>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4 bg-card hover:bg-accent/50 transition-colors">
                                                    <div className="space-y-1">
                                                        <h4 className="font-semibold text-lg">{jadwal.mapel?.nama}</h4>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <Clock className="h-3 w-3" />
                                                            {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="w-fit">
                                                        {jadwal.mapel?.kode ?? 'MAPEL'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent History (Compact) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentPresensi.length === 0 ? (
                             <p className="text-muted-foreground text-sm">Belum ada riwayat.</p>
                        ) : (
                            <div className="divide-y">
                                {recentPresensi.map((presensi) => (
                                    <div key={presensi.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${
                                                presensi.status === 'hadir' ? 'bg-green-100 text-green-600' :
                                                presensi.status === 'alpha' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {presensi.status === 'hadir' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{presensi.jadwal?.mapel?.nama}</p>
                                                <p className="text-xs text-muted-foreground">{presensi.tanggal}</p>
                                            </div>
                                        </div>
                                        <Badge variant={presensi.status === 'hadir' ? 'default' : 'secondary'}>
                                            {presensi.status.charAt(0).toUpperCase() + presensi.status.slice(1)}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
