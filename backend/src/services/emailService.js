const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key_123');

const sendOrderConfirmation = async (email, order) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Buildflow <onboarding@resend.dev>', // In production, use your verified domain
            to: [email],
            subject: `Order Recieved: #${order.id.substring(0, 8)}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #2563eb;">BUILDFLOW</h1>
                    <h2>Thanks for your order, ${order.customerName}!</h2>
                    <p>We've recieved your order for <strong>${order.items.length} items</strong>.</p>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                        <p><strong>Status:</strong> Pending Confirmation</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                        You can track your real-time delivery progress in the Buildflow app.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Email Service Error:', err);
        return { success: false, error: err.message };
    }
};

const sendOrderStatusUpdate = async (email, order, status) => {
    try {
        await resend.emails.send({
            from: 'Buildflow <onboarding@resend.dev>',
            to: [email],
            subject: `Order Updated: ${status}`,
            html: `<p>Your order #${order.id.substring(0, 8)} status has changed to: <strong>${status}</strong></p>`,
        });
    } catch (err) {
        console.error('Email Update Error:', err);
    }
};

module.exports = { sendOrderConfirmation, sendOrderStatusUpdate };
