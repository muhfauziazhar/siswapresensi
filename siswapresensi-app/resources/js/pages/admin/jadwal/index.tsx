import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Filter, List, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Guru, Jadwal, Kelas, PaginatedData } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Jadwal', href: '/admin/jadwal' },
];

interface Props {
    jadwal: PaginatedData<Jadwal> | Jadwal[];
    kelasList: Kelas[];
    guruList: Guru[];
    filters: {
        kelas_id?: string;
        guru_id?: string;
        hari?: string;
        view_mode?: 'list' | 'calendar';
    };
}

export default function JadwalIndex({ jadwal, kelasList, guruList, filters }: Props) {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>(filters.view_mode || 'list');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas_id || 'all');
    const [selectedGuru, setSelectedGuru] = useState(filters.guru_id || 'all');
    const [selectedHari, setSelectedHari] = useState(filters.hari || 'all');

    function handleFilterChange(key: string, value: string) {
        const newFilters = {
            kelas_id: key === 'kelas_id' ? value : selectedKelas,
            guru_id: key === 'guru_id' ? value : selectedGuru,
            hari: key === 'hari' ? value : selectedHari,
            view_mode: viewMode,
        };

        // Sanitize 'all' values to empty strings
        const sanitizedFilters = Object.fromEntries(
            Object.entries(newFilters).map(([k, v]) => [k, v === 'all' ? '' : v])
        );

        if (key === 'kelas_id') setSelectedKelas(value);
        if (key === 'guru_id') setSelectedGuru(value);
        if (key === 'hari') setSelectedHari(value);

        router.get('/admin/jadwal', sanitizedFilters as any, {
            preserveState: true,
            preserveScroll: true,
        });
    }
    
    function toggleViewMode(mode: 'list' | 'calendar') {
        setViewMode(mode);
        router.get('/admin/jadwal', { 
            kelas_id: selectedKelas === 'all' ? '' : selectedKelas,
            guru_id: selectedGuru === 'all' ? '' : selectedGuru,
            hari: selectedHari === 'all' ? '' : selectedHari,
            view_mode: mode 
        } as any, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleDelete(id: number) {
        if (confirm('Apakah Anda yakin ingin menghapus?')) {
            router.delete(`/admin/jadwal/${id}`);
        }
    }

    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const timeSlots = Array.from({ length: 10 }, (_, i) => i + 7); // 07:00 to 16:00

    // Force cast jadwal to array if in calendar mode (since backend sends array)
    const calendarData = Array.isArray(jadwal) ? jadwal : jadwal.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Jadwal" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h1 className="text-2xl font-bold">Manajemen Jadwal</h1>
                    <div className="flex items-center gap-2">
                         <div className="flex items-center rounded-lg border bg-background p-1">
                            <Button 
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                onClick={() => toggleViewMode('list')}
                            >
                                <List className="mr-2 h-4 w-4" />
                                List
                            </Button>
                            <Button 
                                variant={viewMode === 'calendar' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                onClick={() => toggleViewMode('calendar')}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                Kalender
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/admin/jadwal/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Jadwal
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                {/* Filters */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Kelas</label>
                        <Select value={selectedKelas} onValueChange={(v) => handleFilterChange('kelas_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {kelasList.map((k) => (
                                    <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Guru</label>
                        <Select value={selectedGuru} onValueChange={(v) => handleFilterChange('guru_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Guru" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Guru</SelectItem>
                                {guruList.map((g) => (
                                    <SelectItem key={g.id} value={String(g.id)}>{g.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Hari</label>
                        <Select value={selectedHari} onValueChange={(v) => handleFilterChange('hari', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Hari" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Hari</SelectItem>
                                {days.map((d) => (
                                    <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="p-0">
                        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50 text-left transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Hari</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Kelas</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Mapel</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Guru</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Waktu</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!('data' in jadwal) || jadwal.data.length === 0) && (
                                        <tr>
                                            <td colSpan={7} className="p-4 text-center text-muted-foreground">
                                                Belum ada data jadwal.
                                            </td>
                                        </tr>
                                    )}
                                    {('data' in jadwal ? jadwal.data : []).map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle capitalize">{item.hari}</td>
                                            <td className="p-4 align-middle">{item.kelas?.nama}</td>
                                            <td className="p-4 align-middle font-medium">{item.mapel?.nama}</td>
                                            <td className="p-4 align-middle">{item.guru?.nama}</td>
                                            <td className="p-4 align-middle font-mono text-xs">{item.waktu_mulai} - {item.waktu_selesai}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={item.status === 'aktif' ? 'default' : 'secondary'}>
                                                    {item.status === 'aktif' ? 'Aktif' : 'Non Aktif'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/jadwal/${item.id}/edit`}>
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
                        <div className="py-4">
                           {'data' in jadwal ? <Pagination links={jadwal.links} /> : null}
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto p-4 rounded-md border bg-card text-card-foreground shadow-sm">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-7 border-b bg-muted/50 text-sm font-medium">
                                <div className="p-3 text-center border-r">Waktu</div>
                                {days.map(day => (
                                    <div key={day} className="p-3 text-center capitalize border-r last:border-r-0">{day}</div>
                                ))}
                            </div>
                            <div className="divide-y">
                                {timeSlots.map(hour => {
                                    const timeString = `${hour.toString().padStart(2, '0')}:00`;
                                    return (
                                        <div key={hour} className="grid grid-cols-7 min-h-[100px]">
                                            <div className="p-2 text-xs text-muted-foreground border-r text-center bg-muted/10">
                                                {timeString}
                                            </div>
                                            {days.map(day => {
                                                const schedules = calendarData.filter(j => {
                                                    const startHour = parseInt(j.waktu_mulai.split(':')[0]);
                                                    return j.hari === day && startHour === hour;
                                                });
                                                
                                                return (
                                                    <div key={`${day}-${hour}`} className="p-1 border-r last:border-r-0 relative group">
                                                        {schedules.map(schedule => (
                                                            <div 
                                                                key={schedule.id} 
                                                                className="mb-1 rounded p-2 text-xs border transition-colors"
                                                                style={{ 
                                                                    backgroundColor: schedule.mapel?.color || 'hsl(var(--primary) / 0.1)',
                                                                    borderColor: schedule.mapel?.color ? `${schedule.mapel.color}40` : 'hsl(var(--primary) / 0.2)',
                                                                }}
                                                            >
                                                                <div className="font-bold text-foreground">{schedule.mapel?.nama}</div>
                                                                <div className="text-black my-2">{schedule.guru?.nama}</div>
                                                                <div className="text-black">{schedule.kelas?.nama}</div>
                                                                <div className="text-[10px] text-black mt-1">
                                                                    {schedule.waktu_mulai} - {schedule.waktu_selesai}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
