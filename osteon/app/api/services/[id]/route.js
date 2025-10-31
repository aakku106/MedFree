import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid service ID format',
        },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('osteon')
    const collection = db.collection('services')

    const service = await collection.findOne({ _id: new ObjectId(id) })

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        },
        { status: 404 }
      )
    }

    // Convert MongoDB _id to string
    const serviceWithId = {
      ...service,
      _id: service._id.toString(),
    }

    return NextResponse.json({
      success: true,
      data: serviceWithId,
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch service',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid service ID format',
        },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('osteon')
    const collection = db.collection('services')

    // Update service with new data
    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    // Remove _id from update data if present
    delete updateData._id

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        },
        { status: 404 }
      )
    }

    // Convert MongoDB _id to string
    const updatedService = {
      ...result,
      _id: result._id.toString(),
    }

    return NextResponse.json({
      success: true,
      data: updatedService,
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update service',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid service ID format',
        },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('osteon')
    const collection = db.collection('services')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete service',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
