export default interface DashboardPenjemputan {
  id: string
  jadwal: Date
  status: "Selesai" | "Terjadwal"
  harga: number
  user: {
    nama: string
    alamat: string
  }
  driver: {
    nama: string
  }
}

export const jsonToDashboardPenjemputan = (json: {[key: string]: any}) => {
  const status = json["penyetoran_sampah"].length > 0 ? "Selesai" : "Terjadwal"
  return { ...json, status } as DashboardPenjemputan
}