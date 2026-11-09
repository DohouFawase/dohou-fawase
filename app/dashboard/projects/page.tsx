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
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <ProjectsTableClient initialProjects={projects || []} />
      </div>
    </main>
  );
}