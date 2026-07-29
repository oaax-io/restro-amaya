import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { LoungeTiersEditor } from "@/components/admin/TierEditor";
import { CorporateMembershipEditor } from "@/components/admin/CorporateMembershipEditor";

export const Route = createFileRoute("/_authenticated/admin/members")({
  component: MembersAdmin,
});

function MembersAdmin() {
  return (
    <div>
      <PageHeader
        title="Cigar Lounge Members"
        subtitle="Mitgliedschaften konfigurieren. Eingehende Anträge findest du unter „Anfragen“."
      />

      <div className="mt-8">
        <h2 className="font-display text-2xl text-[#0D2517] mb-4">Mitgliedschaften konfigurieren</h2>
        <p className="text-sm text-black/60 mb-4">Name, Preis, Badge und Vorteile für Solo &amp; Elite jederzeit anpassen.</p>
        <LoungeTiersEditor />

        <div className="mt-8">
          <h3 className="font-display text-xl text-[#0D2517] mb-2">Corporate Mitgliedschaft</h3>
          <p className="text-sm text-black/60 mb-4">
            Alle Corporate-Pläne, Vorteile und Bedingungen anpassen — die Änderungen erscheinen direkt auf der Lounge-Seite.
          </p>
          <CorporateMembershipEditor />
        </div>
      </div>
    </div>
  );
}
