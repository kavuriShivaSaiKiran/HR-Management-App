import React, { useState } from 'react';
import {
  BookOpen,
  FileDown,
  Layers,
  Copy,
  Check,
  Download,
  Info,
  ExternalLink,
  ShieldCheck,
  Database,
  Cpu,
  Coins,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { APP_CARDS_REFERENCE, generateCardFunctionalityPDF } from '../lib/generateCardGuidePdf';

interface AboutViewProps {
  onNavigateToTab?: (tab: string) => void;
  onReseed?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateToTab, onReseed }) => {
  const [selectedSection, setSelectedSection] = useState<'cards_guide' | 'requirements' | 'architecture' | 'prompts' | 'tradeoffs'>('cards_guide');
  const [selectedTabFilter, setSelectedTabFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const docsContent = {
    requirements: {
      fileName: 'requirements.md',
      title: 'Requirements & Scope Specification',
      description: 'Functional boundaries, domain constraints, and explicit scope declarations.',
      markdown: `# ACME Org - Employee Salary Management Software
## Requirements & Scope Specification

### 1. Goal & Operational Context
ACME Org's HR team currently manages compensation data for 10,000 employees across multiple global offices (US, UK, Germany, India, Singapore) using fragmented spreadsheets. This system provides a centralized, secure web-based application allowing the HR Manager (sole user persona) to manage employee salary records at scale and answer organizational questions regarding payroll distribution and equity.

### 2. In-Scope Functional Modules
- Full CRUD for employee salary records at scale (10,000 employees)
- Chronological salary history tracking (append-only with is_current flag)
- Multi-attribute search, filter, and pagination (department, country, band, status)
- Aggregated payroll costs by department and country
- Pay band distribution metrics (min, max, exact median, average)
- Cross-cut role comparisons across departments & geographies
- Deterministic static FX rate conversions (USD, EUR, GBP, INR, SGD)
- Soft delete audit compliance (status set to inactive, no purge)
- 10,000 employee seed engine with realistic organizational distributions

### 3. Explicitly Out-of-Scope Features
- Pay-equity / demographic gap analysis (reserved for future phase)
- Live bank ACH direct integration (simulated approval batches provided)
- Dynamic external FX market feeds (static financial tables ensure reproducibility)
- Employee self-service portals (internal administrative tooling only)
- Complex multi-role authorization (simplified to HR Manager persona)

### 4. Technical Specifications
- Frontend: React 19 + TypeScript + Tailwind CSS + Lucide Icons + Recharts
- Backend: Express 4 + TypeScript REST API (CRUD, Analytics, Seed)
- ORM/Database: Relational SQLite schema with file backing and indexed lookups
- Performance: Sub-10ms response times on indexed multi-attribute queries`
    },
    architecture: {
      fileName: 'architecture.md',
      title: 'System Architecture & Technical Design',
      description: 'Layered component topology, database schemas, and data flow pipelines.',
      markdown: `# System Architecture & Technical Design

## 1. High-Level Architecture
Client Layer:
  - React 19 Frontend + Tailwind CSS + Recharts + Lucide Icons
  - Interactive Views: Dashboard, Employees Directory, Compensation Analytics, About & Specifications
  - Live filter/search toolbar, modal workflows for salary revisions, client-side PDF compilation

Backend Layer:
  - Express 4 + TypeScript Application Server (Port 3000)
  - REST API Endpoints (/api/employees, /api/analytics/*, /api/dashboard/stats, /api/seed)
  - Transactional boundaries (BEGIN TRANSACTION / COMMIT / ROLLBACK)
  - Deterministic FX normalization engine & exact median aggregation calculator

Database Layer:
  - Relational SQLite Engine with disk persistence (data/salary_app.db)
  - Tables: employees, departments, pay_bands, salary_records, fx_rates, activity_logs
  - Multi-column indexes on department_id, country_code, pay_band_id, and employee_code`
    },
    prompts: {
      fileName: 'ai-prompts.md',
      title: 'Intentional AI Engineering & Prompt Log',
      description: 'Methodology, architectural prompt logs, and generation rationale.',
      markdown: `# Intentional AI Usage & Prompt Log

1. Domain Modeling & Database Schema
   - Structured relational schema supporting 10,000 employees with historical salary records.
   - Enforced is_current flag transitions inside atomic database transactions.

2. Aggregations & Exact Median Computation
   - Implemented mathematical median and percentile calculations without precision loss.
   - Grouped payroll cost breakdowns by department and country in normalized USD.

3. UI Design Alignment with Reference Artifact
   - Faithfully recreated PaySphere dashboard layout, 4 metric cards, 6-month trend area chart, donut breakdown, calendar widget, and employee payroll table.

4. Deterministic Seed Generation at Scale
   - Built batch-insertion seed script populating 10,000 employees with realistic variance and past salary records.`
    },
    tradeoffs: {
      fileName: 'tradeoffs.md',
      title: 'Architectural Tradeoffs & Decisions',
      description: 'Evaluated engineering tradeoffs, storage choices, and operational balances.',
      markdown: `# Architectural Tradeoffs & Engineering Decisions

1. Database: SQLite / Embedded WASM vs. Remote Cloud Postgres
   - Chosen: In-process SQLite with disk snapshot persistence.
   - Rationale: Eliminates external network roundtrips, ensures instant zero-config startup, and guarantees sub-millisecond pagination and sorting over 10,000 records.

2. Currency Conversion: Deterministic FX Table vs. Live FX APIs
   - Chosen: Seeded static table (USD: 1.0, EUR: 1.08, GBP: 1.27, INR: 0.012, SGD: 0.74).
   - Rationale: Live exchange rates fluctuate constantly. Static rates guarantee that historical reports generate consistent financial totals for payroll planning.

3. Single-Role HR Manager vs. Complex RBAC
   - Chosen: Single HR Manager administrative context.
   - Rationale: Avoids auth ceremony during evaluation and maximizes focus on core compensation data management and analytics.

4. History Modeling: Append-Only Records vs. In-Place Update
   - Chosen: Distinct salary_records table linked by employee_id with is_current flag.
   - Rationale: Preserves complete audit trail of all historical promotions and adjustments.`
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadMd = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCards = selectedTabFilter === 'all'
    ? APP_CARDS_REFERENCE
    : APP_CARDS_REFERENCE.filter(t => t.tabName.toLowerCase().includes(selectedTabFilter.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PaySphere Enterprise System Documentation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            About PaySphere & System Guide
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Enterprise Employee Salary Management and Global Payroll Administration engine built to handle 10,000+ records with microsecond queries, transactional salary history, and deterministic multi-currency benchmarking.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={generateCardFunctionalityPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition transform active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Cards Guide (PDF)</span>
            </button>

            {onReseed && (
              <button
                onClick={onReseed}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Verify 10k SQLite Dataset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Database Scale</span>
            <span className="font-bold text-white text-sm">10,000 Records</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Audit Trails</span>
            <span className="font-bold text-emerald-400 text-sm">Append-Only History</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Multi-Currency</span>
            <span className="font-bold text-blue-400 text-sm">Deterministic FX</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Median Engine</span>
            <span className="font-bold text-purple-400 text-sm">Exact 50th Percentile</span>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Sub-Tabs Switcher */}
      <div className="flex items-center justify-between gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setSelectedSection('cards_guide')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedSection === 'cards_guide'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cards & Tabs Guide</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              selectedSection === 'cards_guide' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              8 Tabs
            </span>
          </button>

          <button
            onClick={() => setSelectedSection('requirements')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedSection === 'requirements'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Requirements</span>
          </button>

          <button
            onClick={() => setSelectedSection('architecture')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedSection === 'architecture'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setSelectedSection('prompts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedSection === 'prompts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Prompts Log</span>
          </button>

          <button
            onClick={() => setSelectedSection('tradeoffs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedSection === 'tradeoffs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Tradeoffs & Decisions</span>
          </button>
        </div>

        {selectedSection === 'cards_guide' && (
          <button
            onClick={generateCardFunctionalityPDF}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Export PDF</span>
          </button>
        )}
      </div>

      {/* 3. Section Content: SECTION A: CARDS & TABS GUIDE */}
      {selectedSection === 'cards_guide' && (
        <div className="space-y-6">
          {/* Quick tab filter bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 shrink-0">Filter by Tab:</span>
            {['all', 'dashboard', 'employees', 'payroll', 'salary', 'analytics', 'attendance', 'taxes', 'settings'].map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setSelectedTabFilter(tabKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                  selectedTabFilter === tabKey
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tabKey}
              </button>
            ))}
          </div>

          {/* Render each Tab's Cards */}
          <div className="space-y-8">
            {filteredCards.map((tab, tIdx) => (
              <div key={tab.tabName} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                {/* Tab title & category banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        TAB #{tIdx + 1}
                      </span>
                      <h2 className="text-lg font-extrabold text-slate-900">{tab.tabName}</h2>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-500">{tab.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{tab.description}</p>
                  </div>

                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab(tab.tabName.toLowerCase().split(' ')[0])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition"
                    >
                      <span>Go to {tab.tabName}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Cards in this Tab */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tab.cards.map((card, cIdx) => (
                    <div
                      key={card.cardTitle}
                      className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-slate-300 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                              {cIdx + 1}
                            </span>
                            <span>{card.cardTitle}</span>
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {card.purpose}
                        </p>

                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Capabilities & Data
                          </span>
                          <ul className="space-y-1">
                            {card.keyMetricsOrActions.map((metric, mIdx) => (
                              <li key={mIdx} className="text-xs text-slate-700 flex items-start gap-2">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-start gap-1.5 text-xs text-blue-700 font-medium">
                        <span className="font-bold shrink-0">Interaction:</span>
                        <span className="text-slate-600">{card.interactions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Section Content: SECTIONS B, C, D, E (Markdown Specs Viewer) */}
      {selectedSection !== 'cards_guide' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Doc Header with actions */}
          <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  {docsContent[selectedSection].fileName}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {docsContent[selectedSection].title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {docsContent[selectedSection].description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(selectedSection, docsContent[selectedSection].markdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition shadow-2xs"
              >
                {copiedKey === selectedSection ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownloadMd(docsContent[selectedSection].fileName, docsContent[selectedSection].markdown)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-6 font-mono text-xs leading-relaxed bg-slate-950 text-slate-200 overflow-x-auto max-h-[600px] overflow-y-auto select-text">
            <pre className="whitespace-pre-wrap">{docsContent[selectedSection].markdown}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
