import { useEffect, useMemo, useState } from "react";
import type { Lead, FunnelStage } from "./types";
import { fetchLeads, updateLeadStage, searchLeads } from "./api";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { KanbanBoard } from "./components/KanbanBoard";
import { ProspectingModal } from "./components/ProspectingModal";
import { LeadDetail } from "./components/LeadDetail";
import "./styles.css";

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const loadLeads = () => {
    fetchLeads()
      .then(setLeads)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.category ?? "").toLowerCase().includes(q) ||
        (l.address ?? "").toLowerCase().includes(q) ||
        l.searchLocation.toLowerCase().includes(q),
    );
  }, [leads, query]);

  const handleMoveLead = async (id: string, stage: FunnelStage) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    try {
      await updateLeadStage(id, stage);
    } catch (e) {
      setError((e as Error).message);
      loadLeads();
    }
  };

  const handleSearch = async (keyword: string, location: string) => {
    setSearchLoading(true);
    setSearchResult(null);
    setError(null);
    try {
      const { count } = await searchLeads(keyword, location);
      setSearchResult(count > 0 ? `${count} leads captados com sucesso.` : "Nenhum lead encontrado para essa busca.");
      loadLeads();
    } catch (e) {
      setSearchResult((e as Error).message);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar query={query} onQueryChange={setQuery} onNewSearch={() => setModalOpen(true)} />
        <div className="app-content">
          {error && <div className="error-banner">{error}</div>}
          {selectedLeadId ? (
            <LeadDetail leadId={selectedLeadId} onBack={() => setSelectedLeadId(null)} onStageChange={handleMoveLead} />
          ) : (
            <KanbanBoard leads={filteredLeads} onMoveLead={handleMoveLead} onOpenLead={setSelectedLeadId} />
          )}
        </div>
      </div>
      <ProspectingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSearchResult(null);
        }}
        onSearch={handleSearch}
        loading={searchLoading}
        resultMessage={searchResult}
      />
    </div>
  );
}
