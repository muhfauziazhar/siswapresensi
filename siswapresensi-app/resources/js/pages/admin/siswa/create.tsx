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
import type { Kelas, OrangTua } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Siswa', href: '/admin/siswa' },
    { title: 'Tambah', href: '/admin/siswa/create' },
];

interface Props {
    kelasList: Kelas[];
    orangTuaList: OrangTua[];
}

export default function SiswaCreate({ kelasList, orangTuaList }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nama_depan: '',
        nama_belakang: '',
        nis: '',
        kelas_id: '',
        orang_tua_id: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/siswa');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tambah Siswa</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama_depan">Nama Depan</Label>
                                <Input
                                    id="nama_depan"
                                    value={data.nama_depan}
                                    onChange={(e) => setData('nama_depan', e.target.value)}
                                    placeholder="Masukkan nama depan"
                                />
                                <InputError message={errors.nama_depan} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama_belakang">Nama Belakang</Label>
                                <Input
                                    id="nama_belakang"
                                    value={data.nama_belakang}
                                    onChange={(e) => setData('nama_belakang', e.target.value)}
                                    placeholder="Masukkan nama belakang"
                                />
                                <InputError message={errors.nama_belakang} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nis">NIS</Label>
                                <Input
                                    id="nis"
                                    value={data.nis}
                                    onChange={(e) => setData('nis', e.target.value)}
                                    placeholder="Masukkan NIS"
                                />
                                <InputError message={errors.nis} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kelas_id">Kelas</Label>
                                <Select
                                    value={data.kelas_id}
                                    onValueChange={(value) => setData('kelas_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelasList.map((kelas) => (
                                            <SelectItem key={kelas.id} value={String(kelas.id)}>
                                                {kelas.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kelas_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="orang_tua_id">Orang Tua (Opsional)</Label>
                                <Select
                                    value={data.orang_tua_id}
                                    onValueChange={(value) => setData('orang_tua_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih orang tua" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orangTuaList.map((orangTua) => (
                                            <SelectItem key={orangTua.id} value={String(orangTua.id)}>
                                                {orangTua.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.orang_tua_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Konfirmasi password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={processing}>
                                    Simpan
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/siswa">Batal</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
