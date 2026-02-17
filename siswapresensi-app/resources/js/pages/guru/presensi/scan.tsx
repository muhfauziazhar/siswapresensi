import { Head, useForm, usePage } from '@inertiajs/react';
import { QrCode } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/guru/dashboard' },
    { title: 'Presensi', href: '/guru/presensi' },
    { title: 'Scan QR', href: '/guru/presensi/scan' },
];

export default function PresensiScan() {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const { data, setData, post, processing, errors } = useForm({
        qr_data: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/guru/presensi/scan');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan QR Code" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Scan QR Code</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        {flash.error}
                    </div>
                )}

                <Card className="mx-auto w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <QrCode className="h-8 w-8" />
                            <div>
                                <CardTitle>Validasi QR Code</CardTitle>
                                <p className="text-muted-foreground text-sm">
                                    Masukkan kode QR siswa untuk mencatat presensi.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="qr_data">Kode QR</Label>
                                <Input
                                    id="qr_data"
                                    value={data.qr_data}
                                    onChange={(e) => setData('qr_data', e.target.value)}
                                    placeholder="Masukkan atau scan kode QR"
                                    autoFocus
                                />
                                <InputError message={errors.qr_data} />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                Validasi QR
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
