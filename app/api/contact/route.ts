import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
    }

    // Initialize Resend inside the function to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Nichijo Contact <contact@nichijo-jp.com>",
      to: process.env.CONTACT_EMAIL || "kenya@kenglobaltech.com",
      subject: `お問い合わせ: ${name || "名前なし"}`,
      text: `
名前: ${name || "未入力"}
メール: ${email}
電話: ${phone || "未入力"}

メッセージ:
${message}
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
