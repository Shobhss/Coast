import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════
// COAST ACCOUNT INTELLIGENCE AGENT
// Proof of Concept - Multi-source Account Context
// ═══════════════════════════════════════════════════

// ── SAMPLE DATASETS (embedded) ──────────────────────
const CRM_DATA = [{"account_id":"COAST-4821","company_name":"Meridian Freight Solutions","ein":"82-4917263","industry":"Long-haul freight","hq_address":"2840 Peachtree Industrial Blvd, Atlanta, GA 30341","fleet_size":47,"active_drivers":52,"active_cards":49,"credit_line":185000,"current_balance":71200,"utilization_pct":38.5,"monthly_spend_avg":62400,"onboarded_date":"2024-08-14","account_status":"Active","tier":"Growth","account_manager":"Rachel Kim","days_past_due":0,"consecutive_on_time_payments":7,"owner_name":"Mike Davis","years_in_business":11,"annual_revenue_est":8200000,"source":"Trade Show - MATS 2024","integrations":["QuickBooks Online","Fleetio"],"notes":"Strong growth trajectory. Expanding Southeast routes. Potential enterprise tier candidate."},{"account_id":"COAST-5192","company_name":"QuickHaul Logistics Inc","ein":"91-3847261","industry":"Regional delivery","hq_address":"1847 McCarter Hwy, Newark, NJ 07104","fleet_size":12,"active_drivers":14,"active_cards":18,"credit_line":45000,"current_balance":31800,"utilization_pct":70.7,"monthly_spend_avg":18200,"onboarded_date":"2025-01-22","account_status":"Active - Under Review","tier":"Standard","account_manager":"James Ortiz","days_past_due":0,"consecutive_on_time_payments":1,"owner_name":"Raj Patel","years_in_business":1.5,"annual_revenue_est":1400000,"source":"Inbound - Google Ads","integrations":[],"notes":"New account. Multiple anomalies flagged. Under active review by risk team."},{"account_id":"COAST-2104","company_name":"Greenfield Transport Co","ein":"45-7382910","industry":"Refrigerated freight","hq_address":"5500 LBJ Freeway, Suite 400, Dallas, TX 75240","fleet_size":120,"active_drivers":145,"active_cards":142,"credit_line":520000,"current_balance":212500,"utilization_pct":40.9,"monthly_spend_avg":198000,"onboarded_date":"2023-11-02","account_status":"Active","tier":"Enterprise","account_manager":"Rachel Kim","days_past_due":0,"consecutive_on_time_payments":16,"owner_name":"Tom Greenfield","years_in_business":22,"annual_revenue_est":34000000,"source":"Enterprise Sales - Visa Fleet Program","integrations":["QuickBooks Online","Fleetio","WhipAround","Sage Intacct"],"notes":"Top 10 account. CFO Linda Park primary contact. Acquiring Midwest Carriers (~30 trucks)."},{"account_id":"COAST-6743","company_name":"Patriot Plumbing & HVAC","ein":"27-5918340","industry":"HVAC & Plumbing services","hq_address":"980 Industrial Park Dr, Marietta, GA 30062","fleet_size":28,"active_drivers":31,"active_cards":35,"credit_line":95000,"current_balance":42100,"utilization_pct":44.3,"monthly_spend_avg":38500,"onboarded_date":"2024-03-11","account_status":"Active","tier":"Growth","account_manager":"James Ortiz","days_past_due":0,"consecutive_on_time_payments":12,"owner_name":"Dave Kowalski","years_in_business":15,"annual_revenue_est":5600000,"source":"Referral - BuildOps Partnership","integrations":["BuildOps","QuickBooks Desktop"],"notes":"Excellent field service account. Uses Coast for fuel and job supplies."},{"account_id":"COAST-7291","company_name":"Apex Solar Installations","ein":"68-2019475","industry":"Solar installation","hq_address":"4200 N Mesa St, El Paso, TX 79902","fleet_size":8,"active_drivers":10,"active_cards":10,"credit_line":30000,"current_balance":4200,"utilization_pct":14.0,"monthly_spend_avg":8900,"onboarded_date":"2025-02-03","account_status":"Active - Activation Pending","tier":"Standard","account_manager":"James Ortiz","days_past_due":0,"consecutive_on_time_payments":1,"owner_name":"Carlos Reyes","years_in_business":4,"annual_revenue_est":2100000,"source":"Inbound - Website","integrations":[],"notes":"Low activation. Only 3 of 10 cards used. Activation follow-up needed."}];

const CALL_DATA = [{"call_id":"CALL-20250307-4821","account_id":"COAST-4821","date":"2025-03-07","duration_min":18,"rep":"Rachel Kim","contact":"Mike Davis (Owner)","direction":"Inbound","sentiment":"Mixed","summary":"Mike called requesting credit line increase from $185K to $250K. Fleet expanding with 8 new trucks. Mentioned WEX offering lower fees. Frustrated with line increase turnaround time but loves fuel discount network.","tags":["line_increase","competitor_mention","expansion"]},{"call_id":"CALL-20250218-4821","account_id":"COAST-4821","date":"2025-02-18","duration_min":12,"rep":"James Ortiz","contact":"Mike Davis (Owner)","direction":"Outbound","sentiment":"Positive","summary":"Routine check-in. 3 new drivers added. No complaints. Asked about EV fleet support. Bidding on USPS contract that could double fleet to ~100 trucks.","tags":["check_in","growth_signal","ev_interest"]},{"call_id":"CALL-20250311-5192","account_id":"COAST-5192","date":"2025-03-11","duration_min":14,"rep":"James Ortiz","contact":"Raj Patel (Owner)","direction":"Outbound","sentiment":"Evasive","summary":"Follow-up on account review. Raj evasive about updated bank statements - claimed accountant on vacation. Nervous when asked about 6 new card requests exceeding fleet size. Promised docs by Friday.","tags":["account_review","evasive_behavior","escalation_pending"]},{"call_id":"CALL-20250215-5192","account_id":"COAST-5192","date":"2025-02-15","duration_min":9,"rep":"James Ortiz","contact":"Raj Patel (Owner)","direction":"Outbound","sentiment":"Pushy","summary":"Onboarding follow-up. Raj demanded credit line increase from $45K to $100K at just 3 weeks in. Vague about seasonal patterns. Reluctantly accepted 90-day review timeline.","tags":["early_line_increase_request","risk_signal"]},{"call_id":"CALL-20250312-2104","account_id":"COAST-2104","date":"2025-03-12","duration_min":45,"rep":"Rachel Kim","contact":"Linda Park (CFO)","direction":"Scheduled QBR","sentiment":"Very Positive","summary":"QBR - Linda very happy, described Coast as 'best vendor relationship.' Confirming annual renewal. Acquiring Midwest Carriers (~30 trucks, +$60K MRR). Wants API integration and volume discounts. Board pushing 15% vendor cost reduction.","tags":["qbr","renewal","acquisition","enterprise_expansion"]},{"call_id":"CALL-20250305-6743","account_id":"COAST-6743","date":"2025-03-05","duration_min":15,"rep":"James Ortiz","contact":"Dave Kowalski (Owner)","direction":"Inbound","sentiment":"Positive","summary":"Requested 7 new cards for HVAC technicians. Loves BuildOps integration - saving 10+ hrs/month. Wants per-job spending limits synced with BuildOps job IDs. Opening second location in Savannah, GA.","tags":["card_request","expansion","feature_request"]},{"call_id":"CALL-20250310-7291","account_id":"COAST-7291","date":"2025-03-10","duration_min":6,"rep":"James Ortiz","contact":"Carlos Reyes (Owner)","direction":"Outbound","sentiment":"Neutral","summary":"Activation follow-up. Only 3/10 cards used. Crew prefers personal cards + expense reports. Carlos distracted, on job site. Deferred training session to 'maybe next week.'","tags":["low_adoption","training_needed"]}];

const TRANSACTION_DATA = [{"account_id":"COAST-4821","account_name":"Meridian Freight Solutions","total_spend":71200,"avg_daily":2373,"txn_count":312,"fuel_spend":58400,"non_fuel":12800,"utilization_pct":38.5,"top_merchants":[{"merchant":"Pilot Flying J","spend":28400},{"merchant":"Love's Travel","spend":19800},{"merchant":"TA Petro","spend":12100}],"anomalies":[{"detail":"3 transactions over $800 (avg $228)","severity":"Low"},{"detail":"Weekend spend up 34%","severity":"Medium"}],"trend":[16200,17800,18100,19100]},{"account_id":"COAST-5192","account_name":"QuickHaul Logistics Inc","total_spend":31800,"avg_daily":1060,"txn_count":89,"fuel_spend":18700,"non_fuel":13100,"utilization_pct":70.7,"top_merchants":[{"merchant":"Sunoco","spend":14200},{"merchant":"UNKNOWN MERCHANT","spend":8900},{"merchant":"Shell","spend":5100}],"anomalies":[{"detail":"Spend velocity 74% above projected","severity":"High"},{"detail":"$8,900 at unidentified merchant","severity":"Critical"},{"detail":"Electronics purchases inconsistent with fleet","severity":"Medium"},{"detail":"18 cards for 12-truck fleet","severity":"High"},{"detail":"11 off-hours transactions in residential areas","severity":"Medium"}],"trend":[5200,6800,8900,10900]},{"account_id":"COAST-2104","account_name":"Greenfield Transport Co","total_spend":212500,"avg_daily":7083,"txn_count":1847,"fuel_spend":189200,"non_fuel":23300,"utilization_pct":40.9,"top_merchants":[{"merchant":"Pilot Flying J","spend":78200},{"merchant":"Love's Travel","spend":54100},{"merchant":"Casey's","spend":31800}],"anomalies":[],"trend":[51200,53400,54100,53800]},{"account_id":"COAST-6743","account_name":"Patriot Plumbing & HVAC","total_spend":42100,"avg_daily":1403,"txn_count":187,"fuel_spend":22800,"non_fuel":19300,"utilization_pct":44.3,"top_merchants":[{"merchant":"Shell","spend":9200},{"merchant":"Home Depot","spend":8400},{"merchant":"BP","spend":7100}],"anomalies":[{"detail":"Non-fuel spend up 22% (HVAC expansion)","severity":"Low"}],"trend":[9200,10100,10800,12000]},{"account_id":"COAST-7291","account_name":"Apex Solar Installations","total_spend":4200,"avg_daily":140,"txn_count":18,"fuel_spend":2900,"non_fuel":1300,"utilization_pct":14.0,"top_merchants":[{"merchant":"Circle K","spend":1400},{"merchant":"Valero","spend":1100},{"merchant":"Home Depot","spend":800}],"anomalies":[{"detail":"Only 3/10 cards active (30%)","severity":"Medium"},{"detail":"14% utilization vs 40% target","severity":"Medium"}],"trend":[800,1100,1200,1100]}];

const SLACK_DATA = [{"account_id":"COAST-4821","channel":"#account-alerts","date":"2025-03-10","from":"FraudBot","message":"⚠️ Driver #38 (Carlos Mendez) - 3 fuel txns within 45 min at locations 80mi apart. Auto-held pending review.","resolution":"GPS error at merchant POS. Legitimate. Released."},{"account_id":"COAST-4821","channel":"#growth-accounts","date":"2025-03-05","from":"Rachel Kim","message":"Meridian asking for line increase again. Mike getting impatient. WEX courting them. Can we fast-track?","resolution":"Delia: Review file first. Steven: Give Mike a timeline, don't lose a growth account."},{"account_id":"COAST-5192","channel":"#account-alerts","date":"2025-03-12","from":"FraudBot","message":"🚨 QuickHaul utilization spike to 70.7%. Spend velocity 74% above model. 12 txns at unidentified merchant ($8,900). IMMEDIATE review.","resolution":"Delia escalated. Line reduction to $25K if docs not received by Friday."},{"account_id":"COAST-5192","channel":"#risk-review","date":"2025-03-11","from":"Delia Nunez","message":"QuickHaul full review. FMCSA shows 8 trucks, not 12. Material misrepresentation. Block new cards immediately.","resolution":"James confirmed cards blocked. Escalated to high priority."},{"account_id":"COAST-2104","channel":"#enterprise-accounts","date":"2025-03-12","from":"Rachel Kim","message":"🎉 Greenfield renewing! Acquiring Midwest Carriers (~30 trucks). +$60K MRR potential.","resolution":"Steven: Fast-track onboarding. Delia: Running KYB on Midwest Carriers."},{"account_id":"COAST-6743","channel":"#product-feedback","date":"2025-03-06","from":"James Ortiz","message":"Patriot Plumbing wants per-job spending limits synced with BuildOps job IDs. Saving 10+ hrs/month already.","resolution":"Product team adding to BuildOps integration roadmap."},{"account_id":"COAST-7291","channel":"#activation-tracking","date":"2025-03-10","from":"Activation Bot","message":"📊 Apex Solar: 3/10 cards active (30%). Below threshold at day 35.","resolution":"Steven: Need better activation playbook for small fleets. Delia: Try SMS onboarding directly to drivers."}];

const SUPPORT_DATA = [{"account_id":"COAST-4821","ticket_id":"SUP-8821","date":"2025-03-09","subject":"Driver card not activating","status":"Resolved","priority":"Medium","resolution":"SSN mismatch in system. Corrected in 2 hrs.","satisfaction":4},{"account_id":"COAST-4821","ticket_id":"SUP-8654","date":"2025-02-22","subject":"Bulk card order - 5 new drivers","status":"Completed","priority":"Low","resolution":"5 cards shipped, all activated in 48 hrs.","satisfaction":5},{"account_id":"COAST-5192","ticket_id":"SUP-8799","date":"2025-03-08","subject":"Request 6 new driver cards","status":"On Hold - Risk Review","priority":"High","resolution":"Escalated: 24 total cards would exceed fleet size. Blocked per risk directive.","satisfaction":null},{"account_id":"COAST-5192","ticket_id":"SUP-8756","date":"2025-02-28","subject":"Transaction declined - near limit","status":"Resolved","priority":"Medium","resolution":"Account near credit limit. Owner aggressive, demanded line increase.","satisfaction":2},{"account_id":"COAST-2104","ticket_id":"SUP-8701","date":"2025-03-01","subject":"API documentation request","status":"In Progress","priority":"Medium","resolution":"Engineering reviewing API access scope for fleet management integration.","satisfaction":null},{"account_id":"COAST-6743","ticket_id":"SUP-8845","date":"2025-03-11","subject":"BuildOps transaction sync error","status":"In Progress","priority":"Medium","resolution":"Investigating API rate limit issue with BuildOps.","satisfaction":null},{"account_id":"COAST-7291","ticket_id":"SUP-8860","date":"2025-03-11","subject":"How to set spending controls per driver","status":"Resolved","priority":"Low","resolution":"Walked through settings. Set up custom rules. Good engagement signal.","satisfaction":4}];

const RISK_DATA = [{"account_id":"COAST-4821","account_name":"Meridian Freight Solutions","risk_score":23,"risk_level":"Low","kyb_status":"Verified","fmcsa_match":true,"fmcsa_units":45,"stated_fleet":47,"bank_docs_verified":true,"tamper_detected":false,"web_domain_age_yrs":9,"google_reviews":142,"google_rating":4.3,"bbb":"A","payment_score":95,"flags":["Line increase pending","Competitor threat - WEX"],"summary":"Low risk. 11-year history, verified FMCSA, consistent financials."},{"account_id":"COAST-5192","account_name":"QuickHaul Logistics Inc","risk_score":82,"risk_level":"High","kyb_status":"Under Re-review","fmcsa_match":false,"fmcsa_units":8,"stated_fleet":12,"bank_docs_verified":"Pending - overdue","tamper_detected":"Under review","web_domain_age_yrs":0.7,"google_reviews":3,"google_rating":5.0,"bbb":null,"payment_score":65,"flags":["Fleet size mismatch (stated 12, FMCSA 8)","$8,900 unknown merchant","18 cards for 8-truck fleet","Spend velocity +74%","Bank statements overdue","Off-hours residential txns","Owner evasive on financials","Early line increase push","Domain only 8 months old"],"summary":"HIGH RISK. Material misrepresentation on fleet size. Multiple converging fraud signals. Recommend line reduction and doc demand."},{"account_id":"COAST-2104","account_name":"Greenfield Transport Co","risk_score":8,"risk_level":"Very Low","kyb_status":"Verified","fmcsa_match":true,"fmcsa_units":118,"stated_fleet":120,"bank_docs_verified":true,"tamper_detected":false,"web_domain_age_yrs":18,"google_reviews":524,"google_rating":4.1,"bbb":"A+","payment_score":100,"flags":["Midwest Carriers acquisition - needs risk review"],"summary":"Exemplary. 22-year history, perfect payment record, top-10 account."},{"account_id":"COAST-6743","account_name":"Patriot Plumbing & HVAC","risk_score":15,"risk_level":"Low","kyb_status":"Verified","fmcsa_match":"N/A","fmcsa_units":null,"stated_fleet":28,"bank_docs_verified":true,"tamper_detected":false,"web_domain_age_yrs":12,"google_reviews":287,"google_rating":4.6,"bbb":"A","payment_score":100,"flags":["Non-fuel spend up 22% (expected - HVAC expansion)"],"summary":"Strong field service account. 15-year history, excellent payments."},{"account_id":"COAST-7291","account_name":"Apex Solar Installations","risk_score":28,"risk_level":"Low-Medium","kyb_status":"Verified","fmcsa_match":"N/A","fmcsa_units":null,"stated_fleet":8,"bank_docs_verified":true,"tamper_detected":false,"web_domain_age_yrs":3.5,"google_reviews":47,"google_rating":4.8,"bbb":null,"payment_score":90,"flags":["30% card activation","14% utilization","Owner deferred training twice"],"summary":"No fraud/credit risk. Primary risk is churn from low adoption."}];

// ── HELPERS ──────────────────────────────────────────
function getAccountData(accountId) {
  return {
    crm: CRM_DATA.find(a => a.account_id === accountId),
    calls: CALL_DATA.filter(c => c.account_id === accountId),
    transactions: TRANSACTION_DATA.find(t => t.account_id === accountId),
    slack: SLACK_DATA.filter(s => s.account_id === accountId),
    support: SUPPORT_DATA.filter(s => s.account_id === accountId),
    risk: RISK_DATA.find(r => r.account_id === accountId),
  };
}

function findAccountFromQuery(query) {
  const q = query.toLowerCase();
  for (const a of CRM_DATA) {
    if (q.includes(a.company_name.toLowerCase()) || q.includes(a.company_name.split(" ")[0].toLowerCase()) || q.includes(a.account_id.toLowerCase())) return a;
  }
  if (q.includes("quickhaul") || q.includes("quick haul")) return CRM_DATA[1];
  if (q.includes("patriot")) return CRM_DATA[3];
  if (q.includes("apex")) return CRM_DATA[4];
  return null;
}

const SYSTEM_PROMPT = `You are Coast Account Intelligence, an internal AI agent for Coast (fintech - fleet fuel cards & expense management for trucking/field service businesses).

You help the risk, analytics, account management, and ops teams understand customer accounts instantly by synthesizing data from 6 internal sources: CRM, Call Transcripts, Transactions, Slack, Support Tickets, and Risk Scores.

GUIDELINES:
- Be direct, opinionated, and actionable. This is for internal team use.
- Connect dots across sources (e.g., Slack fraud alert + transaction anomaly + evasive call behavior = pattern)
- Highlight risk signals prominently with severity
- Recommend specific next actions with owners
- Use bold (**text**) for key metrics, names, and critical callouts
- Use headers (##) to organize sections
- Keep it concise but thorough

Available accounts: Meridian Freight Solutions, QuickHaul Logistics, Greenfield Transport, Patriot Plumbing & HVAC, Apex Solar Installations.

If asked about accounts not in the demo, explain this is a proof-of-concept with 5 sample accounts.
If asked to compare accounts or give portfolio overview, synthesize across all accounts.`;

function buildPrompt(userMsg, accountData) {
  let ctx = userMsg;
  if (accountData) {
    ctx = `User query: ${userMsg}\n\nACCOUNT DATA FROM ALL 6 SOURCES:\n\n[CRM] ${JSON.stringify(accountData.crm)}\n\n[CALLS] ${JSON.stringify(accountData.calls)}\n\n[TRANSACTIONS] ${JSON.stringify(accountData.transactions)}\n\n[SLACK] ${JSON.stringify(accountData.slack)}\n\n[SUPPORT] ${JSON.stringify(accountData.support)}\n\n[RISK] ${JSON.stringify(accountData.risk)}`;
  } else if (userMsg.toLowerCase().includes("all") || userMsg.toLowerCase().includes("portfolio") || userMsg.toLowerCase().includes("compare") || userMsg.toLowerCase().includes("overview")) {
    ctx = `User query: ${userMsg}\n\nALL ACCOUNTS DATA:\n${JSON.stringify({ crm: CRM_DATA, risk: RISK_DATA, transactions: TRANSACTION_DATA })}`;
  }
  return ctx;
}

// ── COAST THEME ─────────────────────────────────────
const C = {
  blue: "#0055FF",
  blueLt: "#E8F0FF",
  blueMd: "#B3D1FF",
  navy: "#0A1628",
  bg: "#FAFBFD",
  white: "#FFFFFF",
  border: "#E2E8F0",
  borderDk: "#CBD5E1",
  text: "#0F172A",
  textMd: "#475569",
  textLt: "#94A3B8",
  green: "#059669",
  greenBg: "#ECFDF5",
  red: "#DC2626",
  redBg: "#FEF2F2",
  yellow: "#D97706",
  yellowBg: "#FFFBEB",
  orange: "#EA580C",
};

// ── MINI CHART ──────────────────────────────────────
function SparkBar({ data, color = C.blue, height = 32 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "end", gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, background: i === data.length - 1 ? color : color + "60", borderRadius: 2, height: `${(v / max) * 100}%`, minHeight: 2, transition: "height 0.3s" }} />
      ))}
    </div>
  );
}

// ── RISK BADGE ──────────────────────────────────────
function RiskBadge({ level, score }) {
  const cfg = {
    "Very Low": { bg: C.greenBg, color: C.green, border: "#BBF7D0" },
    "Low": { bg: C.greenBg, color: C.green, border: "#BBF7D0" },
    "Low-Medium": { bg: C.yellowBg, color: C.yellow, border: "#FDE68A" },
    "Medium": { bg: C.yellowBg, color: C.yellow, border: "#FDE68A" },
    "High": { bg: C.redBg, color: C.red, border: "#FECACA" },
    "Critical": { bg: C.redBg, color: C.red, border: "#FECACA" },
  }[level] || { bg: C.blueLt, color: C.blue, border: C.blueMd };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "2px 8px", borderRadius: 100 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
      {level} {score !== undefined && `(${score})`}
    </span>
  );
}

// ── DATA SOURCE TAB ─────────────────────────────────
function DataSourceTab({ label, icon, count, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: `1px solid ${active ? C.blue : C.border}`, borderRadius: 6, background: active ? C.blueLt : C.white, color: active ? C.blue : C.textMd, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
      <span>{icon}</span>
      <span>{label}</span>
      {count > 0 && <span style={{ background: active ? C.blue : C.border, color: active ? C.white : C.textMd, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 100 }}>{count}</span>}
    </button>
  );
}

// ── MARKDOWN RENDERER ───────────────────────────────
function Markdown({ text }) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const bold = (s) => {
      const parts = s.split(/\*\*(.*?)\*\*/g);
      return parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ fontWeight: 600, color: C.text }}>{p}</strong> : <span key={j}>{p}</span>);
    };
    if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: "16px 0 6px", borderBottom: `1px solid ${C.border}`, paddingBottom: 4 }}>{bold(line.slice(3))}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: 13, fontWeight: 700, color: C.blue, margin: "12px 0 4px", textTransform: "uppercase", letterSpacing: "0.03em" }}>{bold(line.slice(4))}</h3>;
    if (line.startsWith("- ") || line.startsWith("* ")) return <div key={i} style={{ display: "flex", gap: 8, margin: "2px 0", paddingLeft: 4, lineHeight: 1.5 }}><span style={{ color: C.textLt }}>•</span><span>{bold(line.slice(2))}</span></div>;
    if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
    return <p key={i} style={{ margin: "3px 0", lineHeight: 1.6 }}>{bold(line)}</p>;
  });
}

// ── DATA VIEWER ─────────────────────────────────────
function DataViewer({ account }) {
  const [tab, setTab] = useState("crm");
  const data = getAccountData(account.account_id);
  const tabs = [
    { id: "crm", label: "CRM", icon: "📋", count: 1 },
    { id: "calls", label: "Calls", icon: "📞", count: data.calls.length },
    { id: "txns", label: "Transactions", icon: "💳", count: data.transactions?.txn_count || 0 },
    { id: "slack", label: "Slack", icon: "💬", count: data.slack.length },
    { id: "support", label: "Support", icon: "🎫", count: data.support.length },
    { id: "risk", label: "Risk", icon: "🛡️", count: data.risk?.flags?.length || 0 },
  ];

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", display: "flex", gap: 6, overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        {tabs.map(t => <DataSourceTab key={t.id} {...t} active={tab === t.id} onClick={() => setTab(t.id)} />)}
      </div>
      <div style={{ padding: 16, maxHeight: 340, overflowY: "auto", fontSize: 13, color: C.textMd, lineHeight: 1.6 }}>
        {tab === "crm" && data.crm && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
            {[["Company", data.crm.company_name], ["EIN", data.crm.ein], ["Industry", data.crm.industry], ["HQ", data.crm.hq_address], ["Fleet Size", data.crm.fleet_size + " vehicles"], ["Active Cards", data.crm.active_cards], ["Credit Line", "$" + data.crm.credit_line.toLocaleString()], ["Balance", "$" + data.crm.current_balance.toLocaleString()], ["Utilization", data.crm.utilization_pct + "%"], ["Avg Monthly Spend", "$" + data.crm.monthly_spend_avg.toLocaleString()], ["Onboarded", data.crm.onboarded_date], ["Status", data.crm.account_status], ["Tier", data.crm.tier], ["Account Manager", data.crm.account_manager], ["Owner", data.crm.owner_name], ["Years in Business", data.crm.years_in_business], ["Est. Revenue", "$" + data.crm.annual_revenue_est.toLocaleString()], ["Source", data.crm.source], ["Integrations", data.crm.integrations.join(", ") || "None"]].map(([k, v], i) => (
              <div key={i}><span style={{ fontSize: 11, color: C.textLt, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span><div style={{ fontWeight: 500, color: C.text }}>{v}</div></div>
            ))}
          </div>
        )}
        {tab === "calls" && data.calls.map((c, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < data.calls.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: C.text, fontSize: 12 }}>{c.date} · {c.rep}</span>
              <span style={{ fontSize: 11, color: c.sentiment === "Evasive" || c.sentiment === "Pushy" ? C.red : c.sentiment === "Mixed" ? C.yellow : C.green, fontWeight: 600 }}>{c.sentiment}</span>
            </div>
            <div style={{ fontSize: 12 }}>{c.contact} · {c.direction} · {c.duration_min} min</div>
            <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5 }}>{c.summary}</div>
            <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>{c.tags.map((t, j) => <span key={j} style={{ fontSize: 10, background: C.blueLt, color: C.blue, padding: "1px 6px", borderRadius: 4 }}>{t}</span>)}</div>
          </div>
        ))}
        {tab === "txns" && data.transactions && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: C.bg, padding: 10, borderRadius: 8 }}><div style={{ fontSize: 11, color: C.textLt }}>Total Spend</div><div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>${data.transactions.total_spend.toLocaleString()}</div></div>
              <div style={{ background: C.bg, padding: 10, borderRadius: 8 }}><div style={{ fontSize: 11, color: C.textLt }}>Transactions</div><div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{data.transactions.txn_count}</div></div>
              <div style={{ background: C.bg, padding: 10, borderRadius: 8 }}><div style={{ fontSize: 11, color: C.textLt }}>Utilization</div><div style={{ fontSize: 18, fontWeight: 700, color: data.transactions.utilization_pct > 60 ? C.red : C.text }}>{data.transactions.utilization_pct}%</div></div>
            </div>
            <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 600, color: C.textLt, marginBottom: 4 }}>SPEND TREND (4 WEEKS)</div><SparkBar data={data.transactions.trend} color={data.transactions.utilization_pct > 60 ? C.red : C.blue} /></div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textLt, marginBottom: 6 }}>TOP MERCHANTS</div>
            {data.transactions.top_merchants.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontWeight: 500, color: m.merchant.includes("UNKNOWN") ? C.red : C.text }}>{m.merchant}</span>
                <span style={{ fontWeight: 600 }}>${m.spend.toLocaleString()}</span>
              </div>
            ))}
            {data.transactions.anomalies.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.red, marginBottom: 6 }}>ANOMALIES</div>
                {data.transactions.anomalies.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "start", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: a.severity === "Critical" ? C.red : a.severity === "High" ? C.orange : C.yellow, background: a.severity === "Critical" ? C.redBg : a.severity === "High" ? "#FFF7ED" : C.yellowBg, padding: "1px 5px", borderRadius: 3 }}>{a.severity}</span>
                    <span style={{ fontSize: 12 }}>{a.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "slack" && data.slack.map((s, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < data.slack.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: C.text, fontSize: 12 }}>{s.channel}</span>
              <span style={{ fontSize: 11, color: C.textLt }}>{s.date}</span>
            </div>
            <div style={{ fontSize: 11, color: C.blue, marginBottom: 4 }}>{s.from}</div>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>{s.message}</div>
            {s.resolution && <div style={{ fontSize: 11, color: C.green, marginTop: 4, fontStyle: "italic" }}>→ {s.resolution}</div>}
          </div>
        ))}
        {tab === "support" && data.support.map((s, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < data.support.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: C.text, fontSize: 12 }}>{s.ticket_id} · {s.subject}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: s.status.includes("Hold") ? C.red : s.status === "In Progress" ? C.yellow : C.green, background: s.status.includes("Hold") ? C.redBg : s.status === "In Progress" ? C.yellowBg : C.greenBg, padding: "1px 6px", borderRadius: 4 }}>{s.status}</span>
            </div>
            <div style={{ fontSize: 11, color: C.textLt }}>{s.date} · Priority: {s.priority}</div>
            <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{s.resolution || "Pending resolution"}</div>
            {s.satisfaction && <div style={{ fontSize: 11, marginTop: 3, color: C.textLt }}>CSAT: {"⭐".repeat(s.satisfaction)}</div>}
          </div>
        ))}
        {tab === "risk" && data.risk && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <RiskBadge level={data.risk.risk_level} score={data.risk.risk_score} />
              <span style={{ fontSize: 11, color: C.textLt }}>KYB: {data.risk.kyb_status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 12 }}>
              {[["FMCSA Match", data.risk.fmcsa_match === true ? "✅ Yes" : data.risk.fmcsa_match === false ? "❌ No" : "N/A"], ["FMCSA Units", data.risk.fmcsa_units || "N/A"], ["Stated Fleet", data.risk.stated_fleet], ["Bank Docs", data.risk.bank_docs_verified === true ? "✅ Verified" : String(data.risk.bank_docs_verified)], ["Tamper Check", data.risk.tamper_detected === false ? "✅ Clear" : String(data.risk.tamper_detected)], ["Domain Age", data.risk.web_domain_age_yrs + " yrs"], ["Google Reviews", data.risk.google_reviews + " (" + data.risk.google_rating + "⭐)"], ["BBB Rating", data.risk.bbb || "None"], ["Payment Score", data.risk.payment_score + "/100"]].map(([k, v], i) => (
                <div key={i}><span style={{ fontSize: 10, color: C.textLt, textTransform: "uppercase" }}>{k}</span><div style={{ fontWeight: 500, color: C.text, fontSize: 12 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: data.risk.flags.length > 3 ? C.red : C.textLt, marginBottom: 6 }}>ACTIVE FLAGS ({data.risk.flags.length})</div>
            {data.risk.flags.map((f, i) => <div key={i} style={{ fontSize: 12, padding: "3px 0", borderLeft: `2px solid ${data.risk.risk_score > 50 ? C.red : C.yellow}`, paddingLeft: 8, marginBottom: 4 }}>{f}</div>)}
            <div style={{ marginTop: 12, padding: 10, background: data.risk.risk_score > 50 ? C.redBg : C.greenBg, borderRadius: 6, fontSize: 12, lineHeight: 1.5 }}>{data.risk.summary}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ────────────────────────────────────────
export default function CoastIntelligence() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function callAI(userMsg, extra = "") {
    const account = findAccountFromQuery(userMsg);
    const accountData = account ? getAccountData(account.account_id) : null;
    const content = buildPrompt(userMsg, accountData);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT + extra, messages: [{ role: "user", content }] }),
    });
    const data = await res.json();
    return data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "Error generating response.";
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const reply = await callAI(msg);
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please try again." }]); }
    setLoading(false);
  }

  async function handleAccountSelect(account) {
    setSelectedAccount(account);
    setSummary("");
    setSummaryLoading(true);
    try {
      const reply = await callAI(
        `Generate a comprehensive intelligence briefing for ${account.company_name}. Cover: health overview, risk signals, recent activity from calls/Slack/support, transaction patterns, and recommended next actions with specific owners.`,
        "\nFormat as a structured internal briefing. Be direct and opinionated about what needs attention."
      );
      setSummary(reply);
    } catch { setSummary("Error generating briefing."); }
    setSummaryLoading(false);
  }

  const quickQs = [
    "Full briefing on QuickHaul Logistics",
    "Is QuickHaul Logistics a fraud risk?",
    "What's the expansion opportunity with Greenfield?",
    "Compare risk across all accounts",
    "Which accounts need activation help?",
    "Give me a portfolio risk overview",
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif", fontSize: 13, color: C.textMd }}>
      {/* ── Header ── */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 14 }}>C</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, letterSpacing: "-0.02em" }}>Coast Account Intelligence</div>
            <div style={{ fontSize: 11, color: C.textLt }}>Multi-source context agent · 6 data sources · 5 accounts</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.blue, background: C.blueLt, padding: "3px 10px", borderRadius: 100 }}>PROOF OF CONCEPT</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.green, background: C.greenBg, padding: "3px 10px", borderRadius: 100, border: "1px solid #BBF7D0" }}>AI POWERED</span>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 53px)" }}>
        {/* ── Sidebar ── */}
        <div style={{ width: 280, background: C.white, borderRight: `1px solid ${C.border}`, overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px 8px", fontSize: 10, fontWeight: 700, color: C.textLt, textTransform: "uppercase", letterSpacing: "0.08em" }}>Accounts ({CRM_DATA.length})</div>
          {CRM_DATA.map(account => {
            const risk = RISK_DATA.find(r => r.account_id === account.account_id);
            const txn = TRANSACTION_DATA.find(t => t.account_id === account.account_id);
            const sel = selectedAccount?.account_id === account.account_id;
            return (
              <div key={account.account_id} onClick={() => handleAccountSelect(account)} style={{ padding: "12px 16px", margin: "0 8px 4px", borderRadius: 8, cursor: "pointer", background: sel ? C.blueLt : "transparent", border: `1px solid ${sel ? C.blue + "30" : "transparent"}`, transition: "all 0.12s" }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.bg; }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{account.company_name}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: C.textLt }}>{account.fleet_size} trucks · {account.tier}</span>
                  <RiskBadge level={risk?.risk_level} score={risk?.risk_score} />
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
                  <div><span style={{ color: C.textLt }}>Spend </span><span style={{ fontWeight: 600, color: C.text }}>${(txn?.total_spend / 1000).toFixed(0)}K</span></div>
                  <div><span style={{ color: C.textLt }}>Util </span><span style={{ fontWeight: 600, color: txn?.utilization_pct > 60 ? C.red : C.text }}>{txn?.utilization_pct}%</span></div>
                </div>
                {txn && <div style={{ marginTop: 6 }}><SparkBar data={txn.trend} height={20} color={risk?.risk_score > 50 ? C.red : C.blue} /></div>}
              </div>
            );
          })}
        </div>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selectedAccount ? (
            <>
              {/* Account Header */}
              <div style={{ padding: "14px 20px", background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.navy }}>{selectedAccount.company_name}</div>
                  <div style={{ fontSize: 12, color: C.textLt }}>{selectedAccount.account_id} · {selectedAccount.industry} · {selectedAccount.hq_address}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>{["CRM", "Calls", "Txns", "Slack", "Support", "Risk"].map((s, i) => <span key={i} style={{ fontSize: 10, background: C.blueLt, color: C.blue, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{s}</span>)}</div>
              </div>

              <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
                {/* Data Viewer */}
                <DataViewer account={selectedAccount} />

                {/* AI Briefing */}
                <div style={{ marginTop: 16, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", background: C.bg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>🤖</span>
                    <span style={{ fontWeight: 600, fontSize: 12, color: C.navy }}>AI Intelligence Briefing</span>
                    <span style={{ fontSize: 10, color: C.textLt }}>Synthesized from all 6 data sources</span>
                  </div>
                  <div style={{ padding: 16, fontSize: 13, lineHeight: 1.6, color: C.textMd }}>
                    {summaryLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.blue }}>
                        <div style={{ width: 16, height: 16, border: `2px solid ${C.blueLt}`, borderTopColor: C.blue, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        Analyzing 6 data sources for {selectedAccount.company_name}...
                        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                      </div>
                    ) : summary ? <Markdown text={summary} /> : <span style={{ color: C.textLt }}>Select an account to generate a briefing.</span>}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Welcome / Chat */
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
                {messages.length === 0 ? (
                  <div style={{ maxWidth: 560, margin: "60px auto", textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: "0 0 8px" }}>Ask me about any account</h1>
                    <p style={{ color: C.textLt, fontSize: 14, margin: "0 0 28px" }}>I pull context from CRM, calls, transactions, Slack, support tickets, and risk scores to give you a complete picture.</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                      {quickQs.map((q, i) => (
                        <button key={i} onClick={() => { setInput(q); }} style={{ padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, color: C.textMd, fontSize: 12, cursor: "pointer", transition: "all 0.12s", fontFamily: "inherit" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMd; }}
                        >{q}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ maxWidth: 680, margin: "0 auto" }}>
                    {messages.map((m, i) => (
                      <div key={i} style={{ marginBottom: 16, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: 10, background: m.role === "user" ? C.blue : C.white, color: m.role === "user" ? C.white : C.textMd, border: m.role === "user" ? "none" : `1px solid ${C.border}`, fontSize: 13, lineHeight: 1.6 }}>
                          {m.role === "assistant" ? <Markdown text={m.text} /> : m.text}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div style={{ display: "flex", gap: 8, alignItems: "center", color: C.blue, fontSize: 12, padding: "8px 0" }}>
                        <div style={{ width: 14, height: 14, border: `2px solid ${C.blueLt}`, borderTopColor: C.blue, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        Searching across 6 data sources...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={{ padding: "12px 20px", background: C.white, borderTop: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 8 }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder="Ask about any account... (e.g., 'Is QuickHaul a fraud risk?')"
                    style={{ flex: 1, padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: C.bg }}
                  />
                  <button onClick={handleSend} disabled={loading || !input.trim()} style={{ padding: "10px 20px", background: input.trim() ? C.blue : C.border, color: C.white, border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: input.trim() ? "pointer" : "default", transition: "all 0.12s", fontFamily: "inherit" }}>
                    Ask
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
