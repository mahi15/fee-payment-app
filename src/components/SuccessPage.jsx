import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { generateInvoice } from "../utils/invoiceGenerator";


export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const total = state?.total || "0.00";
  const reference = Math.floor(100000 + Math.random() * 900000);

  /* ================= CONFETTI ================= */
  useEffect(() => {
    const end = Date.now() + 1200;

    const frame = () => {
      confetti({
        particleCount: 5,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#159E45", "#4FB6C8", "#F37021"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);


  return (
    <div
      className="d-flex justify-content-center align-items-center position-relative overflow-hidden"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F4FBF6",
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(21,158,69,0.18), transparent 60%)",
          top: "-220px",
          right: "-220px",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(79,182,200,0.14), transparent 60%)",
          bottom: "-200px",
          left: "-200px",
          zIndex: 0,
        }}
      />

      {/* SUCCESS CARD */}
      <div
        className="card shadow-lg p-5 text-center position-relative"
        style={{
          maxWidth: "500px",
          borderRadius: "20px",
          zIndex: 1,
          backgroundColor: "#fff",
        }}
      >
        {/* Animated check */}
        <div
          className="rounded-circle mb-4 d-flex justify-content-center align-items-center"
          style={{
            width: "95px",
            height: "95px",
            margin: "0 auto",
            backgroundColor: "#159E45",
            animation: "pop 0.6s ease-out",
          }}
        >
          <i
            className="bi bi-check-lg text-white"
            style={{ fontSize: "50px" }}
          />
        </div>

        <h2 className="fw-bold">Payment Successful!</h2>
        <p className="text-muted mb-1">Thank you for your payment.</p>

        <h4 className="fw-bold mt-3" style={{ color: "#159E45" }}>
          CAD {total}
        </h4>

        <p className="text-muted mt-2">
          Reference #: <strong>{reference}</strong>
        </p>

        {/* ACTIONS */}
        <button
          className="btn w-100 mt-3"
          style={{ backgroundColor: "#4FB6C8", color: "#fff", fontWeight: 600 }}
          onClick={() =>
            generateInvoice({
              reference,
              studentName: state?.name,
              vnumber: state?.vnumber,
              program: state?.program,
              feeType: state?.fee,
              total,
            })
          }
        >
          Download Invoice PDF
        </button>


        <button
          className="btn w-100 mt-3"
          style={{
            backgroundColor: "#F37021",
            color: "#fff",
            fontWeight: 600,
          }}
          onClick={() => navigate("/")}
        >
          Make a new payment
        </button>
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
