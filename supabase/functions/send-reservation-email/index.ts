import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReservationData {
  reservation_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  notes: string | null;
  created_at: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-reservation-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reservation: ReservationData = await req.json();
    console.log("Reservation received:", reservation.reservation_number);

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
          <div style="background-color: #059669; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🍽️ NOUVELLE RÉSERVATION</h1>
            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: bold;">${reservation.reservation_number}</p>
          </div>

          <!-- Reservation Info -->
          <div style="padding: 24px;">
            <div style="background-color: #ecfdf5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 18px; color: #065f46; font-weight: bold;">
                📅 ${formatDate(reservation.reservation_date)} à ${reservation.reservation_time}
              </p>
            </div>

            <!-- Customer Info -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #374151;">👤 Client</h2>
              <p style="margin: 4px 0;"><strong>Nom:</strong> ${reservation.customer_name}</p>
              <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${reservation.customer_email}" style="color: #2563eb;">${reservation.customer_email}</a></p>
              ${reservation.customer_phone ? `<p style="margin: 4px 0;"><strong>Téléphone:</strong> <a href="tel:${reservation.customer_phone}" style="color: #2563eb;">${reservation.customer_phone}</a></p>` : ''}
            </div>

            <!-- Reservation Details -->
            <div style="background-color: #059669; color: white; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 16px;">NOMBRE DE PERSONNES</p>
              <p style="margin: 8px 0 0 0; font-size: 48px; font-weight: bold;">${reservation.party_size}</p>
            </div>

            ${reservation.notes ? `
            <!-- Notes -->
            <div style="margin-top: 24px; background-color: #fef3c7; border-radius: 8px; padding: 16px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #92400e;">📝 Notes du client</h3>
              <p style="margin: 0; color: #78350f;">${reservation.notes}</p>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Délices Restaurant - Système de réservation en ligne
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
        subject: `🍽️ Nouvelle réservation ${reservation.reservation_number} - ${reservation.party_size} personnes`,
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
    console.error("Error in send-reservation-email function:", error);
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
