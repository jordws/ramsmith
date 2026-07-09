"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function DeleteDocumentButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    setLoading(true);
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push("/documents");
      router.refresh();
    }
  }

  if (!confirming) {
    return (
      <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Delete permanently?</span>
      <Button variant="danger" size="sm" onClick={onDelete} disabled={loading}>
        {loading ? "Deleting…" : "Yes, delete"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </div>
  );
}
