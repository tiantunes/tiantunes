export type View = "dashboard" | "leads" | "reports" | "settings";

const NAV_ITEMS: { key: View; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "▦" },
  { key: "leads", label: "Leads", icon: "◎" },
  { key: "reports", label: "Relatórios", icon: "▤" },
  { key: "settings", label: "Configurações", icon: "⚙" },
];

export function Sidebar({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">PC</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`sidebar-item ${item.key === view ? "active" : ""}`}
            title={item.label}
            onClick={() => onNavigate(item.key)}
          >
            <span className="sidebar-icon" aria-hidden="true">
              {item.icon}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
