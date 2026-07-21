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
            <>
    
                <div className="p-8  space-y-8 bg-amber-50 h-screen">
    
                    <ExperiencesTableClient initialExperiences={experiences || []} />;
    
                </div>
    
            </>
        )
    

}