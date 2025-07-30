import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

// ------------------------
// MOCK DATA (extended)
// ------------------------
const data = {
  successRate: 0.824,
  currentSuccessRate: 0.672,
  currentSuccessRate: 0.672,
  medianEndingBalance: 2180000,
  currentMedianEndingBalance: 1850000,
  currentMedianEndingBalance: 1850000,
  avgSpendingAmount: 78500,
  currentAvgSpendingAmount: 72000,
  currentAvgSpendingAmount: 72000,
  yearsShortage: 2,
  scenarioPath: 100,
  kpis: {
    savingsRate: 0.15,
    avgTaxRate: 0.22,
    avgSpendingRate: 0.654,
    taxDrag: 0.011,
  },
  portfolio: {
    projectionBands: {
      p10: [950000, 970000, 1010000, 1035000, 1100000, 1150000, 1180000, 1240000, 1290000, 1320000],
      p50: [950000, 995000, 1050000, 1130000, 1220000, 1320000, 1440000, 1570000, 1710000, 1850000],
      p90: [950000, 1030000, 1125000, 1260000, 1415000, 1590000, 1790000, 2010000, 2255000, 2510000],
    },
    currentLine: [950000, 980000, 1005000, 1040000, 1080000, 1110000, 1140000, 1170000, 1200000, 1230000],
  },
  allocation: {
    scenario: { equity: 0.58, fixedIncome: 0.37, cash: 0.05 },
    current: { equity: 0.62, fixedIncome: 0.33, cash: 0.05 },
    divScore: { scenario: 2.35, current: 2.18 },
    volatility: { scenario: 0.108, current: 0.112 },
  },
  econAssumptions: { avgReturn: 0.067, avgInflation: 0.023 },
  strategies: {
    rothConversions: {
      active: true,
      totalConverted: 120000,
      avgMarginalRate: 0.32,
      baselineMarginalRate: 0.28,
      schedule: [0, 30000, 30000, 30000, 30000, 0, 0, 0, 0, 0],
    },
    socialSecurity: {
      active: true,
      claimAgePrimary: 70,
      claimAgeSpouse: 67,
      annualBenefit: 42000,
      baselineAnnualBenefit: 36000,
    },
    adjustIncomeSources: { active: false, items: [] },
    spendingMethod: {
      active: true,
      method: "Guardrails",
      initialWithdraw: 60000,
      upper: 75000,
      lower: 45000,
    },
    withdrawalOrder: {
      active: true,
      order: ["Taxable", "Tax-Deferred", "Roth"],
      taxSaved: 18000,
    },
    additionalWithdrawals: {
      active: true,
      items: [
        { year: 2030, amount: 25000, purpose: "New roof" },
        { year: 2032, amount: 40000, purpose: "Wedding" },
      ],
    },
    adjustContributions: { active: false, items: [] },
  },
  settings: {
    lifeStages: {
      active: true,
      early: 0.9,
      mid: 0.8,
      late: 0.7,
      survivor: 0.75,
    },
    investmentFees: {
      active: true,
      bps: { scenario: 0.4, current: 0.55 },
      drag: 0.0015,
    },
  },
};

// ------------------------
// Helper functions
// ------------------------
const currency = (x: number) =>
  x.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const percent = (x: number, decimals = 1) => (x * 100).toFixed(decimals) + "%";

// ------------------------
// Info Tooltip Component
// ------------------------
const InfoTooltip: React.FC<{ content: string }> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <Info 
        className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help ml-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div className="absolute z-10 w-64 p-2 mt-1 text-xs bg-gray-800 text-white rounded-md shadow-lg -left-32">
          {content}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// ------------------------
// Basic reusable visuals
// ------------------------
const Gauge: React.FC<{ value: number }> = ({ value }) => {
  const chartData = [{ name: "success", value: value * 100, fill: "#22c55e" }];
  return (
    <ResponsiveContainer width={140} height={140}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={70}
        barSize={10}
        data={chartData}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar minAngle={15} background clockWise dataKey="value" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xl font-semibold"
        >
          {percent(value, 0)}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

const FanChart: React.FC = () => {
  const years = Array.from({ length: data.portfolio.projectionBands.p10.length }, (_, i) => i);
  const chart = years.map((year, idx) => ({
    year: 2024 + idx,
    p10: data.portfolio.projectionBands.p10[idx],
    p50: data.portfolio.projectionBands.p50[idx],
    p90: data.portfolio.projectionBands.p90[idx],
    current: data.portfolio.currentLine[idx],
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorP10" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => v / 1000000 + "M"} />
        <ReTooltip formatter={(v: number) => currency(v)} />
        <Area type="monotone" dataKey="p90" stroke="#93c5fd" fillOpacity={1} fill="url(#colorP90)" />
        <Area type="monotone" dataKey="p10" stroke="#bfdbfe" fillOpacity={1} fill="url(#colorP10)" />
        <Area type="monotone" dataKey="current" stroke="#1f2937" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const AllocationPie: React.FC<{ dataset: Record<string, number> }> = ({ dataset }) => {
  const pieData = Object.entries(dataset).map(([k, v]) => ({ name: k, value: v }));
  const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];
  return (
    <ResponsiveContainer width={220} height={220}>
      <PieChart>
        <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <ReTooltip formatter={(v: number, n: string) => [percent(v as number), n]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SideBySideBars: React.FC = () => {
  const barData = [
    {
      name: "Savings Rate",
      scenario: data.kpis.savingsRate,
      current: 0.13,
    },
    {
      name: "Avg Tax Rate",
      scenario: data.kpis.avgTaxRate,
      current: 0.24,
    },
    {
      name: "Avg Spending Rate",
      scenario: data.kpis.avgSpendingRate,
      current: 0.67,
    },
    {
      name: "Tax Drag",
      scenario: data.kpis.taxDrag,
      current: 0.012,
    },
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={barData}
        layout="vertical"
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => percent(v)} />
        <YAxis type="category" dataKey="name" width={150} />
        <Bar dataKey="scenario" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={12}>
          <LabelList dataKey="scenario" formatter={(v: number) => percent(v)} position="right" />
        </Bar>
        <Bar dataKey="current" fill="#9ca3af" radius={[4, 4, 4, 4]} barSize={12}>
          <LabelList dataKey="current" formatter={(v: number) => percent(v)} position="right" />
        </Bar>
        <ReTooltip formatter={(v: number) => percent(v)} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ------------------------
// New Strategy Components
// ------------------------
const StrategyChips: React.FC = () => {
  const chipData = [
    { id: "roth", name: "Roth Conversions", active: data.strategies.rothConversions.active },
    { id: "ss", name: "Social Security", active: data.strategies.socialSecurity.active },
    { id: "spending", name: "Spending Method", active: data.strategies.spendingMethod.active },
    { id: "wOrder", name: "Withdrawal Order", active: data.strategies.withdrawalOrder.active },
    { id: "addW", name: "Additional Withdrawals", active: data.strategies.additionalWithdrawals.active },
    { id: "lifeStages", name: "Life Stages", active: data.settings.lifeStages.active },
    { id: "fees", name: "Investment Fees", active: data.settings.investmentFees.active },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {chipData
        .filter((c) => c.active)
        .map((c) => (
          <Badge key={c.id} className="cursor-pointer select-none" variant="secondary">
            {c.name}
          </Badge>
        ))}
    </div>
  );
};

const RothCard: React.FC = () => {
  const s = data.strategies.rothConversions;
  if (!s.active) return null;
  const schedule = s.schedule.map((amt, idx) => ({ year: 2024 + idx, amount: amt }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roth Conversions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">Total Converted: {currency(s.totalConverted)}</p>
        <p className="text-sm mb-4">
          Avg Marginal Rate: {percent(s.avgMarginalRate)} (baseline {percent(s.baselineMarginalRate)})
        </p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={schedule} barSize={14}>
            <XAxis dataKey="year" hide />
            <YAxis hide />
            <Bar dataKey="amount" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const SocialSecurityCard: React.FC = () => {
  const s = data.strategies.socialSecurity;
  if (!s.active) return null;
  const chartData = [
    { name: "Scenario", value: s.annualBenefit },
    { name: "Baseline", value: s.baselineAnnualBenefit },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Security</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">
          Claim Ages: {s.claimAgePrimary} / {s.claimAgeSpouse}
        </p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} layout="vertical" barSize={16}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={70} />
            <Bar dataKey="value" fill="#60a5fa">
              <LabelList dataKey="value" formatter={(v: number) => currency(v)} position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const SpendingMethodCard: React.FC = () => {
  const s = data.strategies.spendingMethod;
  if (!s.active) return null;
  const plot = [
    { name: "Lower", value: s.lower },
    { name: "Initial", value: s.initialWithdraw },
    { name: "Upper", value: s.upper },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Method – {s.method}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={plot}>
            <XAxis dataKey="name" />
            <YAxis hide />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="linear" dataKey="value" stroke="#fbbf24" />
            <ReTooltip formatter={(v: number) => currency(v)} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const WithdrawalOrderCard: React.FC = () => {
  const s = data.strategies.withdrawalOrder;
  if (!s.active) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Order</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2 flex flex-wrap gap-1">
          {s.order.map((o) => (
            <Badge key={o}>{o}</Badge>
          ))}
        </p>
        <p className="text-sm">Tax Saved vs Baseline: {currency(s.taxSaved)}</p>
      </CardContent>
    </Card>
  );
};

const AdditionalWithdrawalsCard: React.FC = () => {
  const s = data.strategies.additionalWithdrawals;
  if (!s.active) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Withdrawals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        {s.items.map((it) => (
          <div key={it.year} className="flex justify-between">
            <span>{it.year} – {it.purpose}</span>
            <span>{currency(it.amount)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const LifeStagesCard: React.FC = () => {
  const s = data.settings.lifeStages;
  if (!s.active) return null;
  const segments = [
    { name: "Early", value: s.early, color: "#4ade80" },
    { name: "Mid", value: s.mid, color: "#38bdf8" },
    { name: "Late", value: s.late, color: "#a78bfa" },
    { name: "Survivor", value: s.survivor, color: "#f472b6" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Life Stages Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={segments} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} label={(d) => d.name}>
              {segments.map((seg, idx) => (
                <Cell key={idx} fill={seg.color} />
              ))}
            </Pie>
            <ReTooltip formatter={(v: number, n: string) => [percent(v), n]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const FeesCard: React.FC = () => {
  const s = data.settings.investmentFees;
  if (!s.active) return null;
  const pieData = [
    { name: "Scenario", value: s.bps.scenario },
    { name: "Current", value: s.bps.current },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Fees</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={(d) => d.name}>
              <Cell fill="#f87171" />
              <Cell fill="#9ca3af" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <p className="text-sm mt-2">Fee Drag: {percent(s.drag, 2)}</p>
      </CardContent>
    </Card>
  );
};

// ------------------------
// Accordion wrapper
// ------------------------
const StrategyAccordion: React.FC = () => {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen(!open);
  const anyActive = Object.values(data.strategies).some((v: any) => v.active) ||
                    Object.values(data.settings).some((v: any) => v.active);
  if (!anyActive) return null;
  return (
    <div className="border rounded-xl">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-t-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-semibold text-sm uppercase tracking-wide">Active Strategies & Settings</span>
        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {open && (
        <div className="p-4 space-y-6">
          <StrategyChips />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <RothCard />
            <SocialSecurityCard />
            <SpendingMethodCard />
            <WithdrawalOrderCard />
            <AdditionalWithdrawalsCard />
            <LifeStagesCard />
            <FeesCard />
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------------
// Executive Summary Component
// ------------------------
const ExecutiveSummary: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Plan Strengths
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-5">
              <li>• Success rate improves from 67% to 82%, exceeding 80% target</li>
              <li>• Median ending balance increases by {currency(data.medianEndingBalance - data.currentMedianEndingBalance)}</li>
              <li>• Annual spending capacity rises by {currency(data.avgSpendingAmount - data.currentAvgSpendingAmount)}</li>
              <li>• Diversified strategy approach optimizes outcomes</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Areas to Monitor
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-5">
              <li>• {data.yearsShortage} years with potential shortages</li>
              <li>• Market volatility could impact projections</li>
              <li>• Major expenses planned for 2030-2032</li>
              <li>• Social Security timing optimization critical</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ------------------------
// Key Insights Component
// ------------------------
const KeyInsights: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Key Insights & Interpretations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="p-3 bg-green-50 rounded-lg border-l-3 border-l-green-400">
            <h4 className="font-medium text-green-900 mb-1">Portfolio Growth Trajectory</h4>
            <p className="text-sm text-green-800">
              The fan chart shows your portfolio has a 90% probability of growing to at least $2.5M by 2033, 
              with a median projection of $1.85M. This provides substantial cushion above your spending needs.
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border-l-3 border-l-blue-400">
            <h4 className="font-medium text-blue-900 mb-1">Strategic Optimization Impact</h4>
            <p className="text-sm text-blue-800">
              Your active strategies are projected to improve outcomes significantly compared to baseline, 
              with Roth conversions and optimized Social Security timing adding substantial value.
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border-l-3 border-l-amber-400">
            <h4 className="font-medium text-amber-900 mb-1">Spending Flexibility</h4>
            <p className="text-sm text-amber-800">
              The guardrails approach allows spending between {currency(45000)} - {currency(75000)} annually, 
              providing flexibility to adjust based on market performance while maintaining plan success.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ------------------------
// Main Component
// ------------------------
const ScenarioComparisonDemo: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with Context */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Financial Plan Analysis</h1>
            <p className="text-gray-600">Moderate-Risk Scenario • Updated {new Date().toLocaleDateString()}</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            80% Success Target (20th percentile path)
          </Badge>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>What this means:</strong> This analysis compares your optimized retirement plan against your current approach across various market conditions. 
            An 80% success rate means your plan works in 8 out of 10 possible market scenarios over the next 30 years.
            The optimized scenario shows significant improvements in all key metrics compared to your current state.
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <ExecutiveSummary />

      {/* KPI Cards with Enhanced Explanations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Key Performance Indicators
          <InfoTooltip content="These metrics show how well your financial plan performs across different scenarios and time periods." />
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center justify-center bg-white">
            <CardContent className="p-4 flex flex-col items-center">
              <span className="text-sm mb-2 text-gray-600 flex items-center">
                Success Rate
                <InfoTooltip content="Percentage of scenarios where your plan meets spending goals without running out of money." />
              </span>
              <Gauge value={data.successRate} />
              <p className="text-xs text-center text-gray-500 mt-2">
                Target: 80%
              </p>
            </CardContent>
          </Card>
          <Card className="p-4 flex flex-col justify-center bg-white">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-sm font-normal text-gray-600 flex items-center">
                Median Ending Balance
                <InfoTooltip content="Expected portfolio value at the end of your plan in the middle scenario (50th percentile)." />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-semibold text-gray-900">
                {currency(data.medianEndingBalance)}
              </div>
              <p className="text-xs text-gray-500 mt-1">After 30 years</p>
            </CardContent>
          </Card>
          <Card className="p-4 flex flex-col justify-center bg-white">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-sm font-normal text-gray-600 flex items-center">
                Average Annual Spending
                <InfoTooltip content="Your typical yearly spending amount, adjusted for inflation throughout retirement." />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-semibold text-gray-900">
                {currency(data.avgSpendingAmount)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inflation-adjusted</p>
            </CardContent>
          </Card>
          <Card className="p-4 flex flex-col justify-center bg-white">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-sm font-normal text-gray-600 flex items-center">
                Years with Shortages
                <InfoTooltip content="Number of years where spending may need to be reduced below your target amount." />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-semibold flex items-center gap-1 text-gray-900">
                {data.yearsShortage}
                {data.yearsShortage === 0 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Out of 30 years</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Analysis & Portfolio Projection */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                Key Financial Ratios
                <InfoTooltip content="Comparison of your optimized scenario (blue) versus current approach (gray) across key financial metrics." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SideBySideBars />
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>Optimized Scenario
                  <span className="inline-block w-3 h-3 bg-gray-400 rounded mr-2 ml-4"></span>Current Approach
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                Portfolio Growth Projection
                <InfoTooltip content="Shows potential portfolio values over time. The shaded area represents the range of possible outcomes, with darker shading showing more likely results." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FanChart />
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="w-4 h-2 bg-blue-200 mx-auto mb-1"></div>
                  <span className="text-gray-600">10th percentile</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-2 bg-blue-400 mx-auto mb-1"></div>
                  <span className="text-gray-600">50th percentile</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-2 bg-gray-800 mx-auto mb-1"></div>
                  <span className="text-gray-600">Your current path</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Allocation & Economic Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              Asset Allocation Comparison
              <InfoTooltip content="Your optimized portfolio allocation compared to your current allocation, showing risk-adjusted diversification." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around">
              <div className="flex flex-col items-center">
                <span className="text-sm mb-1 text-gray-600 font-medium">Optimized Scenario</span>
                <AllocationPie dataset={data.allocation.scenario} />
                <div className="text-xs mt-2 text-gray-500 text-center">
                  <div>Diversification Score: {data.allocation.divScore.scenario}</div>
                  <div>Volatility: {percent(data.allocation.volatility.scenario)}</div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm mb-1 text-gray-600 font-medium">Current Allocation</span>
                <AllocationPie dataset={data.allocation.current} />
                <div className="text-xs mt-2 text-gray-500 text-center">
                  <div>Diversification Score: {data.allocation.divScore.current}</div>
                  <div>Volatility: {percent(data.allocation.volatility.current)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              Economic Assumptions
              <InfoTooltip content="The long-term economic assumptions used in your retirement projections, based on historical data and expert forecasts." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{percent(data.econAssumptions.avgReturn)}</div>
                  <div className="text-sm text-green-600">Average Annual Return</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{percent(data.econAssumptions.avgInflation)}</div>
                  <div className="text-sm text-blue-600">Average Inflation</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Analysis based on Monte Carlo simulation</div>
                <div>• Scenario Path Index: {data.scenarioPath}</div>
                <div>• 1,000 market scenarios tested</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <KeyInsights />

      {/* Strategy Details Accordion */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Implementation Strategies
          <InfoTooltip content="Specific tactics and settings used to optimize your financial plan. These strategies work together to improve your success rate." />
        </h2>
        <StrategyAccordion />
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <CheckCircle2 className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Immediate Actions</h4>
              <ul className="text-sm space-y-1 text-green-800">
                <li>1. Review and approve asset allocation changes</li>
                <li>2. Set up Roth conversion schedule for next year</li>
                <li>3. Confirm Social Security claiming strategy</li>
                <li>4. Update beneficiary designations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Ongoing Monitoring</h4>
              <ul className="text-sm space-y-1 text-green-800">
                <li>• Quarterly portfolio rebalancing</li>
                <li>• Annual plan review and updates</li>
                <li>• Monitor tax law changes</li>
                <li>• Track spending against guardrails</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioComparisonDemo;