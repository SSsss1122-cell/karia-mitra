export const metadata = {
  title: "Terms & Conditions | Karia Mitra",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
{`Welcome to Karia Mitra (“App”, “Platform”, “we”, “our”, or “us”). 
By using this App, you agree to these Terms & Conditions.

- You must be 18 years or older to use this App.
- Customers use the app to find and hire service providers.
- Partners offer services such as plumbing, construction, and electrical work.
- You agree to use the platform lawfully and responsibly.
- Karia Mitra acts only as a bridge between customers and service providers.
- These Terms are governed by the laws of India.`}
        </p>
      </div>
    </div>
  );
}
