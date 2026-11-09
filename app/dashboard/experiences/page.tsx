import { createClient } from "@/utils/supabase/server";
import { ExperiencesTableClient } from "../components/admin/experiences/ExperiencesTableClient";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const supabase = await createClient();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("order", { ascending: true })
    .order("start_date", { ascending: false });


  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <ExperiencesTableClient initialExperiences={experiences || []} />
      </div>
    </main>
  );
}