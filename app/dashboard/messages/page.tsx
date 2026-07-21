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
        <>
            <div className="p-8  space-y-8 bg-amber-50 h-screen">

                <MessagesTableClient initialMessages={messages || []} />;
            </div>
        </>
    )
}