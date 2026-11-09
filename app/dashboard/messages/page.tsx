import { createClient } from "@/utils/supabase/server";
import { MessagesTableClient } from "../components/admin/messages/MessagesTableClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
    const supabase = await createClient();

    const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });


    return (
        <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
            <div className="mx-auto max-w-7xl">
                <MessagesTableClient initialMessages={messages || []} />
            </div>
        </main>
    );
}