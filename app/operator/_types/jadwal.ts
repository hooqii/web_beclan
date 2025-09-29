export default interface Jadwal {
  id: string
  status: "Selesai" | "Terjadwal"
  jadwal: Date
  user: {
    id: string
    nama: string
    alamat: string
  },
  driver: {
    id: string
    nama: string
  }
}

export const jadwalFromJson = (json: {[key: string]: any}) => {
  const jadwal = new Date(json["jadwal"])
  const status = json["penyetoran_sampah"].length > 0 ? "Selesai" : "Terjadwal"
  return { ...json, jadwal, status } as Jadwal
}