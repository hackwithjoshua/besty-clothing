import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  selectedSize: string;
  selectedColor: string;
  image?: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n);
}

function buildEmailHtml(orderRef: string, items: OrderItem[], total: number, shipping: number, address: ShippingAddress) {
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #E8DFC8;vertical-align:top;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:56px;vertical-align:top;padding-right:12px;">
              ${item.image
                ? `<img src="${item.image}" width="56" height="68" style="object-fit:cover;display:block;background:#F5EFE0;" />`
                : `<div style="width:56px;height:68px;background:#F5EFE0;"></div>`
              }
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:15px;color:#0C0800;font-weight:600;">${item.name}</p>
              <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;color:#8B7355;text-transform:uppercase;letter-spacing:1px;">${item.selectedSize} · ${item.selectedColor}</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;">Qty: ${item.quantity}</p>
            </td>
            <td style="vertical-align:top;text-align:right;white-space:nowrap;">
              <p style="margin:0;font-family:Georgia,serif;font-size:14px;font-weight:700;color:#D44820;">${formatPrice(item.price * item.quantity)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const grandTotal = total;
  const subtotal = total - shipping;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed — Besty Clothing</title>
</head>
<body style="margin:0;padding:0;background:#F5EFE0;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EFE0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Kente header strip -->
          <tr>
            <td style="height:6px;background:repeating-linear-gradient(90deg,#E8B820 0,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px,#B82010 78px,#B82010 100px,#0C0800 100px,#0C0800 104px);"></td>
          </tr>

          <!-- Dark header -->
          <tr>
            <td style="background:#0C0800;padding:36px 40px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:5px;color:#E8B820;">Besty Clothing</p>
              <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:38px;font-weight:300;color:#FBF7EF;letter-spacing:-1px;">Order Confirmed</h1>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:rgba(251,247,239,0.4);text-transform:uppercase;letter-spacing:3px;">Lagos · Nigeria</p>
            </td>
          </tr>

          <!-- Kente strip -->
          <tr>
            <td style="height:4px;background:repeating-linear-gradient(90deg,#E8B820 0,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px,#B82010 78px,#B82010 100px,#0C0800 100px,#0C0800 104px);"></td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#FFFFFF;padding:40px;">

              <!-- Greeting -->
              <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#D44820;">Thank you, ${address.fullName.split(' ')[0]}!</p>
              <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#0C0800;">Your order is on its way.</h2>
              <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:13px;color:#8B7355;line-height:1.8;">
                We've received your order and our artisans are preparing your piece with care.
                You'll receive a shipping update once your order is dispatched.
              </p>

              <!-- Order ref -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EFE0;margin-bottom:32px;">
                <tr>
                  <td style="height:3px;background:repeating-linear-gradient(90deg,#E8B820 0,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px);"></td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8B7355;">Order Reference</p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#0C0800;">${orderRef}</p>
                  </td>
                </tr>
                <tr>
                  <td style="height:3px;background:repeating-linear-gradient(90deg,#E8B820 0,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px);"></td>
                </tr>
              </table>

              <!-- Items -->
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#8B7355;">Your Items</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;">Subtotal</td>
                  <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;text-align:right;">${formatPrice(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;">Shipping</td>
                  <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:12px;color:${shipping === 0 ? '#0A4030' : '#8B7355'};text-align:right;font-weight:${shipping === 0 ? '700' : '400'};">${shipping === 0 ? 'Free' : formatPrice(shipping)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:0;height:3px;background:repeating-linear-gradient(90deg,#E8B820 0,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px);"></td>
                </tr>
                <tr>
                  <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:20px;color:#0C0800;font-weight:600;">Total Paid</td>
                  <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:20px;color:#D44820;font-weight:700;text-align:right;">${formatPrice(grandTotal)}</td>
                </tr>
              </table>

              <!-- Delivery address -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;border:1px solid #E8DFC8;">
                <tr>
                  <td style="background:#F5EFE0;padding:12px 16px;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#8B7355;">Delivering To</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:15px;color:#0C0800;font-weight:600;">${address.fullName}</p>
                    <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;">${address.address}</p>
                    <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;">${address.city}, ${address.state}</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;">${address.phone}</p>
                  </td>
                </tr>
              </table>

              <!-- Delivery note -->
              <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;line-height:1.8;border-left:3px solid #E8B820;padding-left:14px;">
                Estimated delivery: <strong style="color:#0C0800;">3–7 business days</strong> across Nigeria.<br/>
                Questions? Reply to this email or contact us.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0C0800;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:20px;font-weight:300;color:#FBF7EF;letter-spacing:1px;">Besty Clothing</p>
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:9px;color:rgba(251,247,239,0.3);text-transform:uppercase;letter-spacing:3px;">Wear Your African Story</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:rgba(251,247,239,0.25);">Lagos · Nigeria · besty-clothing-ng.web.app</p>
            </td>
          </tr>

          <!-- Bottom kente strip -->
          <tr>
            <td style="height:6px;background:repeating-linear-gradient(90deg,#E8B820 0,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px,#B82010 78px,#B82010 100px,#0C0800 100px,#0C0800 104px);"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { to, orderRef, items, total, shipping, address } = await req.json();

    const emailUser = process.env.EMAIL_FROM;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    });

    await transporter.sendMail({
      from: `Besty Clothing <${emailUser}>`,
      to,
      subject: `Order Confirmed — ${orderRef} | Besty Clothing`,
      html: buildEmailHtml(orderRef, items, total, shipping, address),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Email] send error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
