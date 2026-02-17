import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Kelas, PaginatedData, Siswa } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Siswa', href: '/admin/siswa' },
];

interface Props {
    siswa: PaginatedData<Siswa>;
    kelasList: Kelas[];
    filters: {
        search?: string;
        kelas_id?: string;
    };
}

export default function SiswaIndex({ siswa, kelasList, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas_id || 'all');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilters(search, selectedKelas);
    }
    
    function handleKelasChange(value: string) {
        setSelectedKelas(value);
        applyFilters(search, value);
    }

    function applyFilters(searchValue: string, kelasValue: string) {
        router.get('/admin/siswa', { 
            search: searchValue,
            kelas_id: kelasValue === 'all' ? '' : kelasValue 
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus?')) {
            router.delete(`/admin/siswa/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h1 className="text-2xl font-bold">Manajemen Siswa</h1>
                    <div className="flex items-center gap-2">
                        <Select value={selectedKelas} onValueChange={handleKelasChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {kelasList.map((kelas) => (
                                    <SelectItem key={kelas.id} value={String(kelas.id)}>
                                        {kelas.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari siswa..."
                                className="w-full pl-8 md:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                        <Button asChild>
                            <Link href="/admin/siswa/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Siswa
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">NIS</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nama Lengkap</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Kelas</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {siswa.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                        Belum ada data siswa.
                                    </td>
                                </tr>
                            )}
                            {siswa.data.map((item) => (
                                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle">{item.nis}</td>
                                    <td className="p-4 align-middle">{item.nama_depan} {item.nama_belakang}</td>
                                    <td className="p-4 align-middle">{item.kelas?.nama}</td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={item.status === 'aktif' ? 'default' : 'secondary'}>
                                            {item.status === 'aktif' ? 'Aktif' : 'Non Aktif'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/siswa/${item.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost" 
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <Pagination links={siswa.links} />
                </div>
            </div>
        </AppLayout>
    );
}
