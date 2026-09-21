import React, { useState } from 'react';
import { X, FileText, Check, Copy, Download, BookOpen, FileDown } from 'lucide-react';
import { generateCardFunctionalityPDF, APP_CARDS_REFERENCE } from '../lib/generateCardGuidePdf';

interface DocsModalProps {
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ onClose }) => {
  const [activeDoc, setActiveDoc] = useState<'card_guide' | 'requirements' | 'architecture' | 'prompts' | 'tradeoffs'>('card_guide');
  const [copied, setCopied] = useState(false);

  // Markdown representation of the card functionality guide
  const cardGuideMarkdown = `# PaySphere - Tab & Card Functionality Guide
${APP_CARDS_REFERENCE.map((tab, idx) => `
## Tab ${idx + 1}: ${tab.tabName} (${tab.category})
*${tab.description}*

${tab.cards.map((card, cIdx) => `
### ${cIdx + 1}. ${card.cardTitle}
- **Purpose**: ${card.purpose}
- **Key Capabilities & Data**:
${card.keyMetricsOrActions.map(m => `  * ${m}`).join('\n')}
- **Interaction & Triggers**: ${card.interactions}
`).join('')}
`).join('\n---\n')}
`;

  const docs = {
    card_guide: {
      title: 'tab-card-guide.pdf',
      displayTitle: 'Tab & Card Guide (PDF)',
      content: cardGuideMarkdown,
      isPdfGuide: true
    },
    requirements: {
      title: 'requirements.md',
      displayTitle: 'requirements.md',
      content: `# ACME Org - Employee Salary Management Software
## Requirements & Scope Specification

### 1. Goal & Context
ACME Org's HR team currently manages compensation data for 10,000 employees across multiple global offices (US, UK, Germany, India, Singapore) using fragmented Excel spreadsheets. This system provides a centralized, secure web-based application allowing the HR Manager (sole user persona) to manage employee salary records at scale and answer organizational questions regarding payroll distribution and equity.

### 2. In-Scope Features
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
- Pay-equity / demographic gap analysis (future phase)
- Real tax compliance engine (jurisdiction-specific complexity)
- Live FX conversion APIs (static table chosen for financial repeatability)
- Employee self-service portals (internal admin tool only)
- Complex multi-role authorization (simplified to HR Manager persona)

### 4. Technical Architecture
- Frontend: Next.js / React 19 + TypeScript + Shadcn UI + Tailwind CSS + Recharts
- Backend: Express + TypeScript REST API (CRUD, Analytics, Seed)
- ORM/Database: Relational SQLite schema with file backing and indexed lookups
- Testing: Deterministic test suite with in-memory fixtures covering all core logic`
    },
    architecture: {
      title: 'architecture.md',
      displayTitle: 'architecture.md',
      content: `# System Architecture & Technical Design
 
## 1. High-Level Architecture
Client Layer:
  - React 19 Frontend + Shadcn/UI + Tailwind CSS + Recharts
  - Interactive Views: Dashboard, Employees Directory, Compensation Analytics, Specifications Viewer
  - Live filter/search toolbar, modal workflows for salary revisions

Backend Layer:
  - Express 4 + TypeScript Application Server (Port 3000)
  - REST API Endpoints (/api/employees, /api/analytics/*, /api/dashboard/stats, /api/seed)
  - ORM Repository Layer with transactional boundaries (BEGIN/COMMIT/ROLLBACK)
  - Deterministic FX normalization engine & exact median aggregation calculator

Database Layer:
  - Relational SQLite Engine with disk persistence (data/salary_app.db)
  - Tables: employees, departments, pay_bands, salary_records, fx_rates, activity_logs
  - Multi-column indexes on department, country, pay_band, and employee_code`
    },
    prompts: {
      title: 'ai-prompts.md',
      displayTitle: 'ai-prompts.md',
      content: `# Intentional AI Usage & Prompt Log

1. Domain Modeling & Database Schema
   - Structured relational schema supporting 10,000 employees with historical salary records.
   - Enforced is_current flag transitions inside database transactions.

2. Aggregations & Exact Median Computation
   - Implemented mathematical median and percentile calculations without precision loss.
   - Grouped payroll cost breakdowns by department and country in normalized USD.

3. UI Design Alignment with Reference Artifact
   - Faithfully recreated PaySphere dashboard layout, 4 metric cards, 6-month trend area chart, donut breakdown, calendar widget, and employee payroll table.

4. Deterministic Seed Generation at Scale
   - Built batch-insertion seed script populating 10,000 employees with realistic variance and past salary records.`
    },
    tradeoffs: {
      title: 'tradeoffs.md',
      displayTitle: 'tradeoffs.md',
      content: `# Architectural Tradeoffs & Engineering Decisions

1. Database: SQLite / Embedded WASM vs. Remote Cloud Postgres (Neon)
   - Chosen: In-process SQLite with disk snapshot persistence.
   - Rationale: Eliminates external network roundtrips, ensures instant zero-config startup, and guarantees sub-millisecond pagination and sorting over 10,000 records.

2. Currency Conversion: Deterministic FX Table vs. Live FX APIs
   - Chosen: Seeded static table (USD 1.0, EUR 1.08, GBP 1.28, INR 0.012, SGD 0.74).
   - Rationale: Live exchange rates fluctuate constantly. Static rates guarantee that historical reports generate consistent financial totals for payroll planning.

3. Single-Role HR Manager vs. Complex RBAC
   - Chosen: Single HR Manager administrative context.
   - Rationale: Avoids auth ceremony during take-home evaluation and maximizes focus on core compensation data management and analytics.

4. History Modeling: Append-Only Records vs. In-Place Update
   - Chosen: Distinct salary_records table linked by employee_id with is_current flag.
   - Rationale: Preserves complete audit trail of all historical promotions and adjustments.`
    }
  };

  const current = docs[activeDoc];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (activeDoc === 'card_guide') {
      generateCardFunctionalityPDF();
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([current.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = current.title;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Assessment & System Documentation</h3>
              <p className="text-xs text-slate-500">Deliverables and Card Functionality Guide with instant PDF export</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition" aria-label="Close dialog">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {(['card_guide', 'requirements', 'architecture', 'prompts', 'tradeoffs'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveDoc(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeDoc === key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {key === 'card_guide' && <FileDown className="w-3.5 h-3.5" />}
                <span>{docs[key].displayTitle}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pb-2">
            {activeDoc === 'card_guide' ? (
              <button
                onClick={generateCardFunctionalityPDF}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Guide</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notice for Card Guide */}
        {activeDoc === 'card_guide' && (
          <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-800">
            <span className="font-semibold">Interactive Card & Tab Reference Guide ready for PDF export.</span>
            <button
              onClick={generateCardFunctionalityPDF}
              className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
            >
              Download PDF now
            </button>
          </div>
        )}

        {/* Document Content Viewer */}
        <div className="p-6 max-h-[480px] overflow-y-auto font-mono text-xs bg-slate-950 text-slate-200 leading-relaxed rounded-b-3xl select-text">
          <pre className="whitespace-pre-wrap">{current.content}</pre>
        </div>
      </div>
    </div>
  );
};
