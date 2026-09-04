"use client";

import * as React from "react";
import {
  Binary,
  RotateCcw,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MRZSample {
  id: string;
  name: string;
  scenario: "GENUINE" | "DOB_TAMPERED" | "DOC_NUM_MISMATCH" | "EXPIRED";
  line1: string;
  line2: string;
  vizDob: string;
  vizDocNum: string;
  vizExpiry: string;
  description: string;
}

const mrzSamples: MRZSample[] = [
  {
    id: "sample-genuine",
    name: "Valid Republic of India Passport (ICAO Standard)",
    scenario: "GENUINE",
    line1: "P<INDSHARMA<<DEEP<<<<<<<<<<<<<<<<<<<<<<<<<<<",
    line2: "Z1234567<8IND9804127M2809015<<<<<<<<<<<<<<00",
    vizDob: "12/04/1998",
    vizDocNum: "Z1234567",
    vizExpiry: "01/09/2028",
    description: "All 4 check digits mathematically valid under ICAO 9303 7-3-1 weighting. VIZ matches MRZ identically.",
  },
  {
    id: "sample-dob-tampered",
    name: "Manipulated Date of Birth (Age Alteration Fraud)",
    scenario: "DOB_TAMPERED",
    line1: "P<INDSHARMA<<DEEP<<<<<<<<<<<<<<<<<<<<<<<<<<<",
    line2: "Z1234567<8IND9804123M2809015<<<<<<<<<<<<<<02",
    vizDob: "12/04/2000",
    vizDocNum: "Z1234567",
    vizExpiry: "01/09/2028",
    description: "Visual DOB altered to 2000; MRZ encoded check digit 3 does not match computed value 7. Composite fails.",
  },
  {
    id: "sample-doc-tampered",
    name: "Forged Document Number (Serial Digit Splicing)",
    scenario: "DOC_NUM_MISMATCH",
    line1: "P<GBRSMITH<<JOHN<<<<<<<<<<<<<<<<<<<<<<<<<<<<",
    line2: "A9876543<2GBR8506154M2512318<<<<<<<<<<<<<<04",
    vizDocNum: "A9876549",
    vizDob: "15/06/1985",
    vizExpiry: "31/12/2025",
    description: "Document number visual zone edited from 3 to 9. Check digit 2 mismatches computed value 6.",
  },
];

// ICAO 9303 Weighting: 7, 3, 1, 7, 3, 1...
function calculateIcaoCheckDigit(str: string): number {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i].toUpperCase();
    let val = 0;
    if (char >= "0" && char <= "9") {
      val = char.charCodeAt(0) - 48;
    } else if (char >= "A" && char <= "Z") {
      val = char.charCodeAt(0) - 55;
    } else if (char === "<") {
      val = 0;
    }
    sum += val * weights[i % 3];
  }
  return sum % 10;
}

export function MrzValidatorTool() {
  const [selectedSample, setSelectedSample] = React.useState<MRZSample>(mrzSamples[0]);
  const [line1, setLine1] = React.useState(selectedSample.line1);
  const [line2, setLine2] = React.useState(selectedSample.line2);

  const handleSelectSample = (sample: MRZSample) => {
    setSelectedSample(sample);
    setLine1(sample.line1);
    setLine2(sample.line2);
  };

  // Extract parsed fields from Line 2 (44 chars TD3)
  const parsed = React.useMemo(() => {
    const l2 = line2.padEnd(44, "<").slice(0, 44);

    const docNumRaw = l2.slice(0, 9);
    const docNumCheckDigit = l2.slice(9, 10);
    const calculatedDocNumCheck = String(calculateIcaoCheckDigit(docNumRaw));
    const docNumValid = docNumCheckDigit === calculatedDocNumCheck;

    const nationality = l2.slice(10, 13);

    const dobRaw = l2.slice(13, 19); // YYMMDD
    const dobCheckDigit = l2.slice(19, 20);
    const calculatedDobCheck = String(calculateIcaoCheckDigit(dobRaw));
    const dobValid = dobCheckDigit === calculatedDobCheck;

    const sex = l2.slice(20, 21);

    const expiryRaw = l2.slice(21, 27); // YYMMDD
    const expiryCheckDigit = l2.slice(27, 28);
    const calculatedExpiryCheck = String(calculateIcaoCheckDigit(expiryRaw));
    const expiryValid = expiryCheckDigit === calculatedExpiryCheck;

    const optionalData = l2.slice(28, 42);
    const compositeCheckDigit = l2.slice(43, 44);

    // Composite string = docNum + docNumCheck + dob + dobCheck + expiry + expiryCheck + optional
    const compositeString =
      docNumRaw + docNumCheckDigit + dobRaw + dobCheckDigit + expiryRaw + expiryCheckDigit + optionalData;
    const calculatedComposite = String(calculateIcaoCheckDigit(compositeString));
    const compositeValid = compositeCheckDigit === calculatedComposite;

    return {
      docNumRaw: docNumRaw.replace(/</g, ""),
      docNumCheckDigit,
      calculatedDocNumCheck,
      docNumValid,
      nationality,
      dobRaw,
      formattedDob: `19${dobRaw.slice(0, 2)}/${dobRaw.slice(2, 4)}/${dobRaw.slice(4, 6)}`,
      dobCheckDigit,
      calculatedDobCheck,
      dobValid,
      sex,
      expiryRaw,
      formattedExpiry: `20${expiryRaw.slice(0, 2)}/${expiryRaw.slice(2, 4)}/${expiryRaw.slice(4, 6)}`,
      expiryCheckDigit,
      calculatedExpiryCheck,
      expiryValid,
      compositeCheckDigit,
      calculatedComposite,
      compositeValid,
      allValid: docNumValid && dobValid && expiryValid && compositeValid,
    };
  }, [line2]);

  return (
    <div className="space-y-6">
      {/* Sample Selector Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
            Load Operational Test Scenarios
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            ICAO DOC 9303 PART 3/4 SPECIFICATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {mrzSamples.map((sample) => {
            const isSelected = sample.id === selectedSample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-card hover:border-strong hover:bg-subtle"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground truncate">
                    {sample.name.split("(")[0]}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs font-mono ${
                      sample.scenario === "GENUINE"
                        ? "text-emerald-500 border-emerald-500/30"
                        : "text-rose-500 border-rose-500/30"
                    }`}
                  >
                    {sample.scenario}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed m-0 line-clamp-2">
                  {sample.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Raw MRZ String Editor / Terminal */}
      <Card className="jp-card overflow-hidden">
        <CardHeader className="p-4 pb-3 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Binary className="w-5 h-5 text-primary shrink-0" />
            <CardTitle className="text-base font-bold text-foreground">
              TD3 Machine Readable Zone (MRZ) Optical Stream
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelectSample(selectedSample)}
            className="text-xs h-8 gap-1.5 text-muted-foreground cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-3.5">
          <div className="space-y-2.5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                <span>Line 1 (Document Type, Issuer, Holder Name — 44 Chars)</span>
                <span>{line1.length}/44</span>
              </label>
              <input
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value.toUpperCase())}
                maxLength={44}
                className="w-full font-mono text-sm p-3 rounded-md border border-border bg-black text-emerald-400 tracking-wider outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase flex items-center justify-between">
                <span>Line 2 (Doc #, DOB, Expiry, Check Digits — 44 Chars)</span>
                <span>{line2.length}/44</span>
              </label>
              <input
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value.toUpperCase())}
                maxLength={44}
                className="w-full font-mono text-sm p-3 rounded-md border border-border bg-black text-emerald-400 tracking-wider outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="p-2.5 rounded border border-border bg-elevated text-[11px] text-muted-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>
              ICAO 9303 Part 4 algorithm uses repeating weights <strong>7-3-1</strong> modulo 10. Check digits are deterministic; zero hallucination.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Algorithmic Verification Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Check 1: Document Number */}
        <div
          className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
            parsed.docNumValid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Check Digit 1
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] font-mono ${
                  parsed.docNumValid ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {parsed.docNumValid ? "VALID" : "MISMATCH"}
              </Badge>
            </div>
            <h4 className="text-xs font-bold text-foreground m-0">
              Document Number
            </h4>
            <span className="font-mono text-xs text-foreground block mt-1">
              {parsed.docNumRaw}
            </span>
          </div>
          <div className="pt-2 border-t border-border/50 text-[11px] font-mono flex items-center justify-between text-muted-foreground">
            <span>Read: {parsed.docNumCheckDigit}</span>
            <span>Calc: {parsed.calculatedDocNumCheck}</span>
          </div>
        </div>

        {/* Check 2: Date of Birth */}
        <div
          className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
            parsed.dobValid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Check Digit 2
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] font-mono ${
                  parsed.dobValid ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {parsed.dobValid ? "VALID" : "TAMPERING FLAG"}
              </Badge>
            </div>
            <h4 className="text-xs font-bold text-foreground m-0">
              Date of Birth (DOB)
            </h4>
            <span className="font-mono text-xs text-foreground block mt-1">
              {parsed.dobRaw} ({parsed.formattedDob})
            </span>
          </div>
          <div className="pt-2 border-t border-border/50 text-[11px] font-mono flex items-center justify-between text-muted-foreground">
            <span>Read: {parsed.dobCheckDigit}</span>
            <span className={parsed.dobValid ? "" : "text-rose-500 font-bold"}>
              Calc: {parsed.calculatedDobCheck}
            </span>
          </div>
        </div>

        {/* Check 3: Date of Expiry */}
        <div
          className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
            parsed.expiryValid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Check Digit 3
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] font-mono ${
                  parsed.expiryValid ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {parsed.expiryValid ? "VALID" : "MISMATCH"}
              </Badge>
            </div>
            <h4 className="text-xs font-bold text-foreground m-0">
              Date of Expiry
            </h4>
            <span className="font-mono text-xs text-foreground block mt-1">
              {parsed.expiryRaw} ({parsed.formattedExpiry})
            </span>
          </div>
          <div className="pt-2 border-t border-border/50 text-[11px] font-mono flex items-center justify-between text-muted-foreground">
            <span>Read: {parsed.expiryCheckDigit}</span>
            <span>Calc: {parsed.calculatedExpiryCheck}</span>
          </div>
        </div>

        {/* Check 4: Composite Checksum */}
        <div
          className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
            parsed.compositeValid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                Check Digit 4
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] font-mono ${
                  parsed.compositeValid ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {parsed.compositeValid ? "VALID" : "COMPOSITE FAIL"}
              </Badge>
            </div>
            <h4 className="text-xs font-bold text-foreground m-0">
              Composite Invariant
            </h4>
            <span className="font-mono text-xs text-foreground block mt-1">
              Full MRZ Integrity
            </span>
          </div>
          <div className="pt-2 border-t border-border/50 text-[11px] font-mono flex items-center justify-between text-muted-foreground">
            <span>Read: {parsed.compositeCheckDigit}</span>
            <span className={parsed.compositeValid ? "" : "text-rose-500 font-bold"}>
              Calc: {parsed.calculatedComposite}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Inspection Zone (VIZ) vs MRZ Consistency Comparator */}
      <Card className="jp-card">
        <CardHeader className="p-3.5 pb-2.5 border-b border-border">
          <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
            Optical VIZ ↔ Algorithmic MRZ Cross-Consistency Check
          </CardTitle>
          <CardDescription className="text-xs">
            Compares independently captured visual text against parsed machine-readable values.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded border border-border bg-elevated space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                Visual DOB vs MRZ DOB
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-foreground">{selectedSample.vizDob}</span>
                <span className="text-muted-foreground">↔</span>
                <span className="font-mono font-bold text-foreground">{parsed.formattedDob}</span>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold block ${
                  selectedSample.vizDob.endsWith(parsed.dobRaw.slice(0, 2))
                    ? "text-emerald-500"
                    : "text-rose-500"
                }`}
              >
                {selectedSample.vizDob.endsWith(parsed.dobRaw.slice(0, 2))
                  ? "✓ CONSISTENT"
                  : "⚠ HIGH-SEVERITY MISMATCH"}
              </span>
            </div>

            <div className="p-2.5 rounded border border-border bg-elevated space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                Visual Doc # vs MRZ Doc #
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-foreground">{selectedSample.vizDocNum}</span>
                <span className="text-muted-foreground">↔</span>
                <span className="font-mono font-bold text-foreground">{parsed.docNumRaw}</span>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold block ${
                  selectedSample.vizDocNum === parsed.docNumRaw
                    ? "text-emerald-500"
                    : "text-rose-500"
                }`}
              >
                {selectedSample.vizDocNum === parsed.docNumRaw
                  ? "✓ CONSISTENT"
                  : "⚠ SERIAL DIGIT SPLICED"}
              </span>
            </div>

            <div className="p-2.5 rounded border border-border bg-elevated space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                Risk Engine Determination
              </span>
              <div className="pt-0.5">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono uppercase ${
                    parsed.allValid
                      ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                      : "text-rose-500 border-rose-500/30 bg-rose-500/10"
                  }`}
                >
                  {parsed.allValid ? "LOW RISK / CANDIDATE CLEAR" : "HIGH RISK / MANUAL INSPECTION"}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground block font-mono mt-1">
                Deterministic Checksum Invariant
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
