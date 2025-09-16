import { type NextRequest, NextResponse } from "next/server"
import { dummyProducts } from "@/lib/dummy-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = dummyProducts.find((p) => p.id === params.id)

    if (!product) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productData = await request.json()

    // In a real app, you would update in database
    const updatedProduct = {
      id: params.id,
      ...productData,
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diupdate",
      data: updatedProduct,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In a real app, you would delete from database
    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
