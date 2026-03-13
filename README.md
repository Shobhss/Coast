# Coast Account Intelligence Agent

A proof-of-concept AI-powered internal tool for Coast's risk, analytics, and account management teams. Built to demonstrate how a multi-source context agent can synthesize data from 6 internal systems into actionable account intelligence.

## What It Does

Ask about any fleet customer account, and the agent pulls context from **6 data sources** simultaneously:

| Source | What It Contains |
|--------|-----------------|
| **CRM** | Company info, fleet size, credit lines, account status, integrations |
| **Call Transcripts** | Summarized rep calls with sentiment, action items, and tags |
| **Transactions** | Spend patterns, top merchants, anomalies, trend data |
| **Slack Signals** | Internal team chatter, fraud alerts, escalations |
| **Support Tickets** | Customer issues, resolution times, satisfaction scores |
| **Risk Scores** | 30+ weighted attributes including KYB, FMCSA, web presence, behavioral signals |

## Two Modes

1. **Account Briefing**: Click any account in the sidebar to get an AI-generated intelligence briefing synthesizing all 6 sources
2. **Chat Interface**: Ask natural language questions like "Is QuickHaul a fraud risk?" or "Compare risk across all accounts"

## Sample Accounts

5 accounts with interconnected narratives across all data sources:

- **Meridian Freight Solutions** (Growth) - Healthy account, competitor retention risk
- **QuickHaul Logistics** (High Risk) - Multiple converging fraud signals
- **Greenfield Transport** (Enterprise) - Top account, acquisition expansion opportunity
- **Patriot Plumbing & HVAC** (Field Service) - Strong adoption, integration power user
- **Apex Solar Installations** (Activation) - Low card adoption, churn risk

## Tech Stack

- React (single-file component)
- Claude API (Sonnet 4) for AI synthesis
- Tailwind-compatible inline styling
- Coast brand design system (white + blue)

## Data

All sample datasets are in the `/data` directory as JSON files:
- `crm_accounts.json`
- `call_transcripts.json`
- `transactions.json`
- `slack_signals.json`
- `support_tickets.json`
- `risk_scores.json`

## Built By

[Shobhit Dixit](https://www.linkedin.com/in/shobhitdixit/) - MBA AI Candidate, Kellogg School of Management, Northwestern University (Class of 2027)

---

*This is a proof-of-concept demonstrating how AI agents can automate internal workflow intelligence for fintech risk and operations teams.*
