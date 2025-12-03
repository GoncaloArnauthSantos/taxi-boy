import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

/**
 * Prismic Webhook Handler
 * 
 * This endpoint receives webhooks from Prismic when content is published/unpublished.
 * It revalidates the Next.js cache to ensure fresh content is served.
 * 
 */

export async function POST(request: NextRequest) {
  try {
    // Prismic sends the secret in the request body
    const body = await request.json()
    const secret = body.secret
    const expectedSecret = process.env.CMS_REVALIDATE_SECRET

    if (!expectedSecret) {
      return NextResponse.json(
        { message: "Revalidation secret not configured" },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { message: "Invalid secret" },
        { status: 401 }
      )
    }

    // Revalidate all pages that use Prismic CMS data
    // This invalidates the Next.js cache so fresh data is fetched on next request
    
    // Revalidate root layout (affects all pages that use it)
    revalidatePath("/", "layout")
    
    // Revalidate specific pages that use Prismic data
    revalidatePath("/", "page")           // Home page (uses ContactUsWithDriver)
    revalidatePath("/tours", "page")       // Tours listing page
    revalidatePath("/tours/[id]", "page")  // Tour detail pages (dynamic route)
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating cache", error: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for testing
 * Useful for verifying the endpoint is accessible
 */
export async function GET() {
  return NextResponse.json({
    message: "Revalidation endpoint is active",
    timestamp: Date.now(),
  })
}

