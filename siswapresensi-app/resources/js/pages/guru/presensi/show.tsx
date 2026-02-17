import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Jadwal, Presensi, Siswa } from '@/types/models';

type SiswaWithPresensi = Siswa & { presensi_status: string | null };

function getStatusBadge(status: string) {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
        hadir: 'default',
        izin: 'secondary',
        sakit: 'outline',
        alpha: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

interface Props {
    jadwal: Jadwal;
    siswaList: SiswaWithPresensi[];
    presensiRecords: Presensi[];
}

export default function PresensiShow({ jadwal, siswaList, presensiRecords }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/guru/dashboard' },
        { title: 'Presensi', href: '/guru/presensi' },
        { title: jadwal.mapel?.nama ?? 'Detail', href: `/guru/presensi/${jadwal.id}` },
    ];

    const [mode, setMode] = useState<'reverse' | 'manual'>('reverse');

    const { data, setData, post, processing } = useForm({
        jadwal_id: jadwal.id,
        tanggal: new Date().toISOString().split('T')[0],
        absensi: [] as Array<{ siswa_id: number; status: string }>,
    });

    const hasExistingPresensi = presensiRecords.length > 0;

    function handleCheckAbsent(siswaId: number, checked: boolean) {
        if (checked) {
            setData('absensi', [...data.absensi, { siswa_id: siswaId, status: 'alpha' }]);
        } else {
            setData(
                'absensi',
                data.absensi.filter((item) => item.siswa_id !== siswaId),
            );
        }
    }

    function handleStatusChange(siswaId: number, status: string) {
        setData(
            'absensi',
            data.absensi.map((item) => (item.siswa_id === siswaId ? { ...item, status } : item)),
        );
    }

    function isAbsent(siswaId: number): boolean {
        return data.absensi.some((item) => item.siswa_id === siswaId);
    }

    function getAbsentStatus(siswaId: number): string {
        return data.absensi.find((item) => item.siswa_id === siswaId)?.status ?? 'alpha';
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/guru/presensi/reverse-marking');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Presensi - ${jadwal.mapel?.nama}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">
                    Presensi - {jadwal.mapel?.nama} ({jadwal.kelas?.nama})
                </h1>

                <Card>
                    <CardContent className="flex gap-6 pt-6">
                        <div>
                            <span className="text-muted-foreground text-sm">Mapel</span>
                            <p className="font-medium">{jadwal.mapel?.nama}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-sm">Kelas</span>
                            <p className="font-medium">{jadwal.kelas?.nama}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-sm">Waktu</span>
                            <p className="font-medium">
                                {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {hasExistingPresensi && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Presensi Hari Ini (Tercatat)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-4 py-3 font-medium">Siswa</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {presensiRecords.map((record) => (
                                            <tr key={record.id} className="border-b">
                                                <td className="px-4 py-3">
                                                    {record.siswa?.nama_depan} {record.siswa?.nama_belakang}
                                                </td>
                                                <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                                                <td className="px-4 py-3">{record.marked_at ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex gap-2">
                    <Button variant={mode === 'reverse' ? 'default' : 'outline'} onClick={() => setMode('reverse')}>
                        Reverse Marking
                    </Button>
                    <Button variant={mode === 'manual' ? 'default' : 'outline'} onClick={() => setMode('manual')}>
                        Manual
                    </Button>
                </div>

                {mode === 'reverse' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Reverse Marking</CardTitle>
                            <p className="text-muted-foreground text-sm">
                                Semua siswa dianggap hadir. Centang siswa yang tidak hadir.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="px-4 py-3 font-medium">Tidak Hadir</th>
                                                <th className="px-4 py-3 font-medium">Siswa</th>
                                                <th className="px-4 py-3 font-medium">Status</th>
                                                <th className="px-4 py-3 font-medium">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {siswaList.map((siswa) => (
                                                <tr key={siswa.id} className="border-b">
                                                    <td className="px-4 py-3">
                                                        <Checkbox
                                                            checked={isAbsent(siswa.id)}
                                                            onCheckedChange={(checked) =>
                                                                handleCheckAbsent(siswa.id, !!checked)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {siswa.nama_depan} {siswa.nama_belakang}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {isAbsent(siswa.id) ? (
                                                            <Select
                                                                value={getAbsentStatus(siswa.id)}
                                                                onValueChange={(value) =>
                                                                    handleStatusChange(siswa.id, value)
                                                                }
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="izin">Izin</SelectItem>
                                                                    <SelectItem value="sakit">Sakit</SelectItem>
                                                                    <SelectItem value="alpha">Alpha</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            getStatusBadge('hadir')
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {siswa.presensi_status
                                                            ? getStatusBadge(siswa.presensi_status)
                                                            : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Simpan Presensi
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {mode === 'manual' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Siswa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-4 py-3 font-medium">Siswa</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswaList.map((siswa) => (
                                            <tr key={siswa.id} className="border-b">
                                                <td className="px-4 py-3">
                                                    {siswa.nama_depan} {siswa.nama_belakang}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {siswa.presensi_status
                                                        ? getStatusBadge(siswa.presensi_status)
                                                        : <Badge variant="outline">Belum</Badge>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
