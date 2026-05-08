import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";

const STATUSES = ["todo", "inprogress", "done"];
const STATUS_LABELS = { todo: "To Do", inprogress: "In Progress", done: "Done" };
const STATUS_COLORS = { todo: "#6c63ff", inprogress: "#fbbf24", done: "#4ade80" };

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/api/tasks");
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const handleStatusChange = async (id, status) => {
    const { data } = await api.put(`/api/tasks/${id}`, { status });
    setTasks(tasks.map((t) => (t._id === id ? data : t)));
  };

  const handleSaved = (task, isEdit) => {
    if (isEdit) setTasks(tasks.map((t) => (t._id === task._id ? task : t)));
    else setTasks([task, ...tasks]);
    setShowForm(false);
    setEditTask(null);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span className="mono" style={styles.logoText}>TASKAPP</span>
          <span style={styles.dot} />
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hey, {user.name} 👋</span>
          <button className="btn-ghost" onClick={handleLogout} style={{ padding: "8px 16px", fontSize: 13 }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        {STATUSES.map((s) => (
          <div key={s} style={{ ...styles.statCard, borderTop: `3px solid ${STATUS_COLORS[s]}` }}>
            <span style={{ color: STATUS_COLORS[s], fontSize: 22, fontWeight: 700 }}>
              {tasks.filter((t) => t.status === s).length}
            </span>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{STATUS_LABELS[s]}</span>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <div style={styles.toolbar}>
        <h2 style={styles.boardTitle}>Your Board</h2>
        <button className="btn-primary" onClick={() => { setEditTask(null); setShowForm(true); }}>
          + New Task
        </button>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editTask}
          onSaved={handleSaved}
          onClose={() => { setShowForm(false); setEditTask(null); }}
        />
      )}

      {/* Kanban Board */}
      {loading ? (
        <div style={styles.loading}>Loading tasks...</div>
      ) : (
        <div style={styles.board}>
          {STATUSES.map((status) => (
            <div key={status} style={styles.column}>
              <div style={styles.columnHeader}>
                <span style={{ ...styles.columnDot, background: STATUS_COLORS[status] }} />
                <span style={styles.columnTitle}>{STATUS_LABELS[status]}</span>
                <span style={styles.columnCount}>{tasks.filter((t) => t.status === status).length}</span>
              </div>
              <div style={styles.columnBody}>
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      onEdit={(t) => { setEditTask(t); setShowForm(true); }}
                    />
                  ))}
                {tasks.filter((t) => t.status === status).length === 0 && (
                  <div style={styles.empty}>No tasks here</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontSize: 18, fontWeight: 700, color: "var(--accent)", letterSpacing: 2 },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "var(--accent2)" },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  userName: { color: "var(--muted)", fontSize: 14 },
  stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 },
  statCard: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  boardTitle: { fontSize: 20, fontWeight: 600 },
  board: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  column: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" },
  columnHeader: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 },
  columnDot: { width: 10, height: 10, borderRadius: "50%" },
  columnTitle: { fontWeight: 600, fontSize: 14, flex: 1 },
  columnCount: { background: "var(--bg2)", color: "var(--muted)", borderRadius: 20, padding: "2px 10px", fontSize: 12 },
  columnBody: { padding: 12, display: "flex", flexDirection: "column", gap: 10, minHeight: 200 },
  empty: { textAlign: "center", color: "var(--muted)", fontSize: 13, padding: "30px 0" },
  loading: { textAlign: "center", color: "var(--muted)", padding: 60 },
};
