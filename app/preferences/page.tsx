"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PreferencesEditor } from "@/components/account/preferences-editor";
import { useAuth } from "@/lib/auth-context";

export default function Preferences() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return <PreferencesEditor onClose={() => router.push("/results")} />;
}
