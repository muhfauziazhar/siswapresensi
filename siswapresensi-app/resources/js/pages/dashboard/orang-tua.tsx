import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

export default function OrangTuaDashboard({ orangTua, anak, recentPresensi, pendingIzinCount }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Orang Tua" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Selamat Datang, {orangTua.nama}</h2>
                        <p className="text-muted-foreground text-lg">Pantau perkembangan pendidikan putra-putri Anda.</p>
                    </div>
                </div>

                {/* Children Overview Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {anak.map((child) => (
                        <Card key={child.id} className="overflow-hidden border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{child.nama_depan}</CardTitle>
                                            <CardDescription>{child.nama_lengkap}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={child.status === 'aktif' ? 'default' : 'secondary'}>
                                        {child.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span className="font-medium text-foreground">Kelas {child.kelas?.nama}</span>
                                    </div>
                                        <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">NIS: {child.nis}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 pt-4">
                                <div className="w-full flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Status Hari Ini:</span>
                                    <Badge variant="outline" className="ml-auto bg-background">
                                        Belum Ada Data
                                    </Badge>
                                    {/* Ideally we would show real status here if available in the 'anak' prop */}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity Feed */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Aktivitas Terbaru
                            </CardTitle>
                            <CardDescription>Riwayat kehadiran terakhir anak-anak Anda.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentPresensi.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p>Belum ada aktivitas presensi tercatat.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {recentPresensi.map((presensi, index) => (
                                        <div key={presensi.id} className="relative pl-6 border-l border-muted">
                                            <span className={`absolute -left-[0.275rem] top-1 h-2 w-2 rounded-full ${
                                                presensi.status === 'hadir' ? 'bg-green-500' :
                                                presensi.status === 'alpha' ? 'bg-red-500' : 'bg-orange-500'
                                            }`} />
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        <span className="font-bold">{presensi.siswa?.nama_depan}</span>
                                                        <span className="text-muted-foreground mx-1">
                                                            {presensi.status === 'hadir' ? 'hadir di' :
                                                             presensi.status === 'izin' ? 'izin pada' :
                                                             presensi.status === 'sakit' ? 'sakit pada' : 'alpha di'}
                                                        </span>
                                                        {presensi.jadwal?.mapel?.nama ?? 'Kelas'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {presensi.tanggal}
                                                    </p>
                                                </div>
                                                <Badge variant={
                                                    presensi.status === 'hadir' ? 'default' :
                                                    presensi.status === 'alpha' ? 'destructive' : 'secondary'
                                                }>
                                                    {presensi.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                            {index < recentPresensi.length - 1 && <Separator className="my-4" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Permissions Widget */}
                    <Card>
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg">Ajukan Izin</CardTitle>
                            <CardDescription>Anak tidak bisa masuk sekolah?</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                Buat surat izin sakit atau keperluan keluarga dengan mudah melalui aplikasi.
                            </p>
                            <Button className="w-full" asChild>
                                <Link href="/orang-tua/izin/create">
                                    Buat Surat Izin <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                        <Separator />
                         <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Izin Pending</span>
                                <Badge variant={pendingIzinCount > 0 ? "destructive" : "outline"}>
                                    {pendingIzinCount}
                                </Badge>
                            </div>
                         </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
