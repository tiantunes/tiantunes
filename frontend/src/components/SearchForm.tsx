import { useState } from "react";

export function SearchForm({ onSearch, loading }: { onSearch: (keyword: string, location: string) => void; loading: boolean }) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) return;
    onSearch(keyword.trim(), location.trim());
  };

  return (
    <form className="search-form" onSubmit={submit}>
      <input
        placeholder="Tipo de negócio (ex: clínicas odontológicas)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <input placeholder="Local (ex: Curitiba, PR)" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? "Buscando..." : "Captar leads"}
      </button>
    </form>
  );
}
