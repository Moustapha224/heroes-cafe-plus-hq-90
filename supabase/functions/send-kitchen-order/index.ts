import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface OrderData {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  order_type: 'delivery' | 'pickup';
  payment_method: 'cash' | 'mobile_money' | 'card';
  subtotal: number;
  total: number;
  notes: string | null;
  created_at: string;
}

interface RequestBody {
  order: OrderData;
  items: OrderItem[];
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-GN', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price) + ' GNF';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-kitchen-order function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order, items }: RequestBody = await req.json();
    console.log("Order received:", order.order_number);

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    const orderTypeLabel = order.order_type === 'delivery' ? '🚚 Livraison' : '🏪 À emporter';
    const paymentLabel = order.payment_method === 'cash' ? '💵 Espèces' : '📱 Mobile Money';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #dc2626; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🔔 NOUVELLE COMMANDE</h1>
            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: bold;">${order.order_number}</p>
          </div>

          <!-- Order Info -->
          <div style="padding: 24px;">
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>📅 Date:</strong> ${formatDate(order.created_at)}
              </p>
            </div>

            <!-- Customer Info -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #374151;">👤 Client</h2>
              <p style="margin: 4px 0;"><strong>Nom:</strong> ${order.customer_name}</p>
              <p style="margin: 4px 0;"><strong>Téléphone:</strong> <a href="tel:${order.customer_phone}" style="color: #2563eb;">${order.customer_phone}</a></p>
              ${order.customer_address ? `<p style="margin: 4px 0;"><strong>Adresse:</strong> ${order.customer_address}</p>` : ''}
            </div>

            <!-- Order Details -->
            <div style="margin-bottom: 24px;">
              <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                <span style="background-color: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                  ${orderTypeLabel}
                </span>
                <span style="background-color: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                  ${paymentLabel}
                </span>
              </div>
            </div>

            <!-- Items Table -->
            <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #374151;">📦 Articles commandés</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Article</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Qté</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Prix</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Total -->
            <div style="background-color: #dc2626; color: white; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 16px;">TOTAL À PAYER</p>
              <p style="margin: 8px 0 0 0; font-size: 32px; font-weight: bold;">${formatPrice(order.total)}</p>
            </div>

            ${order.notes ? `
            <!-- Notes -->
            <div style="margin-top: 24px; background-color: #fef3c7; border-radius: 8px; padding: 16px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #92400e;">📝 Notes du client</h3>
              <p style="margin: 0; color: #78350f;">${order.notes}</p>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Délices Restaurant - Système de commande en ligne
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Délices <onboarding@resend.dev>",
        to: ["mssidiboss@gmail.com"],
        subject: `🔔 Nouvelle commande ${order.order_number} - ${orderTypeLabel}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-kitchen-order function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
