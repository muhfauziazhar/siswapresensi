import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, ShieldAlert, Thermometer } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/components/pagination';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedData, Presensi } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/siswa/dashboard' },
    { title: 'Riwayat Presensi', href: '/siswa/presensi-history' },
];

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
    presensi: PaginatedData<Presensi>;
    stats: { hadir: number; izin: number; sakit: number; alpha: number };
    filters: { tanggal_mulai?: string; tanggal_selesai?: string };
}

export default function PresensiHistory({ presensi, stats, filters }: Props) {
    const [tanggalMulai, setTanggalMulai] = useState(filters.tanggal_mulai ?? '');
    const [tanggalSelesai, setTanggalSelesai] = useState(filters.tanggal_selesai ?? '');

    function handleFilter() {
        router.get(
            '/siswa/presensi-history',
            { tanggal_mulai: tanggalMulai, tanggal_selesai: tanggalSelesai },
            { preserveState: true },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Presensi" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Riwayat Presensi</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Hadir" value={stats.hadir} icon={CheckCircle} />
                    <StatsCard title="Izin" value={stats.izin} icon={Calendar} />
                    <StatsCard title="Sakit" value={stats.sakit} icon={Thermometer} />
                    <StatsCard title="Alpha" value={stats.alpha} icon={ShieldAlert} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="date"
                                    value={tanggalMulai}
                                    onChange={(e) => setTanggalMulai(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                <Input
                                    id="tanggal_selesai"
                                    type="date"
                                    value={tanggalSelesai}
                                    onChange={(e) => setTanggalSelesai(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleFilter}>Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Presensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Mapel</th>
                                        <th className="px-4 py-3 font-medium">Kelas</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {presensi.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                                                Belum ada data presensi.
                                            </td>
                                        </tr>
                                    )}
                                    {presensi.data.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-4 py-3">{item.tanggal}</td>
                                            <td className="px-4 py-3">{item.jadwal?.mapel?.nama ?? '-'}</td>
                                            <td className="px-4 py-3">{item.jadwal?.kelas?.nama ?? '-'}</td>
                                            <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                                            <td className="px-4 py-3">{item.marked_at ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination links={presensi.links} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
