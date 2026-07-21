import { createClient } from "@/utils/supabase/server";
import { SkillsTableClient } from "../components/admin/competences/SkillsTableClient";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
    const supabase = await createClient();

    const { data: skills } = await supabase
        .from("skills")
        .select("*")
        .order("order", { ascending: true });

    return (
        <>

            <div className="p-8  space-y-8 bg-amber-50 h-screen">

                <SkillsTableClient initialSkills={skills || []} />;

            </div>

        </>
    )


}