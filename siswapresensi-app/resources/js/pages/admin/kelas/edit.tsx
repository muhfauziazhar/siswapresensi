import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Kelas } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Kelas', href: '/admin/kelas' },
    { title: 'Edit', href: '#' },
];

interface Props {
    kelas: Kelas;
}

export default function KelasEdit({ kelas }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama: kelas.nama,
        tingkat: kelas.tingkat,
        status: kelas.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/kelas/${kelas.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kelas" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Kelas</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Kelas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Masukkan nama kelas"
                                />
                                <InputError message={errors.nama} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tingkat">Tingkat</Label>
                                <Input
                                    id="tingkat"
                                    value={data.tingkat}
                                    onChange={(e) => setData('tingkat', e.target.value)}
                                    placeholder="Masukkan tingkat"
                                />
                                <InputError message={errors.tingkat} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value: 'aktif' | 'non_aktif') => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="non_aktif">Non Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={processing}>
                                    Simpan
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/kelas">Batal</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
