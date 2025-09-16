import { type NextRequest, NextResponse } from "next/server"
import { dummyProducts } from "@/lib/dummy-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let filteredProducts = [...dummyProducts]

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // In a real app, you would save to database
    const newProduct = {
      id: (dummyProducts.length + 1).toString(),
      ...productData,
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: newProduct,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
