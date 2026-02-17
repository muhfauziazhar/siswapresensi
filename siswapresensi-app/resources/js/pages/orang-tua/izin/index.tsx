import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Izin, PaginatedData } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/orang-tua/dashboard' },
    { title: 'Izin Anak', href: '/orang-tua/izin' },
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Izin Anak" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Izin Anak</h1>
                    <Button asChild>
                        <Link href="/orang-tua/izin/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajukan Izin
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Izin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-4 py-3 font-medium">Anak</th>
                                        <th className="px-4 py-3 font-medium">Jenis</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Alasan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {izinList.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
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
                                            <td className="px-4 py-3">{getStatusBadge(izin.status)}</td>
                                            <td className="px-4 py-3 max-w-xs truncate">{izin.alasan}</td>
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
