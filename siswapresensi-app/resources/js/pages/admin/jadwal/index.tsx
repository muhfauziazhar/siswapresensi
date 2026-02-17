import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Jadwal, PaginatedData } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Jadwal', href: '/admin/jadwal' },
];

interface Props {
    jadwal: PaginatedData<Jadwal>;
}

export default function JadwalIndex({ jadwal }: Props) {
    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus?')) {
            router.delete(`/admin/jadwal/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Jadwal" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Jadwal</h1>
                    <Button asChild>
                        <Link href="/admin/jadwal/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Jadwal
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Jadwal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-4 py-3 font-medium">Hari</th>
                                        <th className="px-4 py-3 font-medium">Kelas</th>
                                        <th className="px-4 py-3 font-medium">Mapel</th>
                                        <th className="px-4 py-3 font-medium">Guru</th>
                                        <th className="px-4 py-3 font-medium">Waktu</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jadwal.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                Belum ada data jadwal.
                                            </td>
                                        </tr>
                                    )}
                                    {jadwal.data.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-4 py-3 capitalize">{item.hari}</td>
                                            <td className="px-4 py-3">{item.kelas?.nama}</td>
                                            <td className="px-4 py-3">{item.mapel?.nama}</td>
                                            <td className="px-4 py-3">{item.guru?.nama}</td>
                                            <td className="px-4 py-3">{item.waktu_mulai} - {item.waktu_selesai}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={item.status === 'aktif' ? 'default' : 'secondary'}>
                                                    {item.status === 'aktif' ? 'Aktif' : 'Non Aktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/admin/jadwal/${item.id}/edit`}>
                                                            <Pencil className="mr-1 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="mr-1 h-4 w-4" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination links={jadwal.links} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
