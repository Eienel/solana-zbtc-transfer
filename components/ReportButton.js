"use client";
import { useState, useTransition } from "react";
import { reportAction } from "@/app/trend/[slug]/actions";

export default function ReportButton({ tutorialId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  const submit = () => {
    start(async () => {
      const res = await reportAction(tutorialId, reason);
      if (res?.ok) {
        setDone(true);
        setTimeout(() => {
          setOpen(false);
          setDone(false);
          setReason("");
        }, 1200);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-mute text-xs underline underline-offset-2"
      >
        Report
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="card w-full max-w-md m-4 p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <p className="text-center py-4">Thanks — we'll review it.</p>
            ) : (
              <>
                <h3 className="font-semibold">Report this tutorial</h3>
                <p className="text-sm text-mute">
                  If enough people report it, we'll hide it automatically.
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={280}
                  className="input resize-none"
                  placeholder="Reason (optional)"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={pending}
                    className="btn-primary flex-1"
                  >
                    {pending ? "Sending…" : "Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
