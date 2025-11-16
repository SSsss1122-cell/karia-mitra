export const metadata = {
  title: "Refund & Cancellation Policy | Karia Mitra",
  description:
    "Learn about Karia Mitra's refund and cancellation policies for customers and service partners.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          Refund & Cancellation Policy
        </h1>

        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
{`At Karia Mitra, we strive to ensure a smooth and transparent experience for both customers and service partners. This Refund & Cancellation Policy outlines how cancellations and refunds are handled.

1. For Customers
- You can cancel a booking before the service provider accepts it — full refund will be issued.
- If you cancel after a service provider has accepted the booking, a small cancellation fee may apply.
- Refunds will be processed within 5–7 business days to your original payment method.
- If a service is not delivered due to a partner no-show, you will receive a full refund.

2. For Partners
- Partners should avoid cancelling confirmed bookings unless absolutely necessary.
- Frequent cancellations may lead to temporary suspension of your account.
- Refunds for partner subscriptions or premium listings (if any) follow their respective plan terms.

3. Non-Refundable Situations
- Once the service has started, refunds will not be issued.
- Misuse of the app, fake bookings, or breach of terms will void refund eligibility.

4. How to Request a Refund
- You can initiate a refund request by contacting our support team at support@kariamitra.in.
- Provide booking ID, payment proof, and reason for refund.

5. Changes to Policy
- Karia Mitra reserves the right to update this policy at any time. The most recent version will always be available on this page.

6. Contact Us
For refund or cancellation assistance:
📧 Email: support@kariamitra.in
📍 Address: [Your Company Address]
📞 Phone: [Your Phone Number]

By using Karia Mitra, you agree to this Refund & Cancellation Policy.`}
        </p>

        <p className="text-xs text-gray-500 text-center mt-10">
          © {new Date().getFullYear()} Karia Mitra. All rights reserved.
        </p>
      </div>
    </div>
  );
}
