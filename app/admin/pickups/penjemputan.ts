export default interface Penjemputan {
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
  sampah: {
    id: string
    berat: number
    produk: {
      nama: string
      harga: number
    }
    subtotal: number
  }[]
}

export const jsonToPenjemputan = (json: {[key: string]: any}) => {
  const status = json["penyetoran_sampah"].length > 0 ? "Selesai" : "Terjadwal"
  const sampah = json["penyetoran_sampah"].map((setoran: any) => {
    const subtotal = setoran.harga
    const berat = parseFloat(setoran.berat)
    const produk = setoran["produk_sampah"]
    return { ...setoran, subtotal, berat, produk }
  })
  const listHarga = sampah.map((sampah: any) => sampah.subtotal)
  const emptyAmount = listHarga.length === 0 ? 0 : null
  const harga = emptyAmount ?? listHarga?.reduce((v: number, e: number) => v + e) ?? 0
  return { ...json, status, sampah, harga } as Penjemputan
}