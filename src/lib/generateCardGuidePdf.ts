import { jsPDF } from 'jspdf';

export interface TabCardGuide {
  tabName: string;
  category: string;
  description: string;
  cards: {
    cardTitle: string;
    purpose: string;
    keyMetricsOrActions: string[];
    interactions: string;
  }[];
}

export const APP_CARDS_REFERENCE: TabCardGuide[] = [
  {
    tabName: 'Dashboard',
    category: 'Executive Summary & Operations',
    description: 'Central operations hub providing top-level payroll health, employee headcounts, dynamic charts, and pending action queues.',
    cards: [
      {
        cardTitle: 'Metric KPI Cards (Top Row)',
        purpose: 'Displays high-level operational statistics: Total Employees, Monthly Payroll, Average Salary, and Active Headcount.',
        keyMetricsOrActions: [
          'Total Employees count with active vs inactive split',
          'Normalized monthly payroll expenditure in USD',
          'Organization-wide average annual base salary',
          'Dynamic monthly growth percentages with status trends'
        ],
        interactions: 'Clicking any KPI card jumps directly to the filtered employee table or analytics breakdown.'
      },
      {
        cardTitle: 'Payroll Distribution & Expense Breakdown Chart',
        purpose: 'Interactive visual bar and area charts breaking down global payroll spend across Engineering, Product, Sales, Marketing, and Operations.',
        keyMetricsOrActions: [
          'Department-level monthly burn rate',
          'Comparative historical spend by pay period',
          'Interactive tooltips revealing exact currency allocations'
        ],
        interactions: 'Hover over bars for exact dollar breakdowns; toggle department legends on and off.'
      },
      {
        cardTitle: 'Pending Salary Revisions / Quick Actions Card',
        purpose: 'Highlights pending approvals, recent salary changes, upcoming review cycles, and quick shortcuts to run payroll.',
        keyMetricsOrActions: [
          'Run Payroll one-click simulation trigger',
          'CSV / Audit Report export button',
          'Quick filter buttons for review cycles'
        ],
        interactions: 'Click "Run Payroll" to simulate disbursement batch or "Export" to download raw data.'
      },
      {
        cardTitle: 'Employee Payroll Table & Pagination Card',
        purpose: 'Live preview of the most recent employee payroll records with monthly gross, net pay calculations, and pay dates.',
        keyMetricsOrActions: [
          'Employee profile badge with role and department',
          'Gross compensation, statutory deductions, and net payout',
          'Payment status badge (Disbursed, Pending, Processing)'
        ],
        interactions: 'Click any employee row to open the complete Profile & Compensation History modal; use pagination controls to cycle pages.'
      }
    ]
  },
  {
    tabName: 'Employees Directory',
    category: 'Workforce & Headcount Management',
    description: 'Comprehensive directory designed for 10,000+ employee records with multi-attribute filtering, search, and full CRUD workflows.',
    cards: [
      {
        cardTitle: 'Directory Search & Filter Drawer Card',
        purpose: 'Multi-parameter query bar to filter employees across Department, Country, Pay Band, and Employment Status.',
        keyMetricsOrActions: [
          'Real-time text query by name, email, or employee code',
          'Department selector (Engineering, Product, Marketing, etc.)',
          'Country selector (US, UK, Germany, India, Singapore)',
          'Pay band rank filter (L1 Associate through L7 Executive)'
        ],
        interactions: 'Instant sub-second debounce filtering; "Reset Filters" restores global view.'
      },
      {
        cardTitle: 'Employee Grid / Data Table Card',
        purpose: 'Responsive tabular and card-based workforce view displaying employee identities, roles, locations, compensation, and statuses.',
        keyMetricsOrActions: [
          'Name, avatar, role, and department tags',
          'Country flag & local currency salary badge',
          'Normalized USD equivalent for multi-currency benchmarking',
          'Action dropdowns (View Profile, Revise Salary, Mark Inactive)'
        ],
        interactions: 'Click row/card to open detail dialog; click column headers to sort ascending/descending.'
      },
      {
        cardTitle: 'Employee Detail & Salary History Drawer Modal',
        purpose: 'Deep-dive profile displaying biographical data, organizational positioning, and an immutable chronological audit trail of all compensation revisions.',
        keyMetricsOrActions: [
          'Employee ID, hire date, and tenure counter',
          'Current base salary, pay band tier, and currency code',
          'Chronological revisions list: effective date, old vs new salary, percentage change, and reason'
        ],
        interactions: 'Launch "Adjust Salary" to append a revision or "Deactivate Employee" for soft-delete audit compliance.'
      },
      {
        cardTitle: 'Add Employee Onboarding Card Modal',
        purpose: 'Streamlined form to onboard new employees with automatic code generation and initial compensation setup.',
        keyMetricsOrActions: [
          'First name, last name, corporate email',
          'Department, role title, country, and hire date',
          'Pay band selection with guided min/max salary boundaries'
        ],
        interactions: 'Validates input fields, persists record to SQLite, and updates global headcount KPIs immediately.'
      }
    ]
  },
  {
    tabName: 'Payroll Management',
    category: 'Disbursement & Compensation Operations',
    description: 'Operational payroll console to preview pay periods, calculate net deductions, and disburse company-wide batches.',
    cards: [
      {
        cardTitle: 'Payroll Cycle Overview & Summary Card',
        purpose: 'Displays active cycle dates (e.g. May 1 - May 31), payment deadline countdown, and estimated total disbursement volume.',
        keyMetricsOrActions: [
          'Current cycle period and payment execution date',
          'Gross payroll volume vs Net payable volume',
          'Employer taxes and statutory benefit withholdings'
        ],
        interactions: 'Trigger "Execute Payroll Run" to simulate banking transfer lock and generate disbursement receipts.'
      },
      {
        cardTitle: 'Disbursement Queue & Approval Card',
        purpose: 'List of all employee pay slips queued for batch execution with deduction checks and anomalous variance flags.',
        keyMetricsOrActions: [
          'Employee name, bank account identifier / payment mode',
          'Base pay, overtime / bonus allowances, deductions (12% tax/benefits)',
          'Net pay in local currency and USD normalized equivalent'
        ],
        interactions: 'Approve individual payouts, hold questionable slips, or trigger batch bulk disbursement.'
      },
      {
        cardTitle: 'Recent Payroll Batches & Historical Runs Card',
        purpose: 'Archive of previous payroll batches with execution timestamps, transaction counts, and downloadable CSV/PDF ledgers.',
        keyMetricsOrActions: [
          'Batch identifier and date of disbursement',
          'Success rate percentage and total transfer amount',
          'Download bank reconciliation report'
        ],
        interactions: 'Click "Download Ledger" to extract financial CSV files for accounting systems.'
      }
    ]
  },
  {
    tabName: 'Salary & Compensation',
    category: 'Pay Bands & Equity Architecture',
    description: 'Structured compensation management governing pay bands, leveling frameworks, and promotion revision history.',
    cards: [
      {
        cardTitle: 'Organizational Pay Band Structure Card',
        purpose: 'Displays salary ranges, minimums, midpoints, and maximums across all levels (L1 Associate to L7 Executive).',
        keyMetricsOrActions: [
          'Level band name and designated role tier',
          'Minimum, median, and maximum salary limits per country',
          'Employee headcount distributed within each band'
        ],
        interactions: 'Inspect salary band limits to ensure competitive market positioning and equity compliance.'
      },
      {
        cardTitle: 'Comp-Ratio & Market Equity Metric Card',
        purpose: 'Calculates the distribution of employee salaries relative to pay band midpoints to identify underpaid or over-band anomalies.',
        keyMetricsOrActions: [
          'Comp-ratio distribution (<0.80 below range, 0.80-1.20 target, >1.20 above)',
          'Band penetration percentages across departments',
          'Alert tags for out-of-band exceptions'
        ],
        interactions: 'Filter to view only out-of-band employees for promotion or equity review.'
      },
      {
        cardTitle: 'Record Salary Revision Modal Card',
        purpose: 'Formal transaction dialog to append a new salary record with audit metadata, effective dates, and justification notes.',
        keyMetricsOrActions: [
          'Current salary vs Proposed new salary',
          'Automated percentage increase / decrease calculation',
          'Revision reason (Annual Merit Review, Promotion, Market Adjustment, Retention)',
          'Effective change date'
        ],
        interactions: 'Enforces transactional commit in SQLite, updating the current salary and preserving the previous record in history.'
      }
    ]
  },
  {
    tabName: 'Analytics & Reports',
    category: 'Organizational Intelligence & Benchmarking',
    description: 'Advanced analytics engine computing exact medians, currency-normalized metrics, and cross-department role comparisons.',
    cards: [
      {
        cardTitle: 'Payroll Spend by Department Card',
        purpose: 'Categorized breakdown of total compensation budget across all business divisions.',
        keyMetricsOrActions: [
          'Total annual & monthly spend per department',
          'Percentage of total organizational compensation budget',
          'Department headcount and average compensation per employee'
        ],
        interactions: 'Sort by total expenditure or head count; click to inspect individual department distribution.'
      },
      {
        cardTitle: 'Geographic Compensation & FX Normalization Card',
        purpose: 'Analyzes international compensation across US, UK, Germany, India, and Singapore converted to USD via static financial rates.',
        keyMetricsOrActions: [
          'Country-by-country headcount and average salary in local vs USD',
          'Static FX rates applied (EUR: 1.08, GBP: 1.27, INR: 0.012, SGD: 0.74)',
          'Cross-border purchasing power benchmarks'
        ],
        interactions: 'Toggle between Local Currency view and USD Normalized view.'
      },
      {
        cardTitle: 'Statistical Pay Band Metrics Card (Min / Median / Max)',
        purpose: 'Calculates true statistical metrics (minimum, exact 50th percentile median, and maximum) for each pay band.',
        keyMetricsOrActions: [
          'Exact median salary (bypassing simple averages to prevent outlier skew)',
          'Spread difference between 10th and 90th percentile',
          'Box-plot style variance indicator'
        ],
        interactions: 'Compare band limits against real current salaries to detect salary compression.'
      },
      {
        cardTitle: 'Cross-Department Role Salary Comparison Card',
        purpose: 'Enables cross-cutting analysis of common roles (e.g. Senior Manager, Staff Engineer) across different divisions.',
        keyMetricsOrActions: [
          'Comparison of median salary for the same role title across departments',
          'Salary variance percentage between engineering and commercial divisions',
          'Headcount distribution per role'
        ],
        interactions: 'Select role from dropdown to run instant comparative analysis.'
      }
    ]
  },
  {
    tabName: 'Attendance & Leave',
    category: 'Time & Work Log Tracking',
    description: 'Monitors employee attendance logs, billable work hours, paid time off (PTO), and sick leave impacts on payroll.',
    cards: [
      {
        cardTitle: 'Monthly Attendance & Working Days Card',
        purpose: 'Tracks total expected working days versus actual employee attendance across global hubs.',
        keyMetricsOrActions: [
          'Overall organization attendance rate percentage',
          'Average billable days per month (21 - 23 business days)',
          'Overtime hours logged eligible for bonus compensation'
        ],
        interactions: 'Filter attendance rates by regional office and holiday calendar.'
      },
      {
        cardTitle: 'PTO, Sick Leave & Unpaid Time Off Summary Card',
        purpose: 'Visual breakdown of approved leaves and unpaid absences that trigger prorated payroll deductions.',
        keyMetricsOrActions: [
          'Total PTO balance consumed vs remaining',
          'Unpaid leave days flagged for payroll proration',
          'Pending leave approval requests'
        ],
        interactions: 'Sync leave deductions directly to the next upcoming payroll run.'
      }
    ]
  },
  {
    tabName: 'Taxes & Compliance',
    category: 'Statutory Withholding & Regulatory Audit',
    description: 'Centralized overview of tax brackets, jurisdictional withholdings, social security contributions, and compliance filing dates.',
    cards: [
      {
        cardTitle: 'Tax Withholding by Country Card',
        purpose: 'Summarizes payroll tax liabilities and deductions across IRS (US), HMRC (UK), Finanzamt (DE), CBDT (IN), and IRAS (SG).',
        keyMetricsOrActions: [
          'Total employer tax liability vs employee withholding',
          'Average effective tax deduction rate (12% - 28%)',
          'Upcoming statutory tax filing deadlines'
        ],
        interactions: 'View regional tax schedules and export tax preparation packets.'
      },
      {
        cardTitle: 'Audit Compliance & Soft-Delete Log Card',
        purpose: 'Maintains an immutable compliance log of employee status transitions and compensation modifications.',
        keyMetricsOrActions: [
          'Inactive employee records retained for regulatory audit (zero data purge)',
          'Timestamped change logs with author identity and justification',
          'SOC-2 / GDPR compliance status check'
        ],
        interactions: 'Search audit records by employee ID or modification timestamp.'
      }
    ]
  },
  {
    tabName: 'System Settings & Scale Engine',
    category: 'Configuration & Scale Simulation',
    description: 'System-level preferences, currency definitions, and the 10,000-employee realistic scale generator.',
    cards: [
      {
        cardTitle: '10,000 Employee Seed & Reset Engine Card',
        purpose: 'High-performance synthetic generator that provisions 10,000 realistic employee records with salary histories and authentic distributions.',
        keyMetricsOrActions: [
          'Database record count (10,000 employees, 15,000+ salary events)',
          'Execution timer and indexing verification benchmark',
          '"Reseed 10k Dataset" one-click button'
        ],
        interactions: 'Click to rebuild the SQLite database with fresh, realistic synthetic data in under 2 seconds.'
      },
      {
        cardTitle: 'Currency & Exchange Rate Table Card',
        purpose: 'Configures deterministic FX conversion rates for predictable, repeatable multi-currency financial accounting.',
        keyMetricsOrActions: [
          'USD Base Currency anchor',
          'Exchange rates: EUR (1.08), GBP (1.27), INR (0.012), SGD (0.74)',
          'Last rate verification timestamp'
        ],
        interactions: 'Audit conversion ratios applied across all analytical reports and payroll calculations.'
      }
    ]
  }
];

export function generateCardFunctionalityPDF(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.text('PaySphere - System Card Functionality & Tab Reference Guide', margin, y);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  };

  // --- Title Page Header ---
  drawPageHeader();

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Tab & Card Functionality Guide', margin, y);
  y += 7;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text('Comprehensive architectural and operational manual for every card and widget in PaySphere.', margin, y);
  y += 10;

  // Overview box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text('Document Scope & Purpose', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const overviewText = 'This guide provides a detailed operational breakdown of every functional card, chart widget, and interactive drawer across all tabs in the PaySphere Employee Salary Management system (10,000 employee scale).';
  const splitOverview = doc.splitTextToSize(overviewText, contentWidth - 8);
  doc.text(splitOverview, margin + 4, y + 12);
  y += 28;

  // Loop through tabs
  APP_CARDS_REFERENCE.forEach((tab, tabIdx) => {
    // Check space for tab header
    checkPageBreak(30);

    // Tab Header Banner
    doc.setFillColor(37, 99, 235); // blue-600
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`Tab ${tabIdx + 1}: ${tab.tabName.toUpperCase()} — ${tab.category}`, margin + 4, y + 6.8);
    y += 14;

    // Tab description
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const descLines = doc.splitTextToSize(tab.description, contentWidth);
    doc.text(descLines, margin, y);
    y += (descLines.length * 4.2) + 4;

    // Cards in Tab
    tab.cards.forEach((card, cardIdx) => {
      // Calculate estimated height
      const titleHeight = 6;
      const purposeLines = doc.splitTextToSize(card.purpose, contentWidth - 8);
      const purposeHeight = purposeLines.length * 4;
      const metricsHeight = card.keyMetricsOrActions.length * 4.5;
      const interactionLines = doc.splitTextToSize(`Interaction: ${card.interactions}`, contentWidth - 8);
      const interactionHeight = interactionLines.length * 4;
      const totalCardHeight = titleHeight + purposeHeight + metricsHeight + interactionHeight + 12;

      checkPageBreak(totalCardHeight);

      // Card Background box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, totalCardHeight, 2, 2, 'FD');

      // Card Header
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(margin, y, contentWidth, 7, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(`${cardIdx + 1}. ${card.cardTitle}`, margin + 3.5, y + 4.8);
      y += 10;

      // Purpose
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Purpose:', margin + 3.5, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(purposeLines, margin + 17, y);
      y += purposeHeight + 2.5;

      // Key Metrics / Actions
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Key Features & Metrics:', margin + 3.5, y);
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      card.keyMetricsOrActions.forEach((metric) => {
        doc.setFillColor(37, 99, 235);
        doc.circle(margin + 5, y - 1, 0.7, 'F');
        const metricLines = doc.splitTextToSize(metric, contentWidth - 12);
        doc.text(metricLines, margin + 8, y);
        y += metricLines.length * 3.8;
      });
      y += 1.5;

      // Interactions
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(29, 78, 216); // blue-700
      doc.text('Interactions:', margin + 3.5, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(interactionLines, margin + 22, y);
      y += interactionHeight + 5;
    });

    y += 4;
  });

  // Footer page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
    doc.text('PaySphere Confidential - ACME Org HR Systems', margin, pageHeight - 6);
  }

  // Trigger download
  doc.save('PaySphere_Tab_and_Card_Functionality_Guide.pdf');
}
