"use client";

import { useState } from "react";

type Income = {
  id: number;
  source: string;
  description: string;
  amount: number;
  currency: "KES" | "USD";
  type: "Verified import" | "Manual" | "Estimated";
  date: string;
};

const initialIncome: Income[] = [
  { id: 1, source: "Affiliate marketing", description: "Example commission", amount: 0, currency: "USD", type: "Estimated", date: "2026-10-15" },
  { id: 2, source: "Website sales", description: "Example sale", amount: 0, currency: "KES", type: "Manual", date: "2026-10-15" },
];

const sources = [
  "Affiliate marketing",
  "Website sales",
  "Platform subscriptions",
  "Investments / trading",
];

const colors: Record<string, string> = {
  "Verified import": "#42D6A4",
  Manual: "#E3B84D",
  Estimated: "#83B5FF",
};

export default function Home() {
  const [income, setIncome] = useState<Income[]>(initialIncome);
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    source: sources[0],
    description: "",
    amount: "",
    currency: "KES" as "KES" | "USD",
    type: "Manual" as Income["type"],
    date: "2026-10-15",
  });

  const rate = 130; // Illustrative rate only; replace with a live rate later.

  function convert(item: Income) {
    if (item.currency === currency) return item.amount;
    return currency === "KES" ? item.amount * rate : item.amount / rate;
  }

  function total(type?: Income["type"]) {
    return income
      .filter((item) => !type || item.type === type)
      .reduce((sum, item) => sum + convert(item), 0);
  }

  function money(value: number) {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  }

  function addIncome(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    setIncome((old) => [
      {
        ...form,
        id: Date.now(),
        amount,
        description: form.description.trim() || form.source,
      },
      ...old,
    ]);
    setForm((old) => ({ ...old, description: "", amount: "" }));
    setShowForm(false);
  }

  const visible = income.filter(
    (item) => filter === "All" || item.type === filter
  );

  const cardStyle: React.CSSProperties = {
    background: "#111D2E",
    border: "1px solid #24344A",
    borderRadius: 14,
    padding: 20,
  };

  const buttonStyle: React.CSSProperties = {
    background: "#D4AF37",
    color: "#08111F",
    border: 0,
    borderRadius: 8,
    padding: "11px 16px",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08111F",
      color: "#F5F7FB",
      fontFamily: "Arial, sans-serif",
      padding: "28px 5%",
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 32,
      }}>
        <div>
          <p style={{ color: "#D4AF37", letterSpacing: 3, fontSize: 12 }}>
            PRIVATE BUSINESS HQ
          </p>
          <h1 style={{ fontSize: 28, margin: "8px 0" }}>
            Moha Tech Command Center
          </h1>
          <p style={{ color: "#9AABC0", margin: 0 }}>
            Your websites. Your businesses. One overview.
          </p>
        </div>
        <button style={buttonStyle} onClick={() => setShowForm(!showForm)}>
          + Record income
        </button>
      </header>

      <section style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 22,
      }}>
        <span style={{ color: "#A9B7C9" }}>Display currency</span>
        {(["KES", "USD"] as const).map((c) => (
          <button key={c} onClick={() => setCurrency(c)} style={{
            ...buttonStyle,
            background: currency === c ? "#D4AF37" : "#17263A",
            color: currency === c ? "#08111F" : "#FFFFFF",
          }}>
            {c}
          </button>
        ))}
        <span style={{ color: "#8393A9", fontSize: 12 }}>
          Conversion rate is a placeholder, not a live exchange rate.
        </span>
      </section>

      {showForm && (
        <form onSubmit={addIncome} style={{
          ...cardStyle,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}>
          <h2 style={{ gridColumn: "1 / -1", margin: 0 }}>Record income</h2>
          <label>
            Income source
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
              style={fieldStyle}>
              {sources.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>
            Description
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Website payout, subscription..." style={fieldStyle} />
          </label>
          <label>
            Amount
            <input required type="number" min="0.01" step="0.01" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00" style={fieldStyle} />
          </label>
          <label>
            Currency
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as "KES" | "USD" })}
              style={fieldStyle}>
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label>
            Record type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Income["type"] })}
              style={fieldStyle}>
              <option>Manual</option>
              <option>Estimated</option>
              <option>Verified import</option>
            </select>
          </label>
          <label>
            Date
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={fieldStyle} />
          </label>
          <button type="submit" style={buttonStyle}>Save entry</button>
        </form>
      )}

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 16,
      }}>
        <div style={cardStyle}>
          <p style={muted}>Total recorded income</p>
          <h2 style={metric}>{money(total())}</h2>
          <p style={muted}>Includes all three record types</p>
        </div>
        {(["Verified import", "Manual", "Estimated"] as const).map((type) => (
          <div key={type} style={cardStyle}>
            <p style={{ color: colors[type], fontSize: 13 }}>{type}</p>
            <h2 style={metric}>{money(total(type))}</h2>
            <p style={muted}>
              {type === "Verified import" ? "Imported provider records" :
                type === "Manual" ? "Entered by you" : "Forecasts, not confirmed cash"}
            </p>
          </div>
        ))}
      </section>

      <section style={{ ...cardStyle, marginTop: 28 }}>
        <h2 style={{ fontSize: 19 }}>Income sources</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
        }}>
          {sources.map((source) => {
            const amount = income
              .filter((item) => item.source === source)
              .reduce((sum, item) => sum + convert(item), 0);
            return (
              <div key={source} style={{
                background: "#0B1626",
                padding: 16,
                borderRadius: 10,
                border: "1px solid #24344A",
              }}>
                <p style={muted}>{source}</p>
                <strong style={{ fontSize: 20 }}>{money(amount)}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ ...cardStyle, marginTop: 28 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}>
          <h2 style={{ fontSize: 19 }}>Transaction history</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            style={{ ...fieldStyle, width: 190, marginTop: 0 }}>
            <option>All</option>
            <option>Verified import</option>
            <option>Manual</option>
            <option>Estimated</option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, textAlign: "left" }}>
            <thead>
              <tr style={{ color: "#9AABC0", fontSize: 12 }}>
                {["Source", "Description", "Date", "Type", "Amount"].map((heading) => (
                  <th key={heading} style={{ padding: "13px 10px", borderBottom: "1px solid #29384D" }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id}>
                  <td style={cell}>{item.source}</td>
                  <td style={cell}>{item.description}</td>
                  <td style={cell}>{item.date}</td>
                  <td style={cell}>
                    <span style={{ color: colors[item.type] }}>{item.type}</span>
                  </td>
                  <td style={cell}>{new Intl.NumberFormat("en", {
                    style: "currency", currency: item.currency,
                  }).format(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && <p style={muted}>No entries match this filter.</p>}
        </div>
      </section>

      <footer style={{ marginTop: 28, color: "#8595AA", fontSize: 12, lineHeight: 1.8 }}>
        <p>MOHA TECH COMMAND CENTER · PRIVATE WORKSPACE</p>
        This is a local prototype. Entries are not saved permanently and no providers
        are connected yet. Selecting “Verified import” manually does not verify a transaction.
        Real integrations, authentication, secure storage, expenses and profit calculations
        will be added in the next stages.
      </footer>
    </main>
  );
}

const muted: React.CSSProperties = {
  color: "#9AABC0",
  fontSize: 13,
  margin: "0 0 10px",
};

const metric: React.CSSProperties = {
  fontSize: 27,
  color: "#D4AF37",
  margin: "12px 0",
};

const cell: React.CSSProperties = {
  padding: "14px 10px",
  borderBottom: "1px solid #223047",
  whiteSpace: "nowrap",
};

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 8,
  padding: 11,
  borderRadius: 8,
  border: "1px solid #34445B",
  background: "#0B1626",
  color: "#F5F7FB",
};