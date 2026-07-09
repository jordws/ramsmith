import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { DocumentContent } from "@/types";
import { riskScore, riskBand, BAND_HEX } from "@/lib/risk";

export interface RamsPdfProps {
  ref: string;
  title: string;
  eventName: string;
  venue: string;
  client: string;
  siteDates: string;
  preparedBy: string;
  company: string;
  status: string;
  createdAt: string;
  content: DocumentContent;
}

const INK = "#12151C";
const SIGNAL = "#F4C20D";
const MUTED = "#6B7280";
const LINE = "#E4E7EC";

const s = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 48, fontSize: 9, color: INK, fontFamily: "Helvetica" },
  // Signature hazard-stripe band at the very top of the page.
  stripe: { height: 6, flexDirection: "row" },
  stripeSeg: { width: 12, height: 6 },
  header: {
    paddingHorizontal: 36,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brand: { fontSize: 15, fontFamily: "Helvetica-Bold", letterSpacing: -0.3 },
  brandDot: { color: SIGNAL },
  refBox: { alignItems: "flex-end" },
  refText: { fontSize: 9, fontFamily: "Courier", color: MUTED },
  stamp: {
    marginTop: 4,
    fontSize: 8,
    fontFamily: "Courier-Bold",
    color: INK,
    borderWidth: 1,
    borderColor: INK,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  body: { paddingHorizontal: 36, paddingTop: 16 },
  docTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  subTitle: { fontSize: 9, color: MUTED, marginBottom: 12 },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  metaCell: { width: "50%", marginBottom: 6 },
  metaLabel: { fontSize: 7, color: MUTED, textTransform: "uppercase", letterSpacing: 0.4 },
  metaValue: { fontSize: 9, marginTop: 1 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderBottomColor: SIGNAL,
  },
  // Risk table
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE },
  th: { fontFamily: "Helvetica-Bold", fontSize: 7.5, color: MUTED, textTransform: "uppercase", padding: 4 },
  td: { fontSize: 8, padding: 4 },
  cHaz: { width: "34%" },
  cWho: { width: "14%" },
  cCtl: { width: "34%" },
  cIni: { width: "9%", textAlign: "center" },
  cRes: { width: "9%", textAlign: "center" },
  bandPill: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#fff", paddingVertical: 1, borderRadius: 2, textAlign: "center" },
  ctrlItem: { marginBottom: 1 },
  // Load plan
  lpHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  lpMeta: { fontSize: 9 },
  lpBar: { fontFamily: "Courier-Bold", fontSize: 9 },
  step: { flexDirection: "row", marginBottom: 4 },
  stepNo: { width: 18, fontFamily: "Courier-Bold", fontSize: 9 },
  stepText: { flex: 1, fontSize: 9 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    fontSize: 7,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function Stripe() {
  const segs = Array.from({ length: 60 });
  return (
    <View style={s.stripe}>
      {segs.map((_, i) => (
        <View
          key={i}
          style={[s.stripeSeg, { backgroundColor: i % 2 === 0 ? SIGNAL : INK }]}
        />
      ))}
    </View>
  );
}

function Band({ score }: { score: number }) {
  const band = riskBand(score);
  return (
    <Text style={[s.bandPill, { backgroundColor: BAND_HEX[band] }]}>
      {score} {band}
    </Text>
  );
}

export function RamsDocument(props: RamsPdfProps) {
  const { content } = props;
  const totalLoad = content.loadPlan.items.reduce(
    (sum, it) => sum + it.quantity * it.weightKg,
    0
  );
  const capacity = content.loadPlan.payloadCapacityKg || 0;
  const overloaded = capacity > 0 && totalLoad > capacity;
  const utilisation = capacity > 0 ? Math.round((totalLoad / capacity) * 100) : 0;

  return (
    <Document title={`${props.ref} — ${props.title}`} author={props.company}>
      <Page size="A4" style={s.page}>
        <Stripe />

        <View style={s.header} fixed>
          <Text style={s.brand}>
            RAMS<Text style={s.brandDot}>·</Text>smith
          </Text>
          <View style={s.refBox}>
            <Text style={s.refText}>{props.ref}</Text>
            <Text style={s.stamp}>{props.status}</Text>
          </View>
        </View>

        <View style={s.body}>
          <Text style={s.docTitle}>{props.title}</Text>
          <Text style={s.subTitle}>
            Risk Assessment &amp; Method Statement · {props.company}
          </Text>

          <View style={s.metaGrid}>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Event</Text>
              <Text style={s.metaValue}>{props.eventName}</Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Venue / Site</Text>
              <Text style={s.metaValue}>{props.venue}</Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Client</Text>
              <Text style={s.metaValue}>{props.client}</Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Dates on site</Text>
              <Text style={s.metaValue}>{props.siteDates}</Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Prepared by</Text>
              <Text style={s.metaValue}>{props.preparedBy}</Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Issued</Text>
              <Text style={s.metaValue}>{props.createdAt}</Text>
            </View>
          </View>

          {/* -------- Risk assessment -------- */}
          <Text style={s.sectionTitle}>1 · Risk Assessment</Text>
          <View style={s.tr}>
            <Text style={[s.th, s.cHaz]}>Hazard</Text>
            <Text style={[s.th, s.cWho]}>Who</Text>
            <Text style={[s.th, s.cCtl]}>Control measures</Text>
            <Text style={[s.th, s.cIni]}>Initial</Text>
            <Text style={[s.th, s.cRes]}>Residual</Text>
          </View>
          {content.hazards.map((h) => (
            <View style={s.tr} key={h.id} wrap={false}>
              <View style={s.cHaz}>
                <Text style={[s.td, { fontFamily: "Helvetica-Bold" }]}>
                  {h.category}
                </Text>
                <Text style={s.td}>{h.hazard}</Text>
              </View>
              <Text style={[s.td, s.cWho]}>{h.whoAtRisk}</Text>
              <View style={s.cCtl}>
                {h.controls.map((c, i) => (
                  <Text style={[s.td, s.ctrlItem]} key={i}>
                    • {c}
                  </Text>
                ))}
              </View>
              <View style={[s.cIni, { padding: 4 }]}>
                <Band score={riskScore(h.likelihood, h.severity)} />
              </View>
              <View style={[s.cRes, { padding: 4 }]}>
                <Band
                  score={riskScore(h.residualLikelihood, h.residualSeverity)}
                />
              </View>
            </View>
          ))}

          {/* -------- Method statement -------- */}
          <Text style={s.sectionTitle}>2 · Method Statement</Text>
          {content.methodSteps.map((step, i) => (
            <View style={s.step} key={i} wrap={false}>
              <Text style={s.stepNo}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={s.stepText}>{step}</Text>
            </View>
          ))}

          {/* -------- Load plan -------- */}
          <Text style={s.sectionTitle}>3 · Vehicle Load Plan</Text>
          <View style={s.lpHead}>
            <Text style={s.lpMeta}>
              Vehicle: <Text style={{ fontFamily: "Helvetica-Bold" }}>{content.loadPlan.vehicle}</Text>
            </Text>
            <Text style={s.lpBar}>
              {totalLoad.toLocaleString()} / {capacity.toLocaleString()} kg ·{" "}
              <Text style={{ color: overloaded ? BAND_HEX.High : BAND_HEX.Low }}>
                {utilisation}%{overloaded ? " OVERLOADED" : ""}
              </Text>
            </Text>
          </View>
          <View style={s.tr}>
            <Text style={[s.th, { width: "52%" }]}>Item</Text>
            <Text style={[s.th, { width: "12%", textAlign: "center" }]}>Qty</Text>
            <Text style={[s.th, { width: "18%", textAlign: "right" }]}>Unit kg</Text>
            <Text style={[s.th, { width: "18%", textAlign: "right" }]}>Total kg</Text>
          </View>
          {content.loadPlan.items.map((it) => (
            <View style={s.tr} key={it.id} wrap={false}>
              <Text style={[s.td, { width: "52%" }]}>{it.description}</Text>
              <Text style={[s.td, { width: "12%", textAlign: "center" }]}>{it.quantity}</Text>
              <Text style={[s.td, { width: "18%", textAlign: "right" }]}>{it.weightKg.toLocaleString()}</Text>
              <Text style={[s.td, { width: "18%", textAlign: "right", fontFamily: "Helvetica-Bold" }]}>
                {(it.quantity * it.weightKg).toLocaleString()}
              </Text>
            </View>
          ))}
          {content.loadPlan.notes ? (
            <Text style={[s.td, { marginTop: 6, color: MUTED }]}>
              Notes: {content.loadPlan.notes}
            </Text>
          ) : null}
        </View>

        <View style={s.footer} fixed>
          <Text>
            {props.ref} · Generated by RAMSmith. Review and sign off before use —
            this document is a template aid, not legal advice.
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
