export default interface Driver {
  id: string
  nama: string
  email: string
  noHp: string
  nomorPlat: string
}

export const driverFromJson = (json: {[key: string]: any}) => {
  delete json["password"]
  return { ...json } as Driver
}