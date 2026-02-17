export type Kelas = {
    id: number;
    nama: string;
    tingkat: string;
    status: 'aktif' | 'non_aktif';
    siswa_count?: number;
    created_at: string;
    updated_at: string;
};

export type Mapel = {
    id: number;
    nama: string;
    kode: string;
    status: 'aktif' | 'non_aktif';
    created_at: string;
    updated_at: string;
};

export type Guru = {
    id: number;
    user_id: number;
    nip: string;
    nama: string;
    user?: import('./auth').User;
    jadwal?: Jadwal[];
    created_at: string;
    updated_at: string;
};

export type Siswa = {
    id: number;
    user_id: number;
    nis: string;
    nama_depan: string;
    nama_belakang: string;
    nama_lengkap?: string;
    kelas_id: number | null;
    orang_tua_id: number | null;
    qr_code_token: string;
    status: 'aktif' | 'non_aktif';
    user?: import('./auth').User;
    kelas?: Kelas;
    orang_tua?: OrangTua;
    presensi?: Presensi[];
    created_at: string;
    updated_at: string;
};

export type OrangTua = {
    id: number;
    user_id: number;
    nama: string;
    telepon: string;
    alamat: string;
    user?: import('./auth').User;
    anak?: Siswa[];
    created_at: string;
    updated_at: string;
};

export type Jadwal = {
    id: number;
    kelas_id: number;
    mapel_id: number;
    guru_id: number;
    hari: 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu';
    waktu_mulai: string;
    waktu_selesai: string;
    status: 'aktif' | 'non_aktif';
    kelas?: Kelas;
    mapel?: Mapel;
    guru?: Guru;
    created_at: string;
    updated_at: string;
};

export type PresensiStatus = 'hadir' | 'izin' | 'sakit' | 'alpha';

export type Presensi = {
    id: number;
    siswa_id: number;
    jadwal_id: number;
    status: PresensiStatus;
    tanggal: string;
    qr_type: 'jadwal' | 'general';
    marked_by: number | null;
    marked_at: string | null;
    siswa?: Siswa;
    jadwal?: Jadwal;
    created_at: string;
    updated_at: string;
};

export type IzinJenis = 'izin' | 'sakit';
export type IzinStatus = 'pending' | 'approved' | 'rejected';

export type Izin = {
    id: number;
    siswa_id: number;
    jadwal_id: number;
    jenis: IzinJenis;
    alasan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    bukti_path: string | null;
    status: IzinStatus;
    reviewed_by: number | null;
    reviewed_at: string | null;
    catatan: string | null;
    siswa?: Siswa;
    jadwal?: Jadwal;
    created_at: string;
    updated_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
        path: string;
    };
};

export type DashboardStats = {
    total_siswa: number;
    total_guru: number;
    total_kelas: number;
    hadir_hari_ini: number;
    izin_hari_ini: number;
    sakit_hari_ini: number;
    alpha_hari_ini: number;
    total_jadwal_hari_ini: number;
};
