import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* =====================
   Helpers
===================== */
function makeReference() {
  return "AOL-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function savePayment(txn) {
  const key = "aol_payments";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(txn);
  localStorage.setItem(key, JSON.stringify(existing));
}

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  /* =====================
     UI State
  ===================== */
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isPaying, setIsPaying] = useState(false);

  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("");

  /* =====================
     Fee Mapping
  ===================== */
  const feeConfig = {
    "Tuition Fee": 1200,
    "Exam Retake Fee": 49.8,
    "Uniform Fee": 150,
    "Book Fee": 220,
    "Compulsory Fee": 300,
  };

  const feeLabel = state?.fee || "Exam Retake Fee";
  const subtotal = feeConfig[feeLabel] || 49.8;

  /* =====================
     Province Tax
  ===================== */
  const taxRates = {
    ON: 0.13,
    BC: 0.12,
    AB: 0.05,
    QC: 0.14975,
    NS: 0.15,
    NB: 0.15,
    NL: 0.15,
    PE: 0.15,
    MB: 0.12,
    SK: 0.11,
  };

  const province = state?.province || "ON";
  const taxRate = taxRates[province] || 0.13;

  const tax = useMemo(() => +(subtotal * taxRate).toFixed(2), [subtotal, taxRate]);
  const total = useMemo(() => (subtotal + tax).toFixed(2), [subtotal, tax]);

  /* =====================
     Validation
  ===================== */
  const isCardValid =
    card.number.replace(/\s/g, "").length >= 16 &&
    card.expiry.length >= 4 &&
    card.cvv.length >= 3;

  const isBankValid = bank !== "";

  const isFormValid =
    (paymentMethod === "card" && isCardValid) ||
    (paymentMethod === "bank" && isBankValid);

  /* =====================
     Payment Handler
  ===================== */
  const handlePayment = () => {
    setIsPaying(true);

    const reference = makeReference();
    const success = Math.random() < 0.8; // demo: 80% success

    setTimeout(() => {
      const baseTxn = {
        createdAt: Date.now(),
        reference,
        studentName: state?.name,
        vnumber: state?.vnumber,
        program: state?.program,
        feeType: feeLabel,
        province,
        total,
        method: paymentMethod,
      };

      if (success) {
        savePayment({ ...baseTxn, status: "SUCCESS" });

        navigate("/success", {
          state: { total, fee: feeLabel, reference },
        });
      } else {
        savePayment({ ...baseTxn, status: "FAILED" });

        navigate("/failed", {
          state: {
            total,
            fee: feeLabel,
            reference,
            reason: "Bank authorization declined. Please try again.",
            original: state,
          },
        });
      }

      setIsPaying(false);
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4FBF6" }}>
      {/* GREEN BANNER */}
      <div className="py-3" style={{ backgroundColor: "#159E45" }}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-10 d-flex justify-content-between align-items-center text-white">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-white rounded-3 px-3 py-2 d-flex align-items-center"
                  style={{ lineHeight: 0 }}
                >
                  <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                      height: 34,      // ✅ controls alignment
                      width: "auto",
                      display: "block"
                    }}
                  />
                </div>

                <div className="text-white">
                  <div className="fw-bold" style={{ fontSize: 18, lineHeight: 1.1 }}>
                    Secure Payment
                  </div>
                </div>
              </div>
              <div className="opacity-75">Step 2 of 2</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="row g-4">

              {/* LEFT – PAYMENT */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4 p-md-5">

                    <h3 className="fw-bold mb-3" style={{ color: "#146C43" }}>
                      Payment Details
                    </h3>

                    {/* Method */}
                    <div className="mb-4">
                      <label className="fw-semibold d-block mb-2">Pay With</label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                          />
                          <label className="form-check-label">Card</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            checked={paymentMethod === "bank"}
                            onChange={() => setPaymentMethod("bank")}
                          />
                          <label className="form-check-label">Bank</label>
                        </div>
                      </div>
                    </div>

                    {/* Card Fields */}
                    {paymentMethod === "card" && (
                      <>
                        <input
                          className="form-control mb-3"
                          placeholder="Card Number"
                          value={card.number}
                          onChange={(e) =>
                            setCard({ ...card, number: e.target.value })
                          }
                        />
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <input
                              className="form-control"
                              placeholder="MM/YY"
                              value={card.expiry}
                              onChange={(e) =>
                                setCard({ ...card, expiry: e.target.value })
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <input
                              className="form-control"
                              placeholder="CVV"
                              value={card.cvv}
                              onChange={(e) =>
                                setCard({ ...card, cvv: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Bank Fields */}
                    {paymentMethod === "bank" && (
                      <select
                        className="form-select mb-4"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                      >
                        <option value="">Select Bank</option>
                        <option>RBC</option>
                        <option>TD</option>
                        <option>Scotiabank</option>
                        <option>BMO</option>
                        <option>CIBC</option>
                      </select>
                    )}

                    {/* PAY BUTTON */}
                    <button
                      className="btn w-100 py-3"
                      disabled={!isFormValid || isPaying}
                      onClick={handlePayment}
                      style={{
                        backgroundColor: isFormValid ? "#F37021" : "#f8c8a8",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "8px",
                      }}
                    >
                      {isPaying ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        `Pay CAD ${total}`
                      )}
                    </button>

                  </div>
                </div>
              </div>

              {/* RIGHT – SUMMARY */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4 p-md-5">

                    <h4 className="fw-bold mb-3" style={{ color: "#146C43" }}>
                      Payment Summary
                    </h4>

                    <div className="d-flex justify-content-between mb-2">
                      <span>{feeLabel}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax ({(taxRate * 100).toFixed(2)}%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <strong>Total</strong>
                      <strong>${total}</strong>
                    </div>

                    <div className="text-muted small mt-2">
                      Province: {province}
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
