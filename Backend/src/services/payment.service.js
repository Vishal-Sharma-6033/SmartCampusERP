import Razorpay from 'razorpay';

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const createOrder = async (amount  )=>{
    return await razorpayInstance.orders.create({
        amount : amount * 100,
        currency : "INR",
        receipt : `receipt_${Date.now()}`
    })
}