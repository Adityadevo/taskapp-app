const PRIORITY_COLORS = { low: "#4ade80", medium: "#fbbf24", high: "#f87171" };
const NEXT_STATUS = { todo: "inprogress", inprogress: "done", done: "todo" };
const NEXT_LABEL = { todo: "→ Start", inprogress: "→ Done", done: "↺ Reset" };

export default function TaskCard({ task, onDelete, onStatusChange, onEdit }) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <span style={{ ...styles.priority, color: PRIORITY_COLORS[task.priority] }}>
          ● {task.priority}
        </span>
        <div style={styles.actions}>
          <button onClick={() => onEdit(task)} style={styles.iconBtn} title="Edit">✏️</button>
          <button onClick={() => onDelete(task._id)} className="btn-danger" style={{ padding: "3px 8px", fontSize: 12 }}>✕</button>
        </div>
      </div>

      <h3 style={styles.title}>{task.title}</h3>
      {task.description && <p style={styles.desc}>{task.description}</p>}

      <div style={styles.footer}>
        <span style={styles.date}>
          {new Date(task.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
        <button
          onClick={() => onStatusChange(task._id, NEXT_STATUS[task.status])}
          style={styles.moveBtn}
        >
          {NEXT_LABEL[task.status]}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  priority: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  actions: { display: "flex", gap: 6, alignItems: "center" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "2px 4px", fontSize: 13 },
  title: { fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 },
  desc: { fontSize: 13, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  date: { fontSize: 11, color: "var(--muted)" },
  moveBtn: { background: "transparent", border: "1px solid var(--border)", color: "var(--accent)", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" },
};
