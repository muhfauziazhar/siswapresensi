import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, ShieldAlert, Thermometer } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/components/pagination';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedData, Presensi, Siswa } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/orang-tua/dashboard' },
    { title: 'Presensi Anak', href: '/orang-tua/presensi' },
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
    anak: Siswa[];
    presensi: PaginatedData<Presensi>;
    stats: { hadir: number; izin: number; sakit: number; alpha: number };
}

export default function PresensiAnak({ anak, presensi, stats }: Props) {
    const [selectedAnak, setSelectedAnak] = useState('');

    function handleFilterAnak(value: string) {
        setSelectedAnak(value);
        router.get(
            '/orang-tua/presensi',
            { siswa_id: value === 'all' ? undefined : value },
            { preserveState: true },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Presensi Anak" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Presensi Anak</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Hadir" value={stats.hadir} icon={CheckCircle} />
                    <StatsCard title="Izin" value={stats.izin} icon={Calendar} />
                    <StatsCard title="Sakit" value={stats.sakit} icon={Thermometer} />
                    <StatsCard title="Alpha" value={stats.alpha} icon={ShieldAlert} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Anak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={selectedAnak} onValueChange={handleFilterAnak}>
                            <SelectTrigger className="w-64">
                                <SelectValue placeholder="Semua anak" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Anak</SelectItem>
                                {anak.map((child) => (
                                    <SelectItem key={child.id} value={String(child.id)}>
                                        {child.nama_depan} {child.nama_belakang}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                        <th className="px-4 py-3 font-medium">Anak</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Mapel</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {presensi.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-muted-foreground px-4 py-8 text-center">
                                                Belum ada data presensi.
                                            </td>
                                        </tr>
                                    )}
                                    {presensi.data.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-4 py-3">
                                                {item.siswa?.nama_depan} {item.siswa?.nama_belakang}
                                            </td>
                                            <td className="px-4 py-3">{item.tanggal}</td>
                                            <td className="px-4 py-3">{item.jadwal?.mapel?.nama ?? '-'}</td>
                                            <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
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
