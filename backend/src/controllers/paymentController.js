const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

exports.createOrder = async (req, res) => {
    const { amount } = req.body; // Amount in standard units (e.g., 1500 for ₹1500)

    try {
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        // MOCK MODE: If using mock keys, don't hit real API
        if (process.env.RAZORPAY_KEY_ID?.includes('mock')) {
            console.log('Using MOCK Razorpay Order');
            return res.status(200).json({
                id: `order_mock_${Date.now()}`,
                amount: options.amount,
                currency: options.currency
            });
        }

        const order = await instance.orders.create(options);

        res.status(200).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (err) {
        console.error('Razorpay Order Error:', err);
        res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret')
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        res.status(200).json({ status: 'success', message: 'Payment verified' });
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
};
