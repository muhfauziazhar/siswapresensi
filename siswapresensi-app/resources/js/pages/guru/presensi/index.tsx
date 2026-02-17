import { Head, Link } from '@inertiajs/react';
import { ClipboardList, QrCode } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Jadwal } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/guru/dashboard' },
    { title: 'Presensi', href: '/guru/presensi' },
];

interface Props {
    jadwalHariIni: Jadwal[];
}

export default function PresensiIndex({ jadwalHariIni }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Presensi Hari Ini" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Presensi Hari Ini</h1>
                    <Button asChild>
                        <Link href="/guru/presensi/scan">
                            <QrCode className="mr-2 h-4 w-4" />
                            Scan QR
                        </Link>
                    </Button>
                </div>

                {jadwalHariIni.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">Tidak ada jadwal hari ini.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {jadwalHariIni.map((jadwal) => (
                            <Card key={jadwal.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{jadwal.mapel?.nama}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{jadwal.kelas?.nama}</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                                    </p>
                                    <Button asChild className="w-full">
                                        <Link href={`/guru/presensi/${jadwal.id}`}>
                                            <ClipboardList className="mr-2 h-4 w-4" />
                                            Ambil Presensi
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
