import { createClient } from "@/utils/supabase/server";
import { ProjectsTableClient } from "../components/admin/projects/ProjectsTableClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-8 bg-amber-50 min-h-screen">
      <ProjectsTableClient initialProjects={projects || []} />
    </div>
  );
}