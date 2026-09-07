"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  FileText,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Sparkles,
  Sliders,
  Eye,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { verificationsApi } from "@/lib/api/verifications";
import { useRefreshVerifications } from "../hooks/use-verifications";
import type { VerificationDetail, DocumentType, RiskLevel, RecommendedAction } from "@/types";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TestScenario =
  | "AUTO"
  | "AUTHENTIC"
  | "DOB_TAMPERED"
  | "PHOTO_SPLICED"
  | "IMPERSONATION"
  | "DEGRADED_GLARE";

export function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
  const router = useRouter();
  const refreshVerifications = useRefreshVerifications();

  // Form states
  const [docType, setDocType] = React.useState<DocumentType>("PASSPORT");
  const [holderName, setHolderName] = React.useState("");
  const [documentNumber, setDocumentNumber] = React.useState("");
  const [checkpointId, setCheckpointId] = React.useState("chk_sonauli_01");
  const [testScenario, setTestScenario] = React.useState<TestScenario>("AUTO");

  // File states
  const [docFrontFile, setDocFrontFile] = React.useState<File | null>(null);
  const [docFrontPreview, setDocFrontPreview] = React.useState<string | null>(null);
  const [liveFaceFile, setLiveFaceFile] = React.useState<File | null>(null);
  const [liveFacePreview, setLiveFacePreview] = React.useState<string | null>(null);

  // Execution states
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [activeStage, setActiveStage] = React.useState<string>("");
  const [result, setResult] = React.useState<VerificationDetail | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Handle document front selection
  const handleDocFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFrontFile(file);
      const url = URL.createObjectURL(file);
      setDocFrontPreview(url);
    }
  };

  // Handle live face selection
  const handleLiveFaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLiveFaceFile(file);
      const url = URL.createObjectURL(file);
      setLiveFacePreview(url);
    }
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (docFrontPreview) URL.revokeObjectURL(docFrontPreview);
      if (liveFacePreview) URL.revokeObjectURL(liveFacePreview);
    };
  }, [docFrontPreview, liveFacePreview]);

  // Reset form
  const handleReset = () => {
    setDocFrontFile(null);
    setDocFrontPreview(null);
    setLiveFaceFile(null);
    setLiveFacePreview(null);
    setHolderName("");
    setDocumentNumber("");
    setTestScenario("AUTO");
    setResult(null);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Run screening submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);
    setActiveStage("Uploading document capture to screening gateway...");

    try {
      const formData = new FormData();
      formData.append("documentType", docType);
      if (holderName.trim()) formData.append("holderFullName", holderName.trim());
      if (documentNumber.trim()) formData.append("documentNumber", documentNumber.trim());
      formData.append("checkpointId", checkpointId);

      if (docFrontFile) {
        formData.append("documentFront", docFrontFile);
      }
      if (liveFaceFile) {
        formData.append("liveFace", liveFaceFile);
      }

      // Map testing scenario to backend forensic & biometric hints
      if (testScenario === "AUTHENTIC") {
        formData.append("tamperHint", "CLEAN");
        formData.append("biometricScenario", "MATCH_REAL");
      } else if (testScenario === "DOB_TAMPERED") {
        formData.append("tamperHint", "DOB_MODIFIED");
        formData.append("dateOfBirth", "12/05/1998");
      } else if (testScenario === "PHOTO_SPLICED") {
        formData.append("tamperHint", "PHOTO_REPLACED");
      } else if (testScenario === "IMPERSONATION") {
        formData.append("biometricScenario", "MISMATCH_IMPERSONATION");
      } else if (testScenario === "DEGRADED_GLARE") {
        formData.append("tamperHint", "COMPRESSION_MISMATCH");
        formData.append("qualityScore", "0.58");
      }

      // Simulate step-by-step progress visually
      setTimeout(() => setActiveStage("Validating ICAO Doc 9303 MRZ check digits..."), 400);
      setTimeout(() => setActiveStage("Executing digital image forensics & ELA..."), 800);
      setTimeout(() => setActiveStage("Evaluating pluggable ML model risk inference..."), 1200);

      const verification = await verificationsApi.uploadVerification(formData);

      setResult(verification);
      await refreshVerifications();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process document screening";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const riskLevel = result?.riskAssessment?.level || "LOW";
  const riskScore = result?.riskAssessment?.score ?? 0;
  const recommendedAction = result?.riskAssessment?.recommendedAction || "CLEAR";
  const engineVersion = result?.riskAssessment?.engineVersion || "ML-Risk-Model-v1";

  const getRiskBadgeVariant = (level: RiskLevel) => {
    switch (level) {
      case "HIGH":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "LOW":
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
  };

  const getActionBadgeVariant = (action: RecommendedAction) => {
    switch (action) {
      case "ESCALATE":
        return "bg-rose-600 text-white";
      case "MANUAL_VERIFICATION":
        return "bg-amber-600 text-white";
      case "REVIEW":
        return "bg-yellow-600 text-black";
      case "CLEAR":
      default:
        return "bg-emerald-600 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground m-0 flex items-center gap-2">
                <span>Document Screening & ML Risk Assessment</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  ML READY
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground m-0">
                Upload document capture for ML model inference and multi-signal risk evaluation.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* RESULT STATE: DISPLAY RISK ASSESSMENT FROM BACKEND / ML   */}
          {/* ========================================================= */}
          {result ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Risk Assessment Score Banner */}
              <div className={`p-5 rounded-xl border ${getRiskBadgeVariant(riskLevel)} space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {riskLevel === "HIGH" ? (
                      <ShieldAlert className="w-6 h-6 text-rose-400" />
                    ) : riskLevel === "MEDIUM" ? (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    )}
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        EVALUATED RISK LEVEL
                      </div>
                      <div className="text-xl font-bold tracking-tight">
                        {riskLevel} RISK
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-muted-foreground">RISK SCORE</div>
                    <div className="text-3xl font-extrabold font-mono">
                      {riskScore}
                      <span className="text-sm font-normal text-muted-foreground">/100</span>
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-background/50 h-2 rounded-full overflow-hidden border border-border/40">
                  <div
                    className={`h-full transition-all duration-700 ${
                      riskLevel === "HIGH"
                        ? "bg-rose-500"
                        : riskLevel === "MEDIUM"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.max(5, riskScore)}%` }}
                  />
                </div>

                {/* Recommended Action Pill */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs flex items-center gap-1.5">
                    <span className="text-muted-foreground">Recommended Action:</span>
                    <Badge className={`text-[11px] font-bold uppercase ${getActionBadgeVariant(recommendedAction)}`}>
                      {recommendedAction}
                    </Badge>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    Model: {engineVersion}
                  </div>
                </div>
              </div>

              {/* Explainable AI Rationale */}
              <div className="p-4 rounded-lg bg-muted/20 border border-border space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  <span>Explainable Assessment Summary</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {result.riskAssessment?.explanationSummary ||
                    "All independent verification signals, checksums, and biometric matches verified authentic."}
                </p>
              </div>

              {/* Case Details & Previews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-border bg-card space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">TRACKING NUMBER</div>
                  <div className="text-sm font-bold font-mono text-foreground">{result.trackingNumber}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Checkpoint: {result.checkpointName}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-border bg-card space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">HOLDER & DOCUMENT</div>
                  <div className="text-sm font-bold text-foreground">
                    {result.document.holderFullName || "UNSPECIFIED"}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {result.document.documentNumber || "PASSPORT"} ({result.document.type})
                  </div>
                </div>
              </div>

              {/* Uploaded Image Preview if available */}
              {docFrontPreview && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Uploaded Capture File</span>
                    <Badge variant="outline" className="text-[10px]">
                      PROCESSED
                    </Badge>
                  </div>
                  <div className="h-44 w-full rounded-lg border border-border overflow-hidden bg-black/40 flex items-center justify-center relative">
                    <img
                      src={docFrontPreview}
                      alt="Uploaded Document"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Evidence Signals Checklist */}
              {result.evidence && result.evidence.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    EVALUATED SIGNALS ({result.evidence.length})
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {result.evidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2.5 rounded-md border border-border/60 bg-muted/10 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <span>{ev.title}</span>
                            <Badge variant="outline" className="text-[9px] font-mono">
                              {ev.category}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground m-0">{ev.finding}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${
                            ev.status === "PASS"
                              ? "text-emerald-400 border-emerald-500/30"
                              : ev.status === "FAIL"
                              ? "text-rose-400 border-rose-500/30"
                              : "text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {ev.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Result Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={handleReset} className="w-full sm:w-auto text-xs">
                  Screen Another Document
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleClose();
                    router.push(`/verifications/${result.id}`);
                  }}
                  className="w-full sm:w-auto text-xs gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full Case Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* UPLOAD & CONFIGURATION FORM                               */
            /* ========================================================= */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Document Front Upload Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>Primary Document Image (Front / Bio Page)</span>
                    <span className="text-rose-400">*</span>
                  </span>
                  {docFrontFile && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {(docFrontFile.size / 1024).toFixed(1)} KB
                    </span>
                  )}
                </label>

                {docFrontPreview ? (
                  <div className="relative border border-border rounded-lg overflow-hidden bg-black/40 h-40 flex items-center justify-center group">
                    <img
                      src={docFrontPreview}
                      alt="Front Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDocFrontFile(null);
                        setDocFrontPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/5 hover:bg-muted/10 transition-colors">
                    <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-foreground">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Passport photo page, Driving Licence, or National ID (JPG, PNG, WEBP)
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleDocFrontChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>

              {/* Live Face / Selfie Upload (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span>Live Subject Face Capture (Optional for Biometrics & PAD)</span>
                  </span>
                </label>

                {liveFacePreview ? (
                  <div className="relative border border-border rounded-lg overflow-hidden bg-black/40 h-28 flex items-center justify-center group">
                    <img
                      src={liveFacePreview}
                      alt="Live Face Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLiveFaceFile(null);
                        setLiveFacePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-border/60 hover:border-primary/50 rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer bg-muted/5 hover:bg-muted/10 transition-colors">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Attach live checkpoint selfie for 1:1 face matching
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLiveFaceChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Document Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="PASSPORT">Passport (ICAO Doc 9303)</option>
                    <option value="DRIVING_LICENCE">Driving Licence</option>
                    <option value="NATIONAL_ID">National ID / Voter Card</option>
                    <option value="VISA">Official Visa Document</option>
                    <option value="OTHER">Other Supported Document</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Border Checkpoint</label>
                  <select
                    value={checkpointId}
                    onChange={(e) => setCheckpointId(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="chk_sonauli_01">Sonauli Integrated Check Post</option>
                    <option value="chk_raxaul_02">Raxaul Border Terminal</option>
                    <option value="chk_panitanki_03">Panitanki Land Port</option>
                    <option value="chk_jogbani_04">Jogbani Immigration Post</option>
                    <option value="chk_gauriphanta_05">Gauriphanta Border Crossing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Holder Full Name (Optional)</label>
                  <Input
                    placeholder="e.g. AMIT KUMAR"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Document Number (Optional)</label>
                  <Input
                    placeholder="e.g. Z9849201"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="h-9 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* ========================================================= */}
              {/* ML & FORENSIC TESTING SCENARIO OVERRIDE SELECTOR           */}
              {/* ========================================================= */}
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    <span>ML &amp; Forensic Test Scenario</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    TEST BENCH
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground m-0">
                  Select a simulation profile to test how the backend risk engine and ML adapter evaluate different fraud conditions:
                </p>

                <select
                  value={testScenario}
                  onChange={(e) => setTestScenario(e.target.value as TestScenario)}
                  className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="AUTO">Automated Assessment (Live Detection)</option>
                  <option value="AUTHENTIC">Authentic Document (Expected: LOW Risk, CLEAR)</option>
                  <option value="DOB_TAMPERED">Altered DOB / Modulo 10 Checksum Failure (Expected: HIGH Risk)</option>
                  <option value="PHOTO_SPLICED">Spliced Photo Boundary / Quantization Inconsistency (Expected: HIGH Risk)</option>
                  <option value="IMPERSONATION">Biometric Face Mismatch / Presentation Attack (Expected: HIGH Risk)</option>
                  <option value="DEGRADED_GLARE">Degraded Capture / Specular Glare / Expiry Warning (Expected: MEDIUM Risk)</option>
                </select>
              </div>

              {/* Stepper Progress / Loading */}
              {isProcessing && (
                <div className="p-4 rounded-lg bg-card border border-border space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{activeStage}</span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse w-3/4 rounded-full" />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={handleClose} disabled={isProcessing} className="text-xs">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isProcessing || !docFrontFile}
                  className="text-xs gap-1.5 font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Screening...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run Screening &amp; Risk Assessment</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
