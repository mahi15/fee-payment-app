import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import banner from "../assets/banner.png";
import mainlogo from "../assets/mainLogo.png";

export default function FeeForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    vnumber: "",
    program: "",
    fee: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment", { state: form });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F4FBF6, #E6F6FA)",
      }}
    >
      {/* TOP BANNER */}
      <div
        className="py-3"
        style={{
          backgroundColor: "#159E45", // ✅ Solid brand green
        }}
      >
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-10 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-white rounded-3 px-3 py-2 d-flex align-items-center"
                  style={{ lineHeight: 0 }}
                >
                  <img
                    src={logo}
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
                    Fee Payment Portal
                  </div>
                </div>
              </div>


              <div className="text-white d-none d-md-block">
                <span className="opacity-75 me-2">Step 1 of 2</span>
                <span className="fw-bold">Fee Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-xl-10">

            <div className="row justify-content-center">
              <div className="col-lg-10">

                <div className="card shadow-sm border-0 overflow-hidden">
                  <div className="row g-0">

                    {/* LEFT FORM */}
                    <div className="col-md-6 p-4 p-md-5 bg-white">

                      <div className="mb-4">
                        <img src={mainlogo} alt="" />
                        <hr />
                        <h3 className="fw-bold mb-1 text-center" style={{ color: "#146C43" }}>
                          Fee Payment
                        </h3>
                      </div>

                      <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Student Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="John Doe"
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Student Vnumber</label>
                          <input
                            type="text"
                            name="vnumber"
                            className="form-control"
                            placeholder="0123456789"
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Program Name</label>
                          <input
                            type="text"
                            name="program"
                            className="form-control"
                            placeholder="Conference and Event Planner v25.1"
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold">Choose Fee</label>
                          <select
                            name="fee"
                            className="form-select"
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Fee</option>
                            <option value="Tuition Fee">Tuition Fee</option>
                            <option value="Exam Retake Fee">Exam Retake Fee</option>
                            <option value="Uniform Fee">Uniform Fee</option>
                            <option value="Book Fee">Book Fee</option>
                            <option value="Compulsory Fee">Compulsory Fee</option>
                          </select>
                        </div>

                        {/* ORANGE CTA */}
                        <button
                          className="btn w-100 py-3"
                          style={{
                            backgroundColor: "#F37021",
                            color: "#fff",
                            fontWeight: 600,
                            borderRadius: "8px",
                          }}
                        >
                          Continue to Payment
                        </button>
                      </form>

                      {/* <p className="text-muted small mt-3 mb-0">
                        Your personal data will be used to process your order and support your experience.
                      </p> */}
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="col-md-6 d-none d-md-block">
                      <img
                        src={banner}
                        alt="Banner"
                        className="img-fluid h-100"
                        style={{ objectFit: "cover" }}
                      />
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
