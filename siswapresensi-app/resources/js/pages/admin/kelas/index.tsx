import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Kelas, PaginatedData } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Kelas', href: '/admin/kelas' },
];

interface Props {
    kelas: PaginatedData<Kelas>;
}

export default function KelasIndex({ kelas }: Props) {
    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus?')) {
            router.delete(`/admin/kelas/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kelas" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
                    <Button asChild>
                        <Link href="/admin/kelas/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kelas
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kelas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-4 py-3 font-medium">Nama</th>
                                        <th className="px-4 py-3 font-medium">Tingkat</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kelas.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                Belum ada data kelas.
                                            </td>
                                        </tr>
                                    )}
                                    {kelas.data.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-4 py-3">{item.nama}</td>
                                            <td className="px-4 py-3">{item.tingkat}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={item.status === 'aktif' ? 'default' : 'secondary'}>
                                                    {item.status === 'aktif' ? 'Aktif' : 'Non Aktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/admin/kelas/${item.id}/edit`}>
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

                        <Pagination links={kelas.links} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
