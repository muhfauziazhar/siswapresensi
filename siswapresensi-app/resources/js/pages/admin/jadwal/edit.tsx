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
import type { Guru, Jadwal, Kelas, Mapel } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Jadwal', href: '/admin/jadwal' },
    { title: 'Edit', href: '#' },
];

interface Props {
    jadwal: Jadwal;
    kelasList: Kelas[];
    mapelList: Mapel[];
    guruList: Guru[];
}

export default function JadwalEdit({ jadwal, kelasList, mapelList, guruList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        kelas_id: String(jadwal.kelas_id),
        mapel_id: String(jadwal.mapel_id),
        guru_id: String(jadwal.guru_id),
        hari: jadwal.hari,
        waktu_mulai: jadwal.waktu_mulai,
        waktu_selesai: jadwal.waktu_selesai,
        status: jadwal.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/jadwal/${jadwal.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Jadwal" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Jadwal</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Jadwal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(errors as any).conflict && (
                            <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                <span className="font-bold">Error:</span> {(errors as any).conflict}
                            </div>
                        )}
                        <form onSubmit={submit} className="space-y-4">
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
                                <Label htmlFor="mapel_id">Mata Pelajaran</Label>
                                <Select
                                    value={data.mapel_id}
                                    onValueChange={(value) => setData('mapel_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mata pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mapelList.map((mapel) => (
                                            <SelectItem key={mapel.id} value={String(mapel.id)}>
                                                {mapel.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.mapel_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guru_id">Guru</Label>
                                <Select
                                    value={data.guru_id}
                                    onValueChange={(value) => setData('guru_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih guru" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {guruList.map((guru) => (
                                            <SelectItem key={guru.id} value={String(guru.id)}>
                                                {guru.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.guru_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hari">Hari</Label>
                                <Select
                                    value={data.hari}
                                    onValueChange={(value: 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu') => setData('hari', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih hari" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="senin">Senin</SelectItem>
                                        <SelectItem value="selasa">Selasa</SelectItem>
                                        <SelectItem value="rabu">Rabu</SelectItem>
                                        <SelectItem value="kamis">Kamis</SelectItem>
                                        <SelectItem value="jumat">Jumat</SelectItem>
                                        <SelectItem value="sabtu">Sabtu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.hari} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="waktu_mulai">Waktu Mulai</Label>
                                <Input
                                    id="waktu_mulai"
                                    type="time"
                                    value={data.waktu_mulai}
                                    onChange={(e) => setData('waktu_mulai', e.target.value)}
                                />
                                <InputError message={errors.waktu_mulai} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="waktu_selesai">Waktu Selesai</Label>
                                <Input
                                    id="waktu_selesai"
                                    type="time"
                                    value={data.waktu_selesai}
                                    onChange={(e) => setData('waktu_selesai', e.target.value)}
                                />
                                <InputError message={errors.waktu_selesai} />
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
                                    <Link href="/admin/jadwal">Batal</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
