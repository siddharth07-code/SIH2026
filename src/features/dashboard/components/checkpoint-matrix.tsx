"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Plane,
  Truck,
  Smartphone,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CheckpointNode {
  id: string;
  name: string;
  type: "AIRPORT" | "LAND_BORDER" | "MOBILE_PATROL";
  location: string;
  activeOfficers: number;
  activeTerminals: number;
  shiftScreenings: number;
  anomaliesDetected: number;
  status: "NORMAL" | "ELEVATED" | "ALERT";
  lastPing: string;
}

const defaultCheckpoints: CheckpointNode[] = [
  {
    id: "CP-T1-INTL",
    name: "Terminal 1 — Gate 4A Immigration",
    type: "AIRPORT",
    location: "International Arrivals Wing",
    activeOfficers: 6,
    activeTerminals: 6,
    shiftScreenings: 428,
    anomaliesDetected: 3,
    status: "NORMAL",
    lastPing: "Just now",
  },
  {
    id: "CP-T2-EAST",
    name: "Terminal 2 — FastTrack Clearance",
    type: "AIRPORT",
    location: "Departures Concourse B",
    activeOfficers: 4,
    activeTerminals: 5,
    shiftScreenings: 312,
    anomaliesDetected: 5,
    status: "ELEVATED",
    lastPing: "1m ago",
  },
  {
    id: "CP-BORDER-NORTH",
    name: "Land Border Post Alpha — Sector 04",
    type: "LAND_BORDER",
    location: "Northern Border Crossing",
    activeOfficers: 8,
    activeTerminals: 4,
    shiftScreenings: 184,
    anomaliesDetected: 7,
    status: "ALERT",
    lastPing: "Just now",
  },
  {
    id: "CP-MOBILE-03",
    name: "Mobile Patrol Rapid Unit — Squad 3",
    type: "MOBILE_PATROL",
    location: "Transit Hub Mobile Checkpoint",
    activeOfficers: 3,
    activeTerminals: 3,
    shiftScreenings: 67,
    anomaliesDetected: 1,
    status: "NORMAL",
    lastPing: "2m ago",
  },
];

export function CheckpointMatrix() {
  const [filterType, setFilterType] = React.useState<string>("ALL");

  const filteredCheckpoints = React.useMemo(() => {
    if (filterType === "ALL") return defaultCheckpoints;
    return defaultCheckpoints.filter((cp) => cp.type === filterType);
  }, [filterType]);

  const getTypeIcon = (type: CheckpointNode["type"]) => {
    switch (type) {
      case "AIRPORT":
        return <Plane className="w-3.5 h-3.5 text-sky-400" />;
      case "LAND_BORDER":
        return <Truck className="w-3.5 h-3.5 text-amber-400" />;
      case "MOBILE_PATROL":
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status: CheckpointNode["status"]) => {
    switch (status) {
      case "NORMAL":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded border border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            NORMAL
          </span>
        );
      case "ELEVATED":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded border border-amber-500/30 text-amber-500 bg-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            ELEVATED
          </span>
        );
      case "ALERT":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded border border-rose-500/30 text-rose-500 bg-rose-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            ALERT
          </span>
        );
    }
  };

  return (
    <Card className="jp-card overflow-hidden">
      <CardHeader className="p-4 pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="jp-sidebar-brand-icon">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 m-0">
              <span>Port & Checkpoint Ingest Operations</span>
              <Badge variant="outline" className="text-xs font-mono">
                {defaultCheckpoints.length} ACTIVE POSTS
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground m-0 mt-0.5">
              Operational gate status, mobile terminal bindings, and real-time screening volume.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-subtle p-1 rounded-md border border-border self-start sm:self-auto">
          {["ALL", "AIRPORT", "LAND_BORDER", "MOBILE_PATROL"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                filterType === type
                  ? "bg-surface text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "ALL" ? "ALL (4)" : type.replace("_", " ")}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-auto max-h-[calc(100dvh-20rem)] overscroll-contain">
        <table className="jp-table">
          <thead className="jp-table-thead">
            <tr>
              <th className="jp-table-th">Checkpoint Post</th>
              <th className="jp-table-th">Post Type</th>
              <th className="jp-table-th hidden md:table-cell">On Duty</th>
              <th className="jp-table-th">Shift Volume</th>
              <th className="jp-table-th">Anomalies</th>
              <th className="jp-table-th">Status</th>
              <th className="jp-table-th text-right">Action</th>
            </tr>
          </thead>
          <tbody className="jp-table-tbody">
            {filteredCheckpoints.map((cp) => (
              <tr key={cp.id} className="jp-table-tr hover:bg-muted/40 transition-colors">
                <td className="jp-table-td">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground text-xs block">
                      {cp.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      {cp.id} • {cp.location}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td">
                  <div className="flex items-center gap-1.5 text-xs text-foreground">
                    {getTypeIcon(cp.type)}
                    <span className="text-[11px] font-medium">{cp.type.replace("_", " ")}</span>
                  </div>
                </td>
                <td className="jp-table-td hidden md:table-cell">
                  <span className="font-mono text-xs text-foreground">
                    {cp.activeOfficers} Officers / {cp.activeTerminals} Units
                  </span>
                </td>
                <td className="jp-table-td">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-xs text-foreground">
                      {cp.shiftScreenings}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Ping: {cp.lastPing}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td">
                  <span
                    className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                      cp.anomaliesDetected > 4
                        ? "text-rose-500 bg-rose-500/10 border border-rose-500/20"
                        : cp.anomaliesDetected > 0
                        ? "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                        : "text-muted-foreground"
                    }`}
                  >
                    {cp.anomaliesDetected} flagged
                  </span>
                </td>
                <td className="jp-table-td">
                  {getStatusBadge(cp.status)}
                </td>
                <td className="jp-table-td text-right">
                  <Link href={`/verifications?q=${encodeURIComponent(cp.name.split(" ")[0])}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-[11px] h-7 px-2">
                      <Filter className="w-3 h-3 text-muted-foreground" />
                      <span>Queue</span>
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
