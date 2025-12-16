import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const STORAGE_KEY = "aol_payments";

function loadPayments() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function savePayments(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [activeView, setActiveView] = useState("DASHBOARD");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setPayments(loadPayments());
  }, []);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const success = payments.filter(p => p.status === "SUCCESS");
    const failed = payments.filter(p => p.status === "FAILED");
    const refunded = payments.filter(p => p.status === "REFUNDED");

    return {
      success: success.length,
      failed: failed.length,
      refunded: refunded.length,
      revenue: success.reduce((s, p) => s + Number(p.total || 0), 0),
    };
  }, [payments]);

  const totalCount = stats.success + stats.failed + stats.refunded;

  /* ================= FILTERED LIST ================= */
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (filter !== "ALL" && p.status !== filter) return false;

      const q = search.toLowerCase();
      return (
        !q ||
        [p.studentName, p.vnumber, p.program, p.feeType, p.reference]
          .filter(Boolean)
          .some(v => v.toLowerCase().includes(q))
      );
    });
  }, [payments, search, filter]);

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    const csv = Papa.unparse(filteredPayments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "payments.csv";
    link.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredPayments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
  };

  /* ================= REFUND ================= */
  const refundPayment = (reference) => {
    const updated = payments.map(p =>
      p.reference === reference
        ? { ...p, status: "REFUNDED", refundedAt: Date.now() }
        : p
    );
    savePayments(updated);
    setPayments(updated);
  };

  /* ================= PIE CHART ================= */
  const chartData = {
    labels: ["Success", "Failed", "Refunded"],
    datasets: [
      {
        data: [stats.success, stats.failed, stats.refunded],
        backgroundColor: ["#159E45", "#F37021", "#4FB6C8"],
        hoverOffset: 12,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 900,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
        formatter: (value) =>
          totalCount ? `${((value / totalCount) * 100).toFixed(1)}%` : "0%",
      },
    },
    onClick: (_evt, elements) => {
      if (!elements.length) return;
      const index = elements[0].index;
      const map = ["SUCCESS", "FAILED", "REFUNDED"];
      setActiveView("PAYMENTS");
      setFilter(map[index]);
    },
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#F4FBF6" }}>

      {/* SIDENAV */}
      <aside style={{ width: 280, backgroundColor: "#159E45" }} className="text-white d-flex flex-column">
        <div className="p-4 border-bottom border-light">
          <div className="fw-bold fs-5">Payment Management</div>
          <div className="small opacity-75"></div>
        </div>

        <div className="p-3 flex-grow-1">
          <NavItem label="Dashboard" active={activeView === "DASHBOARD"} onClick={() => setActiveView("DASHBOARD")} />
          <NavItem label="All Payments" active={activeView === "PAYMENTS"} onClick={() => setActiveView("PAYMENTS")} />
        </div>

        <div className="p-3 border-top border-light">
          <button className="btn btn-outline-light w-100" onClick={() => navigate("/")}>
            ← Back to App
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-grow-1 p-4">

        {/* DASHBOARD */}
        {activeView === "DASHBOARD" && (
          <>
            <h2 className="fw-bold mb-3" style={{ color: "#146C43" }}>
              Payment Overview
            </h2>

            <div className="row g-3 mb-4">
              <Stat label="Success" value={stats.success} />
              <Stat label="Failed" value={stats.failed} />
              <Stat label="Refunded" value={stats.refunded} />
              <Stat label="Revenue (CAD)" value={stats.revenue.toFixed(2)} />
            </div>

            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold text-center mb-3">
                Payment Status Distribution
              </h5>
              <div style={{ maxWidth: 420, margin: "0 auto" }}>
                <Pie data={chartData} options={chartOptions} />
              </div>
              <p className="text-muted small text-center mt-3 mb-0">
                Click a slice to view filtered payments
              </p>
            </div>
          </>
        )}

        {/* PAYMENTS */}
        {activeView === "PAYMENTS" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold" style={{ color: "#146C43" }}>
                All Payments
              </h3>

              <div className="d-flex gap-2">
                <button className="btn" style={{ backgroundColor: "#4FB6C8", color: "#fff" }} onClick={exportCSV}>
                  Export CSV
                </button>
                <button className="btn" style={{ backgroundColor: "#F37021", color: "#fff" }} onClick={exportExcel}>
                  Export Excel
                </button>
              </div>
            </div>

            <div className="d-flex gap-3 mb-3">
              <input
                className="form-control"
                placeholder="Search payments"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 300 }}
              />

              <select
                className="form-select"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ maxWidth: 200 }}
              >
                <option value="ALL">All</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Fee</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(p => (
                      <tr key={p.reference}>
                        <td className="text-muted small">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                        <td>{p.studentName}</td>
                        <td>{p.feeType}</td>
                        <td>CAD {p.total}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background:
                                p.status === "SUCCESS"
                                  ? "#159E45"
                                  : p.status === "FAILED"
                                    ? "#F37021"
                                    : "#4FB6C8",
                              color: "#fff",
                            }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>
                          {p.status === "SUCCESS" && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => refundPayment(p.reference)}
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

/* ===== UI COMPONENTS ===== */

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn w-100 text-start mb-2"
      style={{
        backgroundColor: active ? "#4FB6C8" : "transparent",
        color: "#fff",
        fontWeight: active ? 600 : 400,
        borderRadius: 8,
        padding: "10px 14px",
      }}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="col-md-3">
      <div className="card border-0 shadow-sm p-3">
        <div className="text-muted small">{label}</div>
        <div className="fw-bold fs-4">{value}</div>
      </div>
    </div>
  );
}

