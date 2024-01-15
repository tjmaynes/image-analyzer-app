import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import seedData from '@/data/seed.json'

const imageDescriptionData = seedData.data.reduce<Record<string, string>>(
  (accum, curr) => ({ ...accum, ...{ [curr.name]: curr.description } }),
  {}
)

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const thing = request.nextUrl.searchParams.get('thing')

  if (!thing)
    return NextResponse.json({
      message: `Please provide 'thing' key as query param...`,
      status: 422,
    })

  const response = imageDescriptionData[thing]

  return response
    ? NextResponse.json({ message: response, status: 200 })
    : NextResponse.json({
        message: `Unable to find a description for "${thing}"...`,
        status: 404,
      })
}
