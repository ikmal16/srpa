import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../services/api";

interface ImportStudentsProps {
  onImported: () => void;
}

/* ---------- Icons (inline outline SVGs) ---------- */

function Svg({
  className = "h-5 w-5",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

const UploadIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M12 16V5M7 9l5-5 5 5" />
    <path d="M5 20h14" />
  </Svg>
);

const FileSheetIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h6M12 11v8" />
  </Svg>
);

const XIcon = () => (
  <Svg className="h-4 w-4">
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg className="mt-0.5 h-4 w-4 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </Svg>
);

const AlertCircleIcon = () => (
  <Svg className="mt-0.5 h-4 w-4 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
  </Svg>
);

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`${className} animate-spin motion-reduce:animate-none`}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Helpers ---------- */

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKind(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".csv")) return "CSV";
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "Excel";
  return "File";
}

/** Compact inline status message. */
function Banner({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: ReactNode;
}) {
  const styles =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs ${styles}`}
    >
      {tone === "success" ? <CheckCircleIcon /> : <AlertCircleIcon />}
      <span>{children}</span>
    </div>
  );
}

/* ---------- Component ---------- */

export default function ImportStudents({ onImported }: ImportStudentsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the native input when the file is cleared, so the same file can be picked again.
  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  async function handleImport() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiFetch("/students/import", {
        method: "POST",
        headers: {},
        body: formData,
      });

      setMessage("Students imported successfully.");
      setFile(null);
      onImported();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to import students.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        aria-label="Choose a student import file (.xlsx, .xls or .csv)"
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
          setMessage("");
          setError("");
        }}
        className="sr-only"
      />

      {!file ? (
        /* Choose file button — matches ExportStudents secondary/outline style */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) {
              setFile(dropped);
              setMessage("");
              setError("");
            }
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors duration-150 motion-reduce:transition-none ${focusRing} ${
            dragging
              ? "border-blue-900 bg-blue-50 text-blue-900"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          <UploadIcon className="h-4 w-4 shrink-0" />
          <span>Import File</span>
        </button>
      ) : (
        /* Selected file chip + Import + Remove */
        <>
          <div className="inline-flex items-center gap-2.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-blue-900">
              <FileSheetIcon className="h-4 w-4" />
            </span>
            <span
              className="max-w-40 truncate font-medium text-slate-700"
              title={file.name}
            >
              {file.name}
            </span>
            <span className="hidden text-xs text-slate-400 sm:inline">
              {fileKind(file.name)} · {formatSize(file.size)}
            </span>
            {!loading && (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setMessage("");
                  setError("");
                }}
                aria-label={`Remove ${file.name}`}
                title="Remove file"
                className={`-mr-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 motion-reduce:transition-none ${focusRing}`}
              >
                <XIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            aria-busy={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 active:bg-blue-950 disabled:cursor-not-allowed disabled:bg-blue-900/50 motion-reduce:transition-none ${focusRing}`}
          >
            {loading && <Spinner />}
            {loading ? "Importing..." : "Import"}
          </button>
        </>
      )}

      {/* Feedback banners (only render when present) */}
      {message && <Banner tone="success">{message}</Banner>}
      {error && <Banner tone="error">{error}</Banner>}
    </div>
  );
}
