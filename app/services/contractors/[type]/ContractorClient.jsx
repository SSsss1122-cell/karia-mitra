"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Wrench, Zap
} from "lucide-react";
import { supabase } from "../../../lib/supabase"

const contractorDetails = {
  plumbing: {
    title: "Plumbing Contractors",
    color: "from-blue-500 to-cyan-500",
    icon: <Wrench className="w-6 h-6 text-white" />
  },
  electrical: {
    title: "Electrical Contractors",
    color: "from-yellow-500 to-amber-500",
    icon: <Zap className="w-6 h-6 text-white" />
  }
};

export default function ContractorClient({ type }) {
  const router = useRouter();
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContractors() {
      const { data, error } = await supabase
        .from("Contractor")
        .select("*")
        .ilike("expertise", `%${type}%`);
      if (error) console.error(error);
      setContractors(data || []);
      setLoading(false);
    }
    fetchContractors();
  }, [type]);

  if (loading) return <p>Loading...</p>;

  if (!contractorDetails[type]) {
    return (
      <div className="p-4 text-center">
        <h2>Category "{type}" not found</h2>
        <button onClick={() => router.push("/services/contractors")}>Back</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{contractorDetails[type].title}</h1>
      <ul className="mt-4">
        {contractors.map(c => (
          <li key={c.id} className="border p-2 rounded mb-2">
            <p className="font-semibold">{c.name}</p>
            <p>{c.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
