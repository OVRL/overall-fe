import nodemailer from 'nodemailer';

// SMTP 환경 변수가 없으면 개발 모드로 간주하고 경고만 로깅
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendReplyEmail({
  to,
  title,
  replyContent,
  author,
}: {
  to: string;
  title: string;
  replyContent: string;
  author: string;
}) {
  const isSmtpConfigured = !!process.env.SMTP_USER;

  const mailOptions = {
    from: process.env.SMTP_USER || '"OVR 고객센터" <noreply@ovr-log.com>',
    to,
    subject: `[OVR] 문의하신 "${title}"에 대한 관리자의 답변입니다.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 8px;">OVR 문의 답변</h2>
        
        <div style="margin-top: 20px;">
          <p>안녕하세요. OVR 고객센터입니다.</p>
          <p>고객님께서 문의하신 내용에 대해 <b>${author}</b> 관리자가 다음과 같이 답변을 남겼습니다:</p>
        </div>

        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0; white-space: pre-wrap; color: #111;">
${replyContent}
        </div>

        <div style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px;">
          <p>본 메일은 발신 전용이므로 회신되지 않습니다.</p>
          <p>© ${new Date().getFullYear()} OVR. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  if (!isSmtpConfigured) {
    console.warn('[Email Not Sent] SMTP 환경변수가 없습니다. (개발용 디버그 내역)');
    console.log(mailOptions);
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] Successfully sent reply email to ${to}`);
  } catch (error) {
    console.error('[Email Send Error]', error);
    throw new Error('이메일 발송에 실패했습니다.');
  }
}
