import React, { useEffect, useState } from "react";
import API from "../api/axios";
import TaskCard from "../components/TaskCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "", due_date: "" });
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending", priority: "medium", due_date: "" });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
  try {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.due_date) params.due_date = filters.due_date;
    const res = await API.get("/tasks/", { params });
    // Fix: map _id to id for each task
    const fixed = res.data.map((task) => ({
      ...task,
      id: task.id || task._id,
    }));
    setTasks(fixed);
  } catch (err) {
    if (err.response?.status === 401) navigate("/login");
  }
};

  // eslint-disable-next-line
  useEffect(() => { fetchTasks(); }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks/", newTask);
      setNewTask({ title: "", description: "", status: "pending", priority: "medium", due_date: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.detail || "Update failed");
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.topRow}>
          <h2 style={styles.heading}>My Tasks ({tasks.length})</h2>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        {/* Create Task Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{ marginTop: 0 }}>Create New Task</h3>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleCreate}>
              <input style={styles.input} placeholder="Title" value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
              <input style={styles.input} placeholder="Description" value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              <div style={styles.row}>
                <select style={styles.input} value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select style={styles.input} value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input style={styles.input} type="date" value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} />
              </div>
              <button style={styles.addBtn} type="submit">Create Task</button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={styles.filters}>
          <select style={styles.filterSelect} value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select style={styles.filterSelect} value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input style={styles.filterSelect} type="date" value={filters.due_date}
            onChange={(e) => setFilters({ ...filters, due_date: e.target.value })} />
          <button style={styles.clearBtn}
            onClick={() => setFilters({ status: "", priority: "", due_date: "" })}>
            Clear Filters
          </button>
        </div>

        {/* Task List */}
        {tasks.length === 0
          ? <p style={styles.empty}>No tasks found. Create one!</p>
          : tasks.map((task) => (
            <TaskCard
              key={task.id || task._id}
              task={{ ...task, id: task.id || task._id }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))
        }
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f0f2f5" },
  container: { maxWidth: "750px", margin: "0 auto", padding: "30px 20px" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  heading: { margin: 0, color: "#1f2937" },
  addBtn: { padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  formCard: { background: "#fff", padding: "24px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", marginBottom: "20px" },
  input: { width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" },
  row: { display: "flex", gap: "10px" },
  filters: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  filterSelect: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "13px" },
  clearBtn: { padding: "8px 14px", background: "#e5e7eb", border: "none", borderRadius: "6px", cursor: "pointer" },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: "40px" },
  error: { color: "red", marginBottom: "10px" },
};
