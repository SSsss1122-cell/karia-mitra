export const metadata = {
  title: "Privacy Policy | Karia Mitra",
  description:
    "Read the Privacy Policy of Karia Mitra to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
{`At Karia Mitra, your privacy is our top priority. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our mobile app and web platform.

1. Information We Collect
- Personal information such as your name, phone number, email, and address.
- Service preferences, reviews, and ratings.
- Device and location information to connect you with nearby service providers.

2. How We Use Your Information
- To provide, manage, and improve our services.
- To connect customers with local service providers.
- To send important notifications about bookings and offers.

3. Data Security
- We use encryption and secure storage to protect your data.
- We never sell or share your personal information with unauthorized third parties.

4. User Rights
- You can request account deletion or data removal anytime by contacting our support team.
- You can update or correct your details within your profile section.

5. Cookies & Tracking
- Our platform may use cookies to enhance your browsing experience. You can disable them in your browser settings.

6. Updates to This Policy
- We may update this policy occasionally to comply with new laws or improve transparency. The latest version will always be available on this page.

7. Contact Us
If you have questions or concerns about this Privacy Policy, contact us at:
📧 support@kariamitra.in
📍 [Your Company Address]
📞 [Your Phone Number]

By using the Karia Mitra platform, you consent to this Privacy Policy.`}
        </p>

        <p className="text-xs text-gray-500 text-center mt-10">
          © {new Date().getFullYear()} Karia Mitra. All rights reserved.
        </p>
      </div>
    </div>
  );
}
