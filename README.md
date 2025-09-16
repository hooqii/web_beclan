# Sistem Manajemen Sampah BeClean

Aplikasi web untuk mengelola sistem penjemputan dan pengolahan sampah dengan dua role utama: Admin dan Operator.

## Fitur Utama

### Admin Dashboard
- **Dashboard Utama**: Statistik total penjemputan bulan ini, jumlah masing-masing produk sampah, dan 5 penjemputan terakhir
- **Kelola Penjemputan**: Daftar lengkap penjemputan sampah beserta detail produknya
- **CRUD Produk**: Tambah, edit, hapus produk sampah (nama, harga, icon)
- **CRUD User**: Kelola pengguna sistem (customer, operator, admin)
- **CRUD Driver**: Kelola data driver penjemputan

### Operator Dashboard
- **Jadwal Hari Ini**: Daftar penjemputan yang dijadwalkan untuk hari ini
- **Kelola Jadwal**: Tambah, edit jadwal penjemputan
- **Input Sampah**: Form untuk mencatat sampah yang diantar ke kantor

## Teknologi

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MySQL (XAMPP)
- **Authentication**: Hardcoded credentials (demo)

## Kredensial Login

### Admin
- Username: `admin`
- Password: `admin123`

### Operator
- Username: `operator`
- Password: `operator123`

## Instalasi

1. Clone repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Setup database MySQL di XAMPP:
   - Jalankan XAMPP dan aktifkan MySQL
   - Buka phpMyAdmin
   - Jalankan script SQL di folder `scripts/` secara berurutan:
     - `01_create_database_schema.sql`
     - `02_insert_dummy_data.sql`
     - `03_create_views_and_procedures.sql`

4. Jalankan aplikasi:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Buka browser dan akses `http://localhost:3000`

## Struktur Database

### Tabel Utama
- `users` - Data pengguna (admin, operator, customer)
- `drivers` - Data driver penjemputan
- `products` - Jenis-jenis sampah dan harganya
- `pickups` - Data penjemputan sampah
- `pickup_items` - Detail produk dalam setiap penjemputan
- `schedules` - Jadwal penjemputan
- `waste_inputs` - Data sampah yang diantar ke kantor
- `waste_input_items` - Detail produk dalam waste input

### Views
- `pickup_details` - View gabungan data penjemputan dengan customer dan driver
- `schedule_details` - View gabungan data jadwal dengan customer dan driver
- `waste_input_details` - View gabungan data waste input

### Stored Procedures
- `GetMonthlyPickupStats()` - Statistik penjemputan bulanan
- `GetMonthlyProductQuantities()` - Jumlah produk per bulan
- `GetDriverPerformance()` - Performa driver

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin/operator

### Users
- `GET /api/users` - Daftar users
- `POST /api/users` - Tambah user baru
- `GET /api/users/[id]` - Detail user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Hapus user

### Drivers
- `GET /api/drivers` - Daftar drivers
- `POST /api/drivers` - Tambah driver baru
- `GET /api/drivers/[id]` - Detail driver
- `PUT /api/drivers/[id]` - Update driver
- `DELETE /api/drivers/[id]` - Hapus driver

### Products
- `GET /api/products` - Daftar produk sampah
- `POST /api/products` - Tambah produk baru
- `GET /api/products/[id]` - Detail produk
- `PUT /api/products/[id]` - Update produk
- `DELETE /api/products/[id]` - Hapus produk

### Pickups
- `GET /api/pickups` - Daftar penjemputan
- `POST /api/pickups` - Tambah penjemputan baru

### Schedules
- `GET /api/schedules` - Daftar jadwal
- `POST /api/schedules` - Tambah jadwal baru
- `GET /api/schedules/[id]` - Detail jadwal
- `PUT /api/schedules/[id]` - Update jadwal
- `DELETE /api/schedules/[id]` - Hapus jadwal

### Waste Input
- `POST /api/waste-input` - Input data sampah ke kantor
- `GET /api/waste-input` - Daftar waste input

### Dashboard
- `GET /api/dashboard/stats` - Statistik dashboard

## Catatan Pengembangan

- Saat ini menggunakan data dummy yang di-hardcode
- API endpoints sudah dibuat tapi belum terhubung ke database
- Authentication menggunakan kredensial hardcode untuk demo
- Database schema sudah lengkap dan siap untuk integrasi
- Frontend sudah responsive dan menggunakan design system yang konsisten

## Pengembangan Selanjutnya

1. Integrasikan API dengan database MySQL
2. Implementasi authentication yang proper dengan JWT
3. Tambahkan validasi form yang lebih robust
4. Implementasi real-time updates
5. Tambahkan fitur laporan dan analytics
6. Implementasi file upload untuk foto sampah
7. Tambahkan notifikasi push untuk jadwal
