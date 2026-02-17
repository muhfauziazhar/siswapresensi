import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Siswa } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/orang-tua/dashboard' },
    { title: 'Izin Anak', href: '/orang-tua/izin' },
    { title: 'Ajukan Izin', href: '/orang-tua/izin/create' },
];

interface Props {
    anak: Siswa[];
}

export default function IzinCreate({ anak }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        siswa_id: string;
        jadwal_id: string;
        jenis: string;
        alasan: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        bukti: File | null;
    }>({
        siswa_id: '',
        jadwal_id: '',
        jenis: '',
        alasan: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        bukti: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/orang-tua/izin', {
            forceFormData: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajukan Izin" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Ajukan Izin</h1>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Form Pengajuan Izin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siswa_id">Anak</Label>
                                <Select value={data.siswa_id} onValueChange={(value) => setData('siswa_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih anak" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {anak.map((child) => (
                                            <SelectItem key={child.id} value={String(child.id)}>
                                                {child.nama_depan} {child.nama_belakang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.siswa_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jadwal_id">Jadwal ID</Label>
                                <Input
                                    id="jadwal_id"
                                    value={data.jadwal_id}
                                    onChange={(e) => setData('jadwal_id', e.target.value)}
                                    placeholder="Masukkan ID jadwal"
                                />
                                <InputError message={errors.jadwal_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jenis">Jenis</Label>
                                <Select value={data.jenis} onValueChange={(value) => setData('jenis', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis izin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="izin">Izin</SelectItem>
                                        <SelectItem value="sakit">Sakit</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.jenis} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alasan">Alasan</Label>
                                <textarea
                                    id="alasan"
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.alasan}
                                    onChange={(e) => setData('alasan', e.target.value)}
                                    placeholder="Alasan izin"
                                />
                                <InputError message={errors.alasan} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    />
                                    <InputError message={errors.tanggal_mulai} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    />
                                    <InputError message={errors.tanggal_selesai} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bukti">Bukti (opsional)</Label>
                                <Input
                                    id="bukti"
                                    type="file"
                                    onChange={(e) => setData('bukti', e.target.files?.[0] ?? null)}
                                />
                                <InputError message={errors.bukti} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/orang-tua/izin">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Ajukan Izin
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
