import { Head, router, useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Izin, PaginatedData } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/guru/dashboard' },
    { title: 'Izin Siswa', href: '/guru/izin' },
];

function getJenisBadge(jenis: string) {
    return <Badge variant={jenis === 'sakit' ? 'outline' : 'secondary'}>{jenis.charAt(0).toUpperCase() + jenis.slice(1)}</Badge>;
}

function getStatusBadge(status: string) {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
        pending: 'secondary',
        approved: 'default',
        rejected: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

interface Props {
    izinList: PaginatedData<Izin>;
}

export default function IzinIndex({ izinList }: Props) {
    const [rejectingId, setRejectingId] = useState<number | null>(null);

    const rejectForm = useForm({
        catatan: '',
    });

    function handleApprove(id: number) {
        router.put(`/guru/izin/${id}/approve`);
    }

    function handleReject(id: number) {
        rejectForm.put(`/guru/izin/${id}/reject`, {
            onSuccess: () => {
                setRejectingId(null);
                rejectForm.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Izin Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Izin Siswa</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Permohonan Izin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-4 py-3 font-medium">Siswa</th>
                                        <th className="px-4 py-3 font-medium">Jenis</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Alasan</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {izinList.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                                                Belum ada permohonan izin.
                                            </td>
                                        </tr>
                                    )}
                                    {izinList.data.map((izin) => (
                                        <tr key={izin.id} className="border-b">
                                            <td className="px-4 py-3">
                                                {izin.siswa?.nama_depan} {izin.siswa?.nama_belakang}
                                            </td>
                                            <td className="px-4 py-3">{getJenisBadge(izin.jenis)}</td>
                                            <td className="px-4 py-3">
                                                {izin.tanggal_mulai} - {izin.tanggal_selesai}
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate">{izin.alasan}</td>
                                            <td className="px-4 py-3">{getStatusBadge(izin.status)}</td>
                                            <td className="px-4 py-3">
                                                {izin.status === 'pending' && (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleApprove(izin.id)}
                                                        >
                                                            <Check className="mr-1 h-4 w-4" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => setRejectingId(izin.id)}
                                                        >
                                                            <X className="mr-1 h-4 w-4" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}

                                                {rejectingId === izin.id && (
                                                    <div className="mt-2 space-y-2">
                                                        <Label htmlFor={`catatan-${izin.id}`}>Catatan</Label>
                                                        <Input
                                                            id={`catatan-${izin.id}`}
                                                            value={rejectForm.data.catatan}
                                                            onChange={(e) =>
                                                                rejectForm.setData('catatan', e.target.value)
                                                            }
                                                            placeholder="Alasan penolakan"
                                                        />
                                                        <InputError message={rejectForm.errors.catatan} />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleReject(izin.id)}
                                                                disabled={rejectForm.processing}
                                                            >
                                                                Konfirmasi Reject
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setRejectingId(null);
                                                                    rejectForm.reset();
                                                                }}
                                                            >
                                                                Batal
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination links={izinList.links} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
