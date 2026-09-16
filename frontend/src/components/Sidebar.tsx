const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "▦" },
  { key: "leads", label: "Leads", icon: "◎" },
  { key: "contatos", label: "Contatos", icon: "◇" },
  { key: "negocios", label: "Negócios", icon: "◈" },
  { key: "relatorios", label: "Relatórios", icon: "▤" },
  { key: "config", label: "Configurações", icon: "⚙" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">PC</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`sidebar-item ${item.key === "leads" ? "active" : ""}`}
            title={item.label}
            disabled={item.key !== "leads"}
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
