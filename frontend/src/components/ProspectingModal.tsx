import { SearchForm } from "./SearchForm";

export function ProspectingModal({
  open,
  onClose,
  onSearch,
  loading,
  resultMessage,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: (keyword: string, location: string) => void;
  loading: boolean;
  resultMessage: string | null;
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Captar novos leads</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <p className="modal-subtitle">
          Digite um tipo de negócio e uma localização. O sistema busca no Google Maps e classifica cada lead
          automaticamente.
        </p>
        <SearchForm onSearch={onSearch} loading={loading} />
        {resultMessage && <div className="modal-result">{resultMessage}</div>}
      </div>
    </div>
  );
}
