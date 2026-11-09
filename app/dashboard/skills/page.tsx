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
        <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
            <div className="mx-auto max-w-7xl">
                <SkillsTableClient initialSkills={skills || []} />
            </div>
        </main>
    );
}