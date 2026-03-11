import type {
  KPIResponse,
  TrendPoint,
  RiskDistribution,
  ActiveInactiveDistribution,
  AgentInsight,
  PaginatedAccounts,
  AccountDetail,
  SHAPFeature,
  AnalyticsOverview,
  SegmentBreakdown,
  ModelMetrics,
  DriftStatus,
  PrescriptionGroup,
  InterventionDraft,
} from "@/types/api";

const kpis: KPIResponse = {
  total_accounts: 12_847,
  active_subscribers: 10_231,
  churned_accounts: 2_616,
  churn_rate_30d: 4.8,
  high_risk_count: 1_073,
  at_risk_mrr: 58_420,
  cac: 42.5,
  retention_cost_per_save: 18.3,
};

const trends: TrendPoint[] = [
  { label: "Apr 2025", value: 5.2, predicted: 5.0 },
  { label: "May 2025", value: 5.0, predicted: 4.9 },
  { label: "Jun 2025", value: 4.7, predicted: 4.8 },
  { label: "Jul 2025", value: 4.9, predicted: 4.7 },
  { label: "Aug 2025", value: 5.1, predicted: 5.0 },
  { label: "Sep 2025", value: 4.6, predicted: 4.8 },
  { label: "Oct 2025", value: 4.3, predicted: 4.5 },
  { label: "Nov 2025", value: 4.5, predicted: 4.4 },
  { label: "Dec 2025", value: 5.8, predicted: 5.2 },
  { label: "Jan 2026", value: 5.4, predicted: 5.5 },
  { label: "Feb 2026", value: 5.1, predicted: 5.0 },
  { label: "Mar 2026", value: 4.8, predicted: 4.9 },
];

const riskDistribution: RiskDistribution = {
  low: 7_842,
  medium: 1_932,
  high: 1_073,
};

const activeInactive: ActiveInactiveDistribution = {
  active: 10_231,
  inactive: 2_616,
  recent_churn_30d: 614,
};

const executiveSummary: AgentInsight = {
  title: "Executive Summary — March 2026",
  content:
    "**Churn rate has stabilized at 4.8%**, down from the December peak of 5.8%. The post-holiday spike " +
    "driven by gift-subscription expirations has fully resolved.\n\n" +
    "**Key findings:**\n" +
    "- 1,073 accounts flagged as high-risk, representing $58.4K in monthly recurring revenue\n" +
    "- Payment failures remain the #1 churn driver (32% of recent churns), followed by content disengagement (28%)\n" +
    "- Proactive outreach campaigns reduced churn in the medium-risk tier by 12% month-over-month\n" +
    "- Premium-plan subscribers show 2.3x higher retention than basic-plan users\n\n" +
    "**Recommended actions:** Prioritize payment recovery workflows for the 247 accounts with failed payments " +
    "in the last 14 days. Launch re-engagement campaigns targeting users with >30 day streaming inactivity.",
  timestamp: "2026-03-10T08:00:00Z",
};

const globalShap: SHAPFeature[] = [
  { feature: "days_since_last_stream", importance: 0.34, direction: "positive" },
  { feature: "payment_failures_90d", importance: 0.28, direction: "positive" },
  { feature: "avg_watch_hours_30d", importance: 0.22, direction: "negative" },
  { feature: "support_tickets_open", importance: 0.18, direction: "positive" },
  { feature: "tenure_days", importance: 0.15, direction: "negative" },
  { feature: "sessions_last_14d", importance: 0.14, direction: "negative" },
  { feature: "plan_downgrades_6m", importance: 0.12, direction: "positive" },
  { feature: "unique_titles_30d", importance: 0.10, direction: "negative" },
  { feature: "billing_amount_change", importance: 0.09, direction: "positive" },
  { feature: "device_count", importance: 0.07, direction: "negative" },
];

function makeAccounts(page: number, perPage: number): PaginatedAccounts {
  const total = 1_073;
  const items = Array.from({ length: Math.min(perPage, total - (page - 1) * perPage) }, (_, i) => {
    const idx = (page - 1) * perPage + i;
    const id = String(idx + 1).padStart(8, "0");
    const prob = +(0.95 - idx * 0.004).toFixed(3);
    return {
      account_id: `ACC_${id}`,
      email: `user${idx + 1}@example.com`,
      churn_probability: Math.max(prob, 0.40),
      risk_tier: (prob >= 0.70 ? "high" : prob >= 0.40 ? "medium" : "low") as "high" | "medium" | "low",
      plan_type: ["premium", "standard", "basic"][idx % 3],
      tenure_days: 60 + idx * 7,
      last_payment_days: 3 + (idx % 30),
      last_stream_days: 1 + (idx % 45),
      open_tickets: idx % 4,
      top_drivers: globalShap.slice(0, 3).map((s) => s.feature),
    };
  });
  return { items, total, page, per_page: perPage };
}

const accountDetail: AccountDetail = {
  account_id: "ACC_00000001",
  email: "user1@example.com",
  churn_probability: 0.92,
  risk_tier: "high",
  plan_type: "premium",
  tenure_days: 124,
  last_payment_days: 8,
  last_stream_days: 34,
  open_tickets: 2,
  top_drivers: ["days_since_last_stream", "payment_failures_90d", "support_tickets_open"],
  watch_hours_30d: 1.2,
  watch_hours_90d: 18.5,
  sessions_30d: 3,
  content_categories: ["Drama", "Sci-Fi"],
  recent_payments: [
    { date: "2026-03-02", amount: 14.99, status: "failed", method: "credit_card" },
    { date: "2026-02-02", amount: 14.99, status: "completed", method: "credit_card" },
    { date: "2026-01-02", amount: 14.99, status: "completed", method: "credit_card" },
  ],
  recent_tickets: [
    { id: "TKT-4821", date: "2026-03-05", subject: "Billing charge not recognized", status: "open", priority: "high" },
    { id: "TKT-4790", date: "2026-02-28", subject: "Stream quality issues", status: "resolved", priority: "medium" },
  ],
};

const segments: SegmentBreakdown = {
  by_plan: [
    { plan: "Basic", count: 4_210, churn_rate: 7.2 },
    { plan: "Standard", count: 5_128, churn_rate: 4.1 },
    { plan: "Premium", count: 3_509, churn_rate: 3.0 },
  ],
  by_tenure: [
    { plan: "0-90 days", count: 2_840, churn_rate: 9.4 },
    { plan: "91-365 days", count: 5_120, churn_rate: 4.6 },
    { plan: "1-2 years", count: 3_210, churn_rate: 2.8 },
    { plan: "2+ years", count: 1_677, churn_rate: 1.9 },
  ],
};

const modelMetrics: ModelMetrics = {
  auc_roc: 0.891,
  precision: 0.823,
  recall: 0.784,
  f1_score: 0.803,
  log_loss: 0.342,
  calibration_error: 0.028,
  last_trained: "2026-03-08T14:30:00Z",
  training_samples: 38_420,
};

const driftStatus: DriftStatus = {
  overall_status: "ok",
  features: [
    { feature: "days_since_last_stream", psi: 0.03, status: "ok" },
    { feature: "payment_failures_90d", psi: 0.05, status: "ok" },
    { feature: "avg_watch_hours_30d", psi: 0.08, status: "ok" },
    { feature: "support_tickets_open", psi: 0.11, status: "warning" },
    { feature: "tenure_days", psi: 0.02, status: "ok" },
  ],
  last_checked: "2026-03-10T06:00:00Z",
};

const prescriptions: PrescriptionGroup[] = [
  {
    strategy: "payment_recovery",
    display_name: "Payment Recovery",
    account_count: 247,
    estimated_mrr: 3_680,
    accounts: makeAccounts(1, 5).items,
  },
  {
    strategy: "re_engagement",
    display_name: "Re-Engagement Campaign",
    account_count: 389,
    estimated_mrr: 5_210,
    accounts: makeAccounts(1, 5).items,
  },
  {
    strategy: "plan_optimization",
    display_name: "Plan Optimization",
    account_count: 198,
    estimated_mrr: 2_940,
    accounts: makeAccounts(1, 5).items,
  },
  {
    strategy: "loyalty_reward",
    display_name: "Loyalty Reward",
    account_count: 156,
    estimated_mrr: 1_870,
    accounts: makeAccounts(1, 5).items,
  },
  {
    strategy: "support_escalation",
    display_name: "Support Escalation",
    account_count: 83,
    estimated_mrr: 1_240,
    accounts: makeAccounts(1, 5).items,
  },
];

const interventions: InterventionDraft[] = [
  {
    id: "INT-001",
    account_id: "ACC_00000001",
    strategy: "payment_recovery",
    status: "pending",
    subject: "We noticed an issue with your payment",
    body_html: "<p>Hi there,</p><p>We noticed your recent payment didn't go through. We'd hate to see you lose access to your favorite shows. Please update your payment method to continue enjoying uninterrupted streaming.</p><p>As a thank you for being a valued subscriber, we're offering a 15% discount on your next month if you update within 48 hours.</p>",
    body_plaintext: "Hi there,\n\nWe noticed your recent payment didn't go through. We'd hate to see you lose access to your favorite shows. Please update your payment method to continue enjoying uninterrupted streaming.\n\nAs a thank you for being a valued subscriber, we're offering a 15% discount on your next month if you update within 48 hours.",
    agent_rationale: "Account shows failed payment on 2026-03-02 with high churn probability (0.92). Payment recovery strategy selected due to recent billing failure. Discount incentive included given 124-day tenure and premium plan value.",
    created_at: "2026-03-10T09:15:00Z",
    updated_at: "2026-03-10T09:15:00Z",
  },
  {
    id: "INT-002",
    account_id: "ACC_00000003",
    strategy: "re_engagement",
    status: "approved",
    subject: "We miss you! Here's what's new",
    body_html: "<p>Hi there,</p><p>It's been a while since your last visit. We've added 47 new titles this month, including several in your favorite genres. Come back and check them out!</p>",
    body_plaintext: "Hi there,\n\nIt's been a while since your last visit. We've added 47 new titles this month, including several in your favorite genres. Come back and check them out!",
    agent_rationale: "Account inactive for 38 days with declining engagement trend. Re-engagement with personalized content recommendations based on historical preferences.",
    created_at: "2026-03-09T14:20:00Z",
    updated_at: "2026-03-09T16:45:00Z",
  },
];

const analyticsOverview: AnalyticsOverview = {
  kpis,
  risk_distribution: riskDistribution,
  top_shap_features: globalShap.slice(0, 5),
};

// Route matcher
const routes: Record<string, (params?: URLSearchParams) => unknown> = {
  "/dashboard/kpis": () => kpis,
  "/dashboard/trends": () => trends,
  "/dashboard/risk-distribution": () => riskDistribution,
  "/dashboard/active-inactive": () => activeInactive,
  "/dashboard/executive-summary": () => executiveSummary,
  "/accounts/at-risk": (p) => makeAccounts(+(p?.get("page") ?? 1), +(p?.get("per_page") ?? 15)),
  "/analytics/overview": () => analyticsOverview,
  "/analytics/churn-trends": () => trends,
  "/analytics/segments": () => segments,
  "/analytics/model-performance": () => modelMetrics,
  "/analytics/drift": () => driftStatus,
  "/analytics/shap-global": () => globalShap,
  "/prescriptions": () => prescriptions,
  "/interventions": () => interventions,
};

export function getDemoData(url: string, params?: Record<string, string | number>): unknown | null {
  // Strip /api prefix if present
  const path = url.replace(/^\/api/, "");

  // Check for account detail pattern: /accounts/ACC_XXXXX
  const accountMatch = path.match(/^\/accounts\/(ACC_\d+)$/);
  if (accountMatch) {
    return { ...accountDetail, account_id: accountMatch[1] };
  }

  // Check for account SHAP pattern
  const shapMatch = path.match(/^\/accounts\/(ACC_\d+)\/shap$/);
  if (shapMatch) {
    return globalShap;
  }

  // Check for prescription by strategy
  const rxMatch = path.match(/^\/prescriptions\/(.+)$/);
  if (rxMatch) {
    return prescriptions.find((p) => p.strategy === rxMatch[1]) ?? prescriptions[0];
  }

  // Check for intervention by id
  const intMatch = path.match(/^\/interventions\/(INT-\d+)$/);
  if (intMatch) {
    return interventions.find((i) => i.id === intMatch[1]) ?? interventions[0];
  }

  const handler = routes[path];
  if (handler) {
    const sp = params ? new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])) : undefined;
    return handler(sp);
  }

  return null;
}
