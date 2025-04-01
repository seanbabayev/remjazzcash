import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, NEXT_PUBLIC_BASE_URL } from '@/lib/env';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-11-20.acacia" });

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, recipientId, message } = body;
    
    if (!amount || !recipientId) {
      return NextResponse.json(
        { error: "Amount and recipientId are required" },
        { status: 400 }
      );
    }

    if (amount < 10) {
      return NextResponse.json(
        { error: "Minimum transfer amount is €10" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Money Transfer",
              description: `Transfer to recipient ID: ${recipientId}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: session.user.id,
        recipientId,
        message: message || '',
        amount: amount.toString(),
      },
      success_url: `${NEXT_PUBLIC_BASE_URL}/transfer/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${NEXT_PUBLIC_BASE_URL}/transfer/summary?amount=${amount}&recipient=${recipientId}`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Stripe error:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
