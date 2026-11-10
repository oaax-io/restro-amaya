import React from "react";
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  kind?: string;
  heading?: string;
  rows?: { label: string; value: string }[];
}

const OwnerNotification = ({ kind = "Neue Anfrage", heading, rows = [] }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>{heading ?? kind}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>AMAYA</Text>
        </Section>
        <Heading style={h1}>{heading ?? kind}</Heading>
        {rows.map((r) => (
          <Text key={r.label} style={row}>
            <strong style={{ color: "#0d2517" }}>{r.label}:</strong> {r.value}
          </Text>
        ))}
        <Text style={foot}>Details findest du im Admin unter Reservierungen.</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: OwnerNotification,
  subject: (d: Record<string, unknown>) => String(d.heading ?? d.kind ?? "Neue Anfrage – Amaya"),
  to: "reservation@amaya-restaurant.ch",
  displayName: "Benachrichtigung ans Restaurant",
  previewData: {
    kind: "Reservierung",
    heading: "Neue Reservierung: Maria Muster, 4 Personen",
    rows: [
      { label: "Datum", value: "14.11.2026, 19:30" },
      { label: "E-Mail", value: "maria@example.com" },
    ],
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Georgia, serif" };
const container = { padding: "0 0 24px", maxWidth: "560px" };
const header = { backgroundColor: "#0d2517", padding: "18px 24px" };
const brand = { color: "#E9A580", fontSize: "20px", letterSpacing: "6px", margin: 0 };
const h1 = { color: "#0d2517", fontSize: "20px", padding: "0 24px", margin: "24px 0 12px" };
const row = { color: "#333333", fontSize: "14px", padding: "0 24px", margin: "4px 0" };
const foot = { color: "#888888", fontSize: "12px", padding: "0 24px", marginTop: "20px" };
