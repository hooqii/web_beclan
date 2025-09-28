export default interface User {
  id: string
  email: string
  nama: string
  alamat: string
  noHp: string
  tanggalDaftar: Date
}

export const userFromJson = (json: {[key: string]: any}) => {
  const tanggalDaftar = new Date(json["createdAt"])
  return { ...json, tanggalDaftar } as User
}