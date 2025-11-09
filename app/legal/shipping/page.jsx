export const metadata = {
  title: "Shipping & Delivery Policy | Karia Mitra",
  description:
    "Learn about Karia Mitra's service delivery timelines and shipping policy for customers and partners.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          Shipping & Delivery Policy
        </h1>

        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
{`At Karia Mitra, our platform connects users with nearby service professionals. As a digital service-based platform, we do not deliver physical products. However, we ensure timely coordination and delivery of booked services.

1. Service Delivery
- All services booked through Karia Mitra are scheduled based on the availability of the service provider.
- Customers will receive confirmation details, including the provider’s name, contact, and estimated arrival time.
- Any delays will be communicated through the app or via SMS/email.

2. Service Areas
- Karia Mitra currently operates within selected regions and cities.
- Availability of certain services may vary based on location and partner coverage.

3. Rescheduling and Cancellations
- Customers can reschedule service timings up to 2 hours before the scheduled appointment.
- Partners may also request rescheduling in case of emergencies, with customer consent.

4. Delivery Timeframe
- Most services are fulfilled within the same day or as per the scheduled slot chosen by the customer.
- Urgent or priority services may incur an additional charge.

5. Contact & Support
For any delivery or scheduling issues, please contact our support team:
📧 Email: support@kariamitra.in
📞 Phone: [Your Support Number]
📍 Address: [Your Company Address]

Karia Mitra reserves the right to update this Shipping & Delivery Policy as required to ensure better service and transparency.`}
        </p>

        <p className="text-xs text-gray-500 text-center mt-10">
          © {new Date().getFullYear()} Karia Mitra. All rights reserved.
        </p>
      </div>
    </div>
  );
}
