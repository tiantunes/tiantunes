import { useEffect, useState } from "react";
import type { Lead, FunnelStage } from "./types";
import { fetchLeads, updateLeadStage, searchLeads } from "./api";
import { KanbanBoard } from "./components/KanbanBoard";
import { SearchForm } from "./components/SearchForm";
import "./styles.css";

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = () => {
    fetchLeads()
      .then(setLeads)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    loadLeads();
  }, []);

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
    setLoading(true);
    setError(null);
    try {
      await searchLeads(keyword, location);
      loadLeads();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Prospecção &amp; Captação de Clientes</h1>
        <SearchForm onSearch={handleSearch} loading={loading} />
      </header>
      {error && <div className="error-banner">{error}</div>}
      <KanbanBoard leads={leads} onMoveLead={handleMoveLead} />
    </div>
  );
}
