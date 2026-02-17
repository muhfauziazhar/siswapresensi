import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle, Clock, MapPin, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function GuruDashboard({ jadwalHariIni, pendingIzin, guru }: Props) {
    // Determine current or next class
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const currentOrNextClass = jadwalHariIni.find((jadwal) => {
        const [startHour, startMinute] = jadwal.waktu_mulai.split(':').map(Number);
        const [endHour, endMinute] = jadwal.waktu_selesai.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        // If class is currently happening or starts in the future
        return endTime > currentTime;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Guru" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Welcome & Hero Section */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Halo, {guru.nama}!</h2>
                            <p className="text-muted-foreground text-lg">Siap mengajar hari ini?</p>
                        </div>

                        {/* Hero Card: Current/Next Class */}
                        {currentOrNextClass ? (
                            <Card className="border-l-4 border-l-primary shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="mb-2">
                                            {currentOrNextClass.waktu_mulai < new Date().toTimeString().slice(0, 5) ? 'Sedang Berlangsung' : 'Selanjutnya'}
                                        </Badge>
                                        <span className="text-muted-foreground font-mono text-sm">
                                            {currentOrNextClass.waktu_mulai} - {currentOrNextClass.waktu_selesai}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl">{currentOrNextClass.mapel?.nama}</CardTitle>
                                    <CardDescription className="text-base flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Kelas {currentOrNextClass.kelas?.nama}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{currentOrNextClass.waktu_mulai} - {currentOrNextClass.waktu_selesai}</span>
                                            </div>
                                        </div>
                                        <Button asChild size="lg" className="shadow-lg">
                                            <Link href={`/guru/presensi/${currentOrNextClass.id}`}>
                                                {currentOrNextClass.presensi_count && currentOrNextClass.presensi_count > 0 ? (
                                                    <>
                                                        <CheckCircle className="mr-2 h-5 w-5" />
                                                        Sudah Absen
                                                    </>
                                                ) : (
                                                    <>
                                                        Mulai Kelas
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </>
                                                )}
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="bg-muted/50 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="rounded-full bg-background p-3 mb-4">
                                        <Calendar className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">Tidak ada jadwal tersisa</h3>
                                    <p className="text-muted-foreground">Anda telah menyelesaikan semua kelas hari ini.</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Timeline Schedule */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Jadwal Hari Ini</h3>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="relative border-l border-muted pl-6 space-y-8">
                                        {jadwalHariIni.length === 0 ? (
                                            <p className="text-muted-foreground italic">Tidak ada jadwal.</p>
                                        ) : (
                                            jadwalHariIni.map((jadwal, index) => {
                                                const isDone = jadwal.presensi_count && jadwal.presensi_count > 0;
                                                const isNext = jadwal.id === currentOrNextClass?.id;

                                                return (
                                                    <div key={jadwal.id} className={`relative ${isNext ? 'opacity-100' : 'opacity-75'}`}>
                                                        <span className={`absolute -left-[2.3rem] flex h-4 w-4 rounded-full ring-4 ring-background ${isDone ? 'bg-green-500' : isNext ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                                        
                                                        <Link href={`/guru/presensi/${jadwal.id}`} className="block">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer group">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-semibold group-hover:text-primary transition-colors">{jadwal.mapel?.nama}</p>
                                                                        {isDone && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {jadwal.kelas?.nama} &bull; {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {isDone ? (
                                                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                                            Selesai
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="secondary">Belum</Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar: Tasks / Updates */}
                    <div className="space-y-6">
                         {/* Pending Izin Widget */}
                         <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>Persetujuan Izin</span>
                                    {pendingIzin.length > 0 && <Badge variant="destructive" className="ml-auto">{pendingIzin.length}</Badge>}
                                </CardTitle>
                                <CardDescription>Permintaan izin siswa yang perlu ditinjau.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <div className="h-[400px] overflow-y-auto pr-2">
                                    {pendingIzin.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                            <CheckCircle className="h-10 w-10 mb-2 opacity-20" />
                                            <p>Semua beres! Tidak ada permintaan izin pending.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {pendingIzin.map((izin) => (
                                                <div key={izin.id} className="p-4 hover:bg-muted/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-medium text-sm">{izin.siswa?.nama_lengkap}</p>
                                                        <span className="text-xs text-muted-foreground">{izin.tanggal_mulai}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                                        {izin.alasan}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" className="w-full text-xs h-8" asChild>
                                                            <Link href="/guru/izin">Tinjau</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
