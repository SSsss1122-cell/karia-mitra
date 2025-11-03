import ContractorDetailClient from "./ContractorClient"

// ✅ Always return at least one static param — required for static export
export async function generateStaticParams() {
  try {
    // Hardcoded fallback types (you can expand these)
    return [
      { type: "plumbing" },
      { type: "electrical" },
      { type: "builder" },
      { type: "carpenter" },
    ];
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    // Even on error, return safe defaults
    return [
      { type: "plumbing" },
      { type: "electrical" },
      { type: "builder" },
      { type: "carpenter" },
    ];
  }
}

// ✅ This renders the client component
export default function ContractorTypePage({ params }) {
  return <ContractorDetailClient type={params.type} />;
}
