import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#F4FBF6" }}
    >
      <div className="card shadow-sm border-0 p-5 text-center" style={{ maxWidth: 520 }}>
        <div
          className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
          style={{ width: 90, height: 90, backgroundColor: "#F37021" }} // orange
        >
          <span style={{ fontSize: 48, color: "#fff", fontWeight: 800 }}>!</span>
        </div>

        <h2 className="fw-bold" style={{ color: "#146C43" }}>Payment Failed</h2>
        <p className="text-muted mt-2">
          {state?.reason || "We couldn’t process your payment. Please try again."}
        </p>

        <div className="text-start mt-4">
          <div className="small text-muted">Reference</div>
          <div className="fw-semibold">{state?.reference || "-"}</div>

          <div className="small text-muted mt-3">Amount</div>
          <div className="fw-semibold">CAD {state?.total || "-"}</div>
        </div>

        <div className="d-grid gap-2 mt-4">
          <button className="btn btn-success py-2" onClick={() => navigate("/payment", { state: state?.original })}>
            Retry Payment
          </button>

          <button className="btn btn-outline-secondary py-2" onClick={() => navigate("/")}>
            Back to Fee Form
          </button>
        </div>
      </div>
    </div>
  );
}
