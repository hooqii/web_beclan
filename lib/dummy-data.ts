// Dummy data for the waste management system

// export interface User {
//   id: string
//   name: string
//   email: string
//   phone: string
//   address: string
//   role: "admin" | "operator" | "customer"
//   createdAt: string
// }

// export interface Driver {
//   id: string
//   name: string
//   phone: string
//   licenseNumber: string
//   vehicleNumber: string
//   status: "active" | "inactive"
//   createdAt: string
// }

export interface Product {
  id: string
  name: string
  price: number
  icon: string
  unit: string
  description: string
}

export interface Pickup {
  id: string
  customerId: string
  customerName: string
  customerAddress: string
  driverId: string
  driverName: string
  products: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  scheduledDate: string
  completedDate?: string
  createdAt: string
}

export interface Schedule {
  id: string
  driverId: string
  driverName: string
  customerId: string
  customerName: string
  customerAddress: string
  scheduledDate: string
  timeSlot: string
  status: "scheduled" | "in-progress" | "completed"
  notes?: string
}

// Dummy Users
// export const dummyUsers: User[] = [
//   {
//     id: "1",
//     name: "Budi Santoso",
//     email: "budi@email.com",
//     phone: "081234567890",
//     address: "Jl. Merdeka No. 123, Bireun",
//     role: "customer",
//     createdAt: "2024-01-15",
//   },
//   {
//     id: "2",
//     name: "Siti Nurhaliza",
//     email: "siti@email.com",
//     phone: "081234567891",
//     address: "Jl. Sudirman No. 456, Bireun",
//     role: "customer",
//     createdAt: "2024-01-20",
//   },
//   {
//     id: "3",
//     name: "Ahmad Wijaya",
//     email: "ahmad@email.com",
//     phone: "081234567892",
//     address: "Jl. Thamrin No. 789, Bireun",
//     role: "customer",
//     createdAt: "2024-02-01",
//   },
// ]

// Dummy Drivers
// export const dummyDrivers: Driver[] = [
//   {
//     id: "1",
//     name: "Joko Susilo",
//     phone: "081234567893",
//     licenseNumber: "B1234567890",
//     vehicleNumber: "B 1234 ABC",
//     status: "active",
//     createdAt: "2024-01-10",
//   },
//   {
//     id: "2",
//     name: "Andi Pratama",
//     phone: "081234567894",
//     licenseNumber: "B1234567891",
//     vehicleNumber: "B 5678 DEF",
//     status: "active",
//     createdAt: "2024-01-12",
//   },
//   {
//     id: "3",
//     name: "Rudi Hermawan",
//     phone: "081234567895",
//     licenseNumber: "B1234567892",
//     vehicleNumber: "B 9012 GHI",
//     status: "inactive",
//     createdAt: "2024-01-15",
//   },
// ]

// Dummy Products
export const dummyProducts: Product[] = [
  // {
  //   id: "1",
  //   name: "Sampah Organik",
  //   price: 2000,
  //   icon: "🥬",
  //   unit: "kg",
  //   description: "Sampah organik seperti sisa makanan, daun, dll",
  // },
  {
    id: "1",
    name: "Sampah Plastik",
    price: 3000,
    icon: "♻️",
    unit: "kg",
    description: "Sampah plastik yang dapat didaur ulang",
  },
  {
    id: "2",
    name: "Sampah Kertas",
    price: 1500,
    icon: "📄",
    unit: "kg",
    description: "Sampah kertas dan kardus",
  },
  {
    id: "3",
    name: "Sampah Logam",
    price: 5000,
    icon: "🔩",
    unit: "kg",
    description: "Sampah logam seperti kaleng, besi, dll",
  },
]

// Dummy Pickups
export const dummyPickups: Pickup[] = [
  // {
  //   id: "1",
  //   customerId: "1",
  //   customerName: "Budi Santoso",
  //   customerAddress: "Jl. Merdeka No. 123, Bireun",
  //   driverId: "1",
  //   driverName: "Joko Susilo",
  //   products: [
  //     { productId: "1", productName: "Sampah Organik", quantity: 5, price: 2000 },
  //     { productId: "2", productName: "Sampah Plastik", quantity: 3, price: 3000 },
  //   ],
  //   totalAmount: 19000,
  //   status: "completed",
  //   scheduledDate: "2024-03-15",
  //   completedDate: "2024-03-15",
  //   createdAt: "2024-03-14",
  // },
  {
    id: "1",
    customerId: "2",
    customerName: "Siti Nurhaliza",
    customerAddress: "Jl. Sudirman No. 456, Bireun",
    driverId: "2",
    driverName: "Andi Pratama",
    products: [{ productId: "3", productName: "Sampah Kertas", quantity: 10, price: 1500 }],
    totalAmount: 15000,
    status: "completed",
    scheduledDate: "2024-03-14",
    completedDate: "2024-03-14",
    createdAt: "2024-03-13",
  },
  {
    id: "2",
    customerId: "3",
    customerName: "Ahmad Wijaya",
    customerAddress: "Jl. Thamrin No. 789, Bireun",
    driverId: "1",
    driverName: "Joko Susilo",
    products: [
      { productId: "4", productName: "Sampah Logam", quantity: 2, price: 5000 },
      { productId: "1", productName: "Sampah Organik", quantity: 4, price: 2000 },
    ],
    totalAmount: 18000,
    status: "in-progress",
    scheduledDate: "2024-03-16",
    createdAt: "2024-03-15",
  },
  {
    id: "3",
    customerId: "1",
    customerName: "Budi Santoso",
    customerAddress: "Jl. Merdeka No. 123, Bireun",
    driverId: "2",
    driverName: "Andi Pratama",
    products: [{ productId: "2", productName: "Sampah Plastik", quantity: 7, price: 3000 }],
    totalAmount: 21000,
    status: "scheduled",
    scheduledDate: "2024-03-17",
    createdAt: "2024-03-16",
  },
  // {
  //   id: "5",
  //   customerId: "2",
  //   customerName: "Siti Nurhaliza",
  //   customerAddress: "Jl. Sudirman No. 456, Bireun",
  //   driverId: "1",
  //   driverName: "Joko Susilo",
  //   products: [
  //     { productId: "1", productName: "Sampah Organik", quantity: 6, price: 2000 },
  //     { productId: "3", productName: "Sampah Kertas", quantity: 8, price: 1500 },
  //   ],
  //   totalAmount: 24000,
  //   status: "completed",
  //   scheduledDate: "2024-03-13",
  //   completedDate: "2024-03-13",
  //   createdAt: "2024-03-12",
  // },
]

// Dummy Schedules
export const dummySchedules: Schedule[] = [
  {
    id: "1",
    driverId: "1",
    driverName: "Joko Susilo",
    customerId: "1",
    customerName: "Budi Santoso",
    customerAddress: "Jl. Merdeka No. 123, Bireun",
    scheduledDate: "2024-03-16",
    timeSlot: "08:00-10:00",
    status: "scheduled",
    notes: "Sampah organik dan plastik",
  },
  {
    id: "2",
    driverId: "2",
    driverName: "Andi Pratama",
    customerId: "2",
    customerName: "Siti Nurhaliza",
    customerAddress: "Jl. Sudirman No. 456, Bireun",
    scheduledDate: "2024-03-16",
    timeSlot: "10:00-12:00",
    status: "in-progress",
    notes: "Sampah kertas banyak",
  },
  {
    id: "3",
    driverId: "1",
    driverName: "Joko Susilo",
    customerId: "3",
    customerName: "Ahmad Wijaya",
    customerAddress: "Jl. Thamrin No. 789, Bireun",
    scheduledDate: "2024-03-16",
    timeSlot: "13:00-15:00",
    status: "scheduled",
    notes: "Sampah logam dan organik",
  },
]

// Helper functions
export const getTotalPickupsThisMonth = () => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return dummyPickups.filter((pickup) => {
    const pickupDate = new Date(pickup.scheduledDate)
    return (
      pickupDate.getMonth() === currentMonth &&
      pickupDate.getFullYear() === currentYear &&
      pickup.status === "completed"
    )
  }).length
}

export const getProductQuantitiesThisMonth = () => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const completedPickups = dummyPickups.filter((pickup) => {
    const pickupDate = new Date(pickup.scheduledDate)
    return (
      pickupDate.getMonth() === currentMonth &&
      pickupDate.getFullYear() === currentYear &&
      pickup.status === "completed"
    )
  })

  const productQuantities: Record<string, number> = {}

  completedPickups.forEach((pickup) => {
    pickup.products.forEach((product) => {
      if (productQuantities[product.productName]) {
        productQuantities[product.productName] += product.quantity
      } else {
        productQuantities[product.productName] = product.quantity
      }
    })
  })

  return productQuantities
}

export const getRecentPickups = (limit = 5) => {
  return dummyPickups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

export const getTodaySchedules = () => {
  const today = new Date().toISOString().split("T")[0]
  return dummySchedules.filter((schedule) => schedule.scheduledDate === today)
}
