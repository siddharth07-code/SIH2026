"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, AlertCircle, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { verificationsApi } from "@/lib/api/verifications";
import { ApiClientError, NetworkError } from "@/lib/api/errors";

interface UploadVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function UploadVerificationModal({ isOpen, onClose }: UploadVerificationModalProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [checkpointId, setCheckpointId] = React.useState<string>("chk_sonauli_01");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 15MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB).`);
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type) && !selectedFile.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      setError("Unsupported file format. Please provide a JPG, PNG, WEBP, or PDF document capture.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a document capture image before initiating screening.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("checkpointId", checkpointId);

      const result = await verificationsApi.createVerification(formData);
      onClose();
      router.push(`/verifications/${result.id}`);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message || `Pipeline processing failed (HTTP ${err.status}).`);
      } else if (err instanceof NetworkError) {
        setError("Network error: Unable to reach the central screening backend.");
      } else if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred during document orchestration.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <Card className="w-full max-w-lg border border-white/[0.12] bg-slate-900 shadow-2xl relative overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <CardTitle id="upload-modal-title" className="text-base font-bold text-foreground truncate">
                New Document Verification
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Multi-signal pipeline: classification, OOD, OCR, forensics &amp; risk
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* File Dropzone / Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Document Optical Capture</span>
                <span className="text-[10px] text-muted-foreground font-mono">MAX: 15MB</span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  file
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-white/10 hover:border-primary/50 bg-slate-950/50 hover:bg-slate-950/80"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="text-xs font-semibold text-foreground">{file.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {file.type || "Document"}
                    </div>
                    <span className="text-[10px] text-primary hover:underline block pt-1">
                      Click to change file
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                    <div className="text-xs font-medium text-foreground">
                      Choose document image file or click to browse
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Supported: Passport, Aadhaar, PAN, Voter ID, Driving License (JPG, PNG, WEBP, PDF)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Checkpoint Post Selection */}
            <div className="space-y-1.5">
              <label htmlFor="checkpoint-select" className="text-xs font-semibold text-foreground">
                Operational Ingest Checkpoint
              </label>
              <select
                id="checkpoint-select"
                value={checkpointId}
                onChange={(e) => setCheckpointId(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-9 rounded-md bg-slate-950/80 border border-white/10 text-xs px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="chk_sonauli_01">Sonauli Integrated Check Post (Alpha)</option>
                <option value="chk_raxaul_02">Raxaul Border Terminal (Bravo)</option>
                <option value="chk_panitanki_03">Panitanki Land Port (Charlie)</option>
              </select>
            </div>

            {/* Error Notification */}
            {error && (
              <div
                className="rounded-md border border-rose-500/30 bg-rose-950/25 p-3 text-xs text-rose-300 flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 sm:p-5 pt-0 flex items-center justify-end gap-2 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-9"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!file || isSubmitting}
              className="text-xs h-9 gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Multi-Signal AI...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Initiate Screening</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
