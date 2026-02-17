# API Contract - SiswaPresensi

## Authentication Endpoints

### POST /api/auth/login
**Description:** User login with email and password

**Request:**
```json
{
  "email": "guru@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "guru@example.com",
      "role": "guru",
      "userable": {
        "type": "guru",
        "nama": "Budi Santoso",
        "nip": "12345"
      }
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

### POST /api/auth/logout
**Description:** User logout

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/profile
**Description:** Get current user profile

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "guru@example.com",
      "role": "guru"
    }
  }
}
```

---

## Presensi Endpoints

### POST /api/presensi
**Description:** Create attendance record

**Headers** `Authorization: Bearer {token}`

**Request:**
```json
{
  "siswa_id": 1,
  "jadwal_id": 1,
  "status": "hadir",
  "tanggal": "2026-02-16"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "siswa_id": 1,
    "jadwal_id": 1,
    "status": "hadir",
    "tanggal": "2026-02-16",
    "created_at": "2026-02-16T08:00:00Z",
    "updated_at": "2026-02-16T08:00:00Z"
  }
}
```

---

### GET /api/presensi/jadwal/{jadwal_id}
**Description:** Get attendance records by schedule

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "siswa": {
        "id": 1,
        "nama_depan": "Ahmad",
        "nama_belakang": "Rizky",
        "nis": "12345",
        "kelas": "XI IPA 1"
      },
      "status": "hadir",
      "tanggal": "2026-02-16"
    }
  ]
}
```

---

### PUT /api/presensi/{id}
**Description:** Update attendance record

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "status": "izin"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "izin"
  }
}
```

---

### DELETE /api/presensi/{id}
**Description:** Delete attendance record

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content):**
```
```

---

## QR Code Endpoints

### POST /api/qr/generate
**Description:** Generate QR code for student

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "jadwal_id": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "qr_code": "eyJzaXN3YV9pZCI6MSwiamFkd2FsX2lkIjoxLCJ0aW1lc3RhbXAiOjE3MDgwNjQwMDB9",
    "expires_at": "2026-02-16T10:00:00Z"
  }
}
```

---

### POST /api/qr/validate
**Description:** Validate QR code

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "qr_code": "eyJzaXN3YV9pZCI6MSwiamFkd2FsX2lkIjoxLCJ0aW1lc3RhbXAiOjE3MDgwNjQwMDB9"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "siswa": {
      "id": 1,
      "nama_depan": "Ahmad",
      "nama_belakang": "Rizky",
      "nis": "12345",
      "kelas": "XI IPA 1"
    },
    "jadwal": {
      "id": 1,
      "mapel": "Matematika",
      "kelas": "XI IPA 1",
      "waktu_mulai": "08:00",
      "waktu_selesai": "09:30"
    }
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "QR code has expired"
}
```

---

## Izin (Permission Request) Endpoints

### POST /api/izin
**Description:** Create permission request

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "siswa_id": 1,
  "jadwal_id": 1,
  "jenis": "sakit",
  "alasan": "Demam tinggi",
  "tanggal_mulai": "2026-02-20",
  "tanggal_selesai": "2026-02-20",
  "bukti": "surat_dokter.jpg"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "siswa_id": 1,
    "jenis": "sakit",
    "alasan": "Demam tinggi",
    "status": "pending",
    "created_at": "2026-02-16T08:00:00Z"
  }
}
```

---

### PUT /api/izin/{id}/approve
**Description:** Approve permission request

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "approved",
    "reviewed_by": 1,
    "reviewed_at": "2026-02-16T08:00:00Z"
  }
}
```

---

### PUT /api/izin/{id}/reject
**Description:** Reject permission request

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "catatan": "Alasan tidak valid"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "rejected",
    "catatan": "Alasan tidak valid",
    "reviewed_by": 1,
    "reviewed_at": "2026-02-16T08:00:00Z"
  }
}
```

---

### GET /api/izin
**Description:** Get user's permission requests

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "siswa": {
        "id": 1,
        "nama_depan": "Ahmad",
        "nama_belakang": "Rizky"
      },
      "jenis": "sakit",
      "alasan": "Demam tinggi",
      "status": "pending"
    }
  ]
}
```

---

## Dashboard Endpoints

### GET /api/dashboard/stats
**Description:** Get dashboard statistics

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_siswa": 30,
    "hadir_hari_ini": 25,
    "izin_hari_ini": 3,
    "sakit_hari_ini": 2
  }
}
```

---

### GET /api/dashboard/jadwal-hari-ini
**Description:** Get today's schedule

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "mapel": "Matematika",
      "kelas": "XI IPA 1",
      "waktu_mulai": "08:00",
      "waktu_selesai": "09:30"
    }
  ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "siswa_id": ["Siswa ID is required"],
    "jadwal_id": ["Jadwal ID is required"]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## API Versioning

**Current Version:** v1.0

**Version Header:** `X-API-Version: 1.0`

**Base URL:** `/api/v1`

---

## Rate Limiting

**Default Limits:**
- 100 requests per minute per IP
- 1000 requests per hour per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1613680000
```

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [Architecture](./0402-architecture.md)
- [Data Model](./0404-data-model.md)
