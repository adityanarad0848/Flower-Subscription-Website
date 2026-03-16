import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, phone, items, total, deliveryDate, address } = await req.json()

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for your order! We're excited to deliver fresh flowers to you.</p>
            
            <div class="order-details">
              <h3>Order Details:</h3>
              <p><strong>Items:</strong> ${items}</p>
              <p><strong>Total Amount:</strong> ₹${total}</p>
              <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
              <p><strong>Delivery Address:</strong><br>${address}</p>
              <p><strong>Contact:</strong> ${phone}</p>
            </div>
            
            <p>We'll send you updates as your order is processed.</p>
            <p>If you have any questions, reply to this email or call us.</p>
          </div>
          <div class="footer">
            <p>Flower Subscription | Pune, India</p>
          </div>
        </div>
      </body>
      </html>
    `

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (RESEND_API_KEY) {
      // Send via Resend
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Flower Subscription <onboarding@resend.dev>',
          to: [email],
          cc: ['naradaditya@gmail.com'],
          subject: 'Order Confirmation - Flower Subscription',
          html: emailHtml
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send email')
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'RESEND_API_KEY not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
