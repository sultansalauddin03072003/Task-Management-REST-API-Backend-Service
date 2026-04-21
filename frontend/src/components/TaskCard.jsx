import React from "react";

const priorityColors = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const statusColors = { pending: "#6b7280", in_progress: "#3b82f6", completed: "#10b981" };

export default function TaskCard({ task, onDelete, onStatusChange }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{task.title}</h3>
        <span style={{ ...styles.badge, background: priorityColors[task.priority] || "#888" }}>
          {task.priority}
        </span>
      </div>
      <p style={styles.desc}>{task.description || "No description"}</p>
      <div style={styles.row}>
        <span style={{ ...styles.status, background: statusColors[task.status] || "#888" }}>
          {task.status}
        </span>
        {task.due_date && <span style={styles.date}>📅 {task.due_date}</span>}
      </div>
      <div style={styles.actions}>
        <select
          style={styles.select}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button style={styles.deleteBtn} onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: "#fff", borderRadius: "10px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", marginBottom: "14px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  title: { margin: 0, fontSize: "16px", color: "#1f2937" },
  badge: { padding: "3px 10px", borderRadius: "20px", color: "#fff", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" },
  desc: { color: "#6b7280", fontSize: "13px", marginBottom: "10px" },
  row: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" },
  status: { padding: "3px 10px", borderRadius: "20px", color: "#fff", fontSize: "11px" },
  date: { fontSize: "12px", color: "#9ca3af" },
  actions: { display: "flex", gap: "10px" },
  select: { flex: 1, padding: "6px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" },
  deleteBtn: { padding: "6px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
};
