export function Topbar({
  query,
  onQueryChange,
  onNewSearch,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onNewSearch: () => void;
}) {
  return (
    <header className="topbar">
      <input
        className="topbar-search"
        placeholder="Buscar leads por nome, categoria ou cidade..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button className="btn-primary" onClick={onNewSearch}>
        + Novo
      </button>
    </header>
  );
}
