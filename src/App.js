import { useState } from "react";

const FORMSPREE_URL = "https://formspree.io/f/mzdodvzj";

const COLOR_OPTIONS = [
  { label: "Ocean Blue", value: "ocean-blue", hex: "#2563EB" },
  { label: "Forest Green", value: "forest-green", hex: "#16A34A" },
  { label: "Royal Purple", value: "royal-purple", hex: "#7C3AED" },
  { label: "Sunset Orange", value: "sunset-orange", hex: "#EA580C" },
  { label: "Rose Pink", value: "rose-pink", hex: "#DB2777" },
  { label: "Slate Gray", value: "slate-gray", hex: "#475569" },
  { label: "Golden Yellow", value: "golden-yellow", hex: "#D97706" },
  { label: "Crimson Red", value: "crimson-red", hex: "#DC2626" },
];

const steps = ["Business Info", "Contact Details", "Branding & Links"];

const initialForm = {
  businessName: "",
  aboutService: "",
  services: "",
  colorTheme: "",
  hasLogo: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  instagram: "",
  facebook: "",
};

// ---- Dark theme palette (matches Rojar's Studio site) ----
const ACCENT = "#22E6A8";        // bright mint/green accent
const ACCENT_DIM = "#1B8F6B";    // muted green (completed states)
const PAGE_BG = "linear-gradient(135deg, #0A0E1A 0%, #0D1526 50%, #0B1420 100%)";
const CARD_BG = "#111827";
const CARD_BORDER = "rgba(255,255,255,0.08)";
const INPUT_BG = "#0B1120";
const INPUT_BORDER = "rgba(255,255,255,0.12)";
const TEXT_PRIMARY = "#F1F5F9";
const TEXT_SECONDARY = "#94A3B8";
const TEXT_MUTED = "#64748B";

function StepIndicator({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", width: "100%", boxSizing: "border-box" }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < current ? ACCENT_DIM : i === current ? ACCENT : "#1A2233",
              border: i === current ? `2.5px solid ${ACCENT}` : "2px solid " + (i < current ? ACCENT_DIM : "#2A3448"),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 600, fontSize: 13,
              color: i <= current ? "#06110D" : TEXT_MUTED,
              transition: "all 0.3s",
              flexShrink: 0,
            }}>
              {i < current ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : i + 1}
            </div>
            <span style={{ fontSize: 10, fontWeight: i === current ? 600 : 400, color: i === current ? ACCENT : TEXT_MUTED, whiteSpace: "nowrap", maxWidth: 70, textAlign: "center" }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? ACCENT : "#2A3448", margin: "0 6px", marginBottom: 22, transition: "background 0.3s", minWidth: 16 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontWeight: 500, fontSize: 14, color: TEXT_PRIMARY, marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#F87171" }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 14px",
  borderRadius: 10, border: `1.5px solid ${INPUT_BORDER}`,
  fontSize: 15, outline: "none", background: INPUT_BG, color: TEXT_PRIMARY,
  fontFamily: "inherit", transition: "border-color 0.2s",
};

function Input({ value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ ...inputStyle, borderColor: focused ? ACCENT : INPUT_BORDER }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ ...inputStyle, resize: "vertical", borderColor: focused ? ACCENT : INPUT_BORDER }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    />
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.businessName.trim()) return "Business name is required.";
      if (!form.aboutService.trim()) return "About your service is required.";
      if (!form.services.trim()) return "Services offered is required.";
    }
    if (step === 1) {
      if (!form.email.trim()) return "Email is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) return "Please enter a valid email address.";
      if (!form.phone.trim()) return "Phone number is required.";
      const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
      if (!phoneRegex.test(form.phone.trim())) return "Please enter a valid phone number.";
      if (form.whatsapp.trim() && !phoneRegex.test(form.whatsapp.trim())) return "Please enter a valid WhatsApp number.";
      if (!form.address.trim()) return "Address is required.";
    }
    if (step === 2) {
      if (!form.colorTheme) return "Please select a colour theme.";
      if (!form.hasLogo) return "Please indicate if you have a logo.";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const prev = () => { setError(""); setStep((s) => s - 1); };

  const submit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);

    const selectedColor = COLOR_OPTIONS.find((c) => c.value === form.colorTheme);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          "Business Name": form.businessName,
          "About Service": form.aboutService,
          "Services": form.services,
          "Colour Theme": selectedColor ? selectedColor.label : form.colorTheme,
          "Has Logo": form.hasLogo,
          "email": form.email,
          "Phone": form.phone,
          "WhatsApp": form.whatsapp,
          "Address": form.address,
          "Instagram": form.instagram,
          "Facebook": form.facebook,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong. Please try again or contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: PAGE_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: CARD_BG, borderRadius: 20, padding: "3rem 2.5rem", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "0 4px 32px rgba(0,0,0,0.5)", border: `1px solid ${CARD_BORDER}` }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,230,168,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: ACCENT, margin: "0 0 0.75rem" }}>You're all set!</h2>
          <p style={{ color: TEXT_SECONDARY, fontSize: 15, lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            Thanks, <strong style={{ color: TEXT_PRIMARY }}>{form.businessName}</strong>! We've received your details and will start building your website shortly. We'll reach out to you at <strong style={{ color: TEXT_PRIMARY }}>{form.email}</strong>.
          </p>
          <div style={{ background: "rgba(34,230,168,0.06)", border: "1px solid rgba(34,230,168,0.25)", borderRadius: 10, padding: "1rem 1.25rem", textAlign: "left" }}>
            <p style={{ fontSize: 13, color: ACCENT, margin: 0, fontWeight: 500 }}>What happens next?</p>
            <ul style={{ margin: "0.5rem 0 0", paddingLeft: 18, fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.8 }}>
              <li>Our team reviews your details</li>
              <li>We begin your website design</li>
              <li>You'll get a preview in 3–5 business days</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(90deg, #1DE9B6, #7C3AED)", color: "#06110D", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Client Onboarding
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Let's build your website</h1>
          <p style={{ color: TEXT_SECONDARY, fontSize: 15, margin: 0 }}>Fill in your details — takes about 3 minutes</p>
        </div>

        {/* Card */}
        <div style={{ background: CARD_BG, borderRadius: 20, padding: "2rem 2rem 1.75rem", boxShadow: "0 4px 32px rgba(0,0,0,0.5)", border: `1px solid ${CARD_BORDER}` }}>
          <StepIndicator current={step} />

          {/* Step 0 */}
          {step === 0 && (
            <div>
              <Field label="Business Name" required>
                <Input value={form.businessName} onChange={set("businessName")} placeholder="e.g. Nexora Technologies" />
              </Field>
              <Field label="About Your Service" required hint="Describe what your business does in 2–3 sentences.">
                <Textarea value={form.aboutService} onChange={set("aboutService")} placeholder="We provide end-to-end digital solutions including web development, branding, and marketing for SMEs..." rows={4} />
              </Field>
              <Field label="Services Offered" required hint="List your main services, separated by commas.">
                <Textarea value={form.services} onChange={set("services")} placeholder="Web Design, SEO Optimization, Brand Identity, Social Media Management..." rows={3} />
              </Field>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <Field label="Email Address" required>
                <Input type="email" value={form.email} onChange={set("email")} placeholder="hello@yourbusiness.com" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Phone Number" required>
                  <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
                </Field>
                <Field label="WhatsApp Number">
                  <Input type="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="+91 98765 43210" />
                </Field>
              </div>
              <Field label="Business Address" required>
                <Textarea value={form.address} onChange={set("address")} placeholder="123, Anna Salai, Chennai, Tamil Nadu 600002" rows={3} />
              </Field>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <Field label="Colour Theme" required hint="Pick the primary colour for your website.">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {COLOR_OPTIONS.map((c) => (
                    <div
                      key={c.value}
                      onClick={() => setForm((f) => ({ ...f, colorTheme: c.value }))}
                      style={{
                        border: form.colorTheme === c.value ? `2.5px solid ${c.hex}` : `1.5px solid ${INPUT_BORDER}`,
                        borderRadius: 12, padding: "10px 8px", cursor: "pointer",
                        textAlign: "center", transition: "all 0.2s",
                        background: form.colorTheme === c.value ? c.hex + "1A" : INPUT_BG,
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.hex, margin: "0 auto 6px" }} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: form.colorTheme === c.value ? c.hex : TEXT_SECONDARY }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Do you have a logo?" required>
                <div style={{ display: "flex", gap: 12 }}>
                  {["Yes, I have a logo", "No, I need one"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => setForm((f) => ({ ...f, hasLogo: opt }))}
                      style={{
                        flex: 1, padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                        border: form.hasLogo === opt ? `2px solid ${ACCENT}` : `1.5px solid ${INPUT_BORDER}`,
                        background: form.hasLogo === opt ? "rgba(34,230,168,0.10)" : INPUT_BG,
                        textAlign: "center", fontSize: 14, fontWeight: 500,
                        color: form.hasLogo === opt ? ACCENT : TEXT_SECONDARY,
                        transition: "all 0.2s",
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Instagram Profile URL">
                <Input value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/yourbusiness" />
              </Field>
              <Field label="Facebook Page URL">
                <Input value={form.facebook} onChange={set("facebook")} placeholder="https://facebook.com/yourbusiness" />
              </Field>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(248,113,113,0.35)", borderRadius: 10, padding: "10px 14px", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ fontSize: 13, color: "#F87171" }}>{error}</span>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: "0.5rem" }}>
            {step > 0 && (
              <button
                onClick={prev}
                style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${INPUT_BORDER}`, background: "transparent", fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, cursor: "pointer" }}
              >
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button
                onClick={next}
                style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #1DE9B6, #17C99A)", color: "#06110D", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", background: submitting ? "#1B4A3D" : "linear-gradient(90deg, #1DE9B6, #17C99A)", color: submitting ? "#7FBFA9" : "#06110D", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting ? "Submitting..." : "Submit & Get Started 🚀"}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: TEXT_MUTED, marginTop: 16 }}>
          Your information is secure and used only to build your website.
        </p>
      </div>
    </div>
  );
}
