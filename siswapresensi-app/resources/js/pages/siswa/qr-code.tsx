import { Head, useForm, usePage } from '@inertiajs/react';
import { QrCode } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Jadwal, Siswa } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/siswa/dashboard' },
    { title: 'QR Code', href: '/siswa/qr-code' },
];

interface Props {
    jadwalHariIni: Jadwal[];
    siswa: Siswa;
    generalQrToken: string;
}

export default function QrCodePage({ jadwalHariIni, siswa, generalQrToken }: Props) {
    const { flash } = usePage<{ flash: { success?: string; qr_data?: string } }>().props;
    const [showGeneralQr, setShowGeneralQr] = useState(false);

    const { setData, post, processing } = useForm({
        jadwal_id: 0,
    });

    function handleGenerateQr(jadwalId: number) {
        setData('jadwal_id', jadwalId);
        post('/siswa/qr-code/generate');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="QR Code Saya" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">QR Code Saya</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                        {flash.success}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <QrCode className="h-6 w-6" />
                            <CardTitle>QR Code Umum</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">
                            QR Code umum dapat digunakan untuk presensi di semua jadwal.
                        </p>

                        <Button onClick={() => setShowGeneralQr(!showGeneralQr)}>
                            {showGeneralQr ? 'Sembunyikan QR' : 'Tampilkan QR Umum'}
                        </Button>

                        {showGeneralQr && (
                            <div className="flex flex-col items-center gap-2 rounded-lg border p-6">
                                <p className="font-mono text-2xl font-bold tracking-wider">{generalQrToken}</p>
                                <p className="text-muted-foreground text-xs">
                                    {siswa.nama_depan} {siswa.nama_belakang}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>QR Per Jadwal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {jadwalHariIni.length === 0 ? (
                            <p className="text-muted-foreground py-4 text-center">Tidak ada jadwal hari ini.</p>
                        ) : (
                            <div className="space-y-3">
                                {jadwalHariIni.map((jadwal) => (
                                    <div
                                        key={jadwal.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">{jadwal.mapel?.nama}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">{jadwal.kelas?.nama}</Badge>
                                                <span className="text-muted-foreground text-sm">
                                                    {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleGenerateQr(jadwal.id)}
                                            disabled={processing}
                                        >
                                            Generate QR
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {flash?.qr_data && (
                            <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">QR Code Generated</p>
                                <p className="font-mono text-2xl font-bold tracking-wider">{flash.qr_data}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
