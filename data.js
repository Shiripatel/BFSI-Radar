/**
 * BFSI Global Regulatory Compliance Radar Dataset
 * Specifying regulations, sectors, impacts, status, requirements, and assessment logic.
 */

export const sectors = [
    { id: 'banking', name: 'Banking Operations', color: '#5db8a6', angleRange: [0, 72] },
    { id: 'payments', name: 'Payments & Fintech', color: '#cc785c', angleRange: [72, 144] },
    { id: 'wealth', name: 'Asset & Wealth Management', color: '#e8a55a', angleRange: [144, 216] },
    { id: 'insurance', name: 'Insurance (Prudential)', color: '#8e8b82', angleRange: [216, 288] },
    { id: 'security', name: 'Security & Privacy', color: '#141413', angleRange: [288, 360] }
];

export const impacts = {
    'Critical': { color: '#c64545', radiusPercent: 0.25 },
    'High': { color: '#e8a55a', radiusPercent: 0.50 },
    'Medium': { color: '#d4a017', radiusPercent: 0.70 },
    'Low': { color: '#5db872', radiusPercent: 0.90 }
};

export const regulations = [
    {
        id: 'dora',
        name: 'DORA',
        fullName: 'Digital Operational Resilience Act',
        sector: 'Security & Privacy',
        sectorId: 'security',
        jurisdiction: 'EU',
        impact: 'Critical',
        status: 'Active',
        effectiveDate: '2025-01-17',
        summary: 'A unified European framework strengthening cybersecurity and digital resilience across financial institutions.',
        description: 'The Digital Operational Resilience Act (DORA) mandates strict rules regarding IT risk management, incident reporting, operational resilience testing, and third-party IT risk monitoring. It covers virtually all EU financial institutions (banks, insurers, investment firms, payment providers) and their key ICT third-party service providers.',
        keyRequirements: [
            'Comprehensive ICT Risk Management frameworks with annual board approval.',
            'Strict incident classification thresholds and mandatory reporting timelines (4 hours for initials).',
            'Regular basic vulnerability testing and advanced threat-led penetration testing (TLPT) every 3 years.',
            'Exacting provisions for managing critical third-party ICT providers, including mandatory contract clauses.'
        ],
        actionItems: [
            'Map all critical business services and supporting ICT assets.',
            'Perform Gap Analysis on current incident classification criteria.',
            'Establish incident response protocols to meet 4-hour submission windows.',
            'Schedule vulnerability scans and establish a Threat Led Penetration Testing schedule.',
            'Review service agreements with all critical third-party vendors.'
        ]
    },
    {
        id: 'basel4',
        name: 'Basel IV',
        fullName: 'Basel Accord Framework (Basel III Reforms)',
        sector: 'Banking Operations',
        sectorId: 'banking',
        jurisdiction: 'Global',
        impact: 'Critical',
        status: 'Upcoming',
        effectiveDate: '2025-01-01', // Phase-in continues to 2028/2029
        summary: 'The final set of Basel III reforms revising capital floors, credit risk calculations, and operational risk metrics.',
        description: 'Commonly known as Basel IV, this standard restricts banks\' use of internal risk-models, introducing an output floor of 72.5% of risk-weighted assets calculated under the standardized framework. It aims to restore credibility in risk-weighted capital ratios and standardize risk assessments across banking divisions globally.',
        keyRequirements: [
            'Implementation of the aggregate output floor limit (72.5% of standardized RWA).',
            'Revised standardized approach for credit, market, and credit valuation adjustment (CVA) risk.',
            'Replacement of all existing operational risk approaches with a single Standardized Measurement Approach (SMA).',
            'Leverage ratio buffers for Global Systemically Important Banks (G-SIBs).'
        ],
        actionItems: [
            'Upgrade dual-track calculation engines (Internal model vs Standardized floor).',
            'Optimize tier-1 capital reserves to buffer output floor constraints.',
            'Review loan books to assess capital impact under standardized credit risk calculations.',
            'Establish regular stress testing schedules reflecting Basel IV criteria.'
        ]
    },
    {
        id: 'psd3',
        name: 'PSD3 & PSR',
        fullName: 'Payment Services Directive 3 & Payment Services Regulation',
        sector: 'Payments & Fintech',
        sectorId: 'payments',
        jurisdiction: 'EU',
        impact: 'High',
        status: 'Proposed',
        effectiveDate: '2026-06-30',
        summary: 'Proposed successors to PSD2, aiming to improve fraud prevention, open banking API access, and market competition.',
        description: 'The European Commission launched draft texts for PSD3 and the Payment Services Regulation (PSR). They update open banking interface standards (APIs), establish stiffer compliance penalty thresholds, strengthen Strong Customer Authentication (SCA), and force payment processors to share detailed payee validation data (IBAN/name matching).',
        keyRequirements: [
            'Dedicated APIs for open banking interfaces (no fallback screens without strict SLA failure patterns).',
            'Mandatory "verification of payee" checks to combat Authorized Push Payment (APP) fraud.',
            'Broadened SCA requirements (risk-based exceptions and authentication token controls).',
            'Equal access to payment infrastructure for non-bank payment service providers (PSPs).'
        ],
        actionItems: [
            'Upgrade Open Banking API gateways to match new availability and latency SLA requirements.',
            'Integrate confirmation-of-payee (IBAN name checker) routines across transaction nodes.',
            'Benchmark Strong Customer Authentication authentication steps against draft exemptions.',
            'Prepare payment operations for direct settlement access outside retail clearing houses.'
        ]
    },
    {
        id: 'pcidss4',
        name: 'PCI-DSS v4.0',
        fullName: 'Payment Card Industry Data Security Standard v4.0',
        sector: 'Payments & Fintech',
        sectorId: 'payments',
        jurisdiction: 'Global',
        impact: 'High',
        status: 'Active',
        effectiveDate: '2024-03-31', // Certain future-dated items effective March 31, 2025
        summary: 'Global payments standard focusing on continuous security, customized authentication controls, and automated monitoring.',
        description: 'PCI-DSS v4.0 adapts to modern payment security environments, emphasizing flexibility in validation methods and stronger data protection principles. Main requirements center on combatting e-commerce script-injection, implementing multi-factor authentication (MFA) everywhere, and shifting from periodic compliance assessments to continuous monitoring.',
        keyRequirements: [
            'Multi-factor authentication (MFA) required for all access to cardholder data environments (CDE).',
            'Automated mechanisms to inspect e-commerce payments pages and manage third-party JS scripts.',
            'Transition option to a "Customized Approach" allowing institutions to design custom control mechanisms.',
            'Targeted, documented risk analysis for all dynamically styled/timed controls.'
        ],
        actionItems: [
            'Audit cardholder environment endpoints for direct MFA integration.',
            'Deploy Javascript inventory trackers to secure payment pages against Magecart/inject exploits.',
            'Migrate self-assessment questionnaires (SAQs) to v4.0 templates.',
            'Run quarterly training for DevSecOps teams on the revised Customized Approach design criteria.'
        ]
    },
    {
        id: 'solvency2',
        name: 'Solvency II Review',
        fullName: 'Solvency II Omnibus Review & Reforms',
        sector: 'Insurance (Prudential)',
        sectorId: 'insurance',
        jurisdiction: 'EU',
        impact: 'High',
        status: 'Upcoming',
        effectiveDate: '2026-01-01',
        summary: 'A legislative overhaul of insurance capital requirements (SCR) to release capital for long-term investments.',
        description: 'Solvency II regulates the capital and risk compliance requirements of EU insurers. The review relaxes short-term capital requirements via corrected risk margins and symmetric adjustments, enabling insurers to commit billions to green infrastructure, while instituting systemic risk assessments and enhanced supervision for cross-border groups.',
        keyRequirements: [
            'Recalculated Risk Margin parameters reducing capital lock-up on long-tail liabilities.',
            'Revisions to the matching adjustment (MA) and volatility adjustment (VA) mechanisms.',
            'Macroprudential tools giving tools to block insurance distributions in market stress.',
            'Enhanced sustainability disclosures and transition plan requirements.'
        ],
        actionItems: [
            'Recalculate Solvency Capital Requirement (SCR) templates using modified risk margin formulas.',
            'Review asset liability matching portfolios for green transition asset eligibility.',
            'Incorporate macroprudential stress scenarios in the annual ORSA.',
            'Formulate carbon-neutral transition plan templates to meet sustainability directives.'
        ]
    },
    {
        id: 'mifid2',
        name: 'MiFID II Review',
        fullName: 'Markets in Financial Instruments Directive II Refits',
        sector: 'Asset & Wealth Management',
        sectorId: 'wealth',
        jurisdiction: 'EU',
        impact: 'High',
        status: 'Active',
        effectiveDate: '2024-03-28',
        summary: 'Reforms establishing consolidated tapes for trading data and simplifying retail investment rules.',
        description: 'The MiFID II review focuses on market transparency and data access. It mandates the creation of centralized real-time market data consolidators ("Consolidated Tapes") for equities, bonds, and derivatives, while restricting payment for order flow (PFOF) to prevent conflicts of interest in broker routing.',
        keyRequirements: [
            'Complete ban on Payment for Order Flow (PFOF) with national phasing options.',
            'Unified data standards for reporting trades to Consolidated Tape Providers (CTPs).',
            'Modified commodity derivatives position limits and position management rules.',
            'Simplified cost and fee disclosure requirements for retail investor communications.'
        ],
        actionItems: [
            'Decommission PFOF arrangements and re-align broker routing tables to best-execution protocols.',
            'Map trade reporting schemas to match consolidation tape specification rules.',
            'Re-examine commodity position allocations against new hedging exceptions.',
            'Revamp retail client advice sheets to present simplified fee breakdowns.'
        ]
    },
    {
        id: 'glba',
        name: 'GLBA Safeguards',
        fullName: 'Gramm-Leach-Bliley Act Safeguards Rule',
        sector: 'Security & Privacy',
        sectorId: 'security',
        jurisdiction: 'US',
        impact: 'High',
        status: 'Active',
        effectiveDate: '2023-06-09', // Updates and incident notification requirements active May 2024
        summary: 'Stiffer cybersecurity requirements for non-bank financial institutions, with mandatory data breach reporting.',
        description: 'The FTC updated its GLBA Safeguards Rule, changing cybersecurity standards for credit unions, lenders, brokerage firms, mortgages, and fintech providers. Institutions must establish written security programs, restrict access policies, encrypt customer data, and notify the FTC within 30 days of data breaches involving 500+ users.',
        keyRequirements: [
            'Written cybersecurity policy designed and monitored by a designated Qualified Individual.',
            'Data encryption in transit and at rest, alongside multi-factor authentication (MFA).',
            'Continuous monitoring or annual penetration testing coupled with bi-annual vulnerability scans.',
            'FTC notification of security incidents involving unencrypted personal data of 500+ consumers.'
        ],
        actionItems: [
            'Appoint or formalize the role of a Qualified Individual to oversee the GLBA program.',
            'Encrypt database volumes containing customer tax, accounting, or billing records.',
            'Establish webhook notifications to identify security events impacting 500+ consumers.',
            'Run third-party cybersecurity audits and prepare annual reports for the board.'
        ]
    },
    {
        id: 'doddfrank',
        name: 'Dodd-Frank Section 1033',
        fullName: 'Dodd-Frank Consumer Financial Protection Act Sec 1033',
        sector: 'Banking Operations',
        sectorId: 'banking',
        jurisdiction: 'US',
        impact: 'High',
        status: 'Upcoming',
        effectiveDate: '2025-10-01',
        summary: 'CFPB rule mandating secure financial data sharing, effectively phasing out screen scraping in US banking.',
        description: 'Section 1033 of the Dodd-Frank Act requires banks to provide financial consumers and authorized companies secure digital access to account data. The CFPB rule bans screen scraping and requires formal developer APIs for checking accounts, credit cards, digital wallets, and prepaid products.',
        keyRequirements: [
            'Provision of secure developer query APIs for customer financial accounts.',
            'Elimination of credential-sharing authentication methods (screen scraping).',
            'No data access fees charged to consumers or authorized third-party applications.',
            'Strict limits on secondary data usage by fintech aggregators.'
        ],
        actionItems: [
            'Develop consumer data authorization portals matching FDX API designs.',
            'Draft migration guides for aggregators moving from screen scraping to formal APIs.',
            'Embed strict token revocation and consent management screens in client portals.',
            'Review data sharing contracts regarding secondary marketing restriction compliance.'
        ]
    },
    {
        id: 'nydfs500',
        name: 'NYDFS 23 NYCRR 500',
        fullName: 'New York Department of Financial Services Cybersecurity Regulation',
        sector: 'Security & Privacy',
        sectorId: 'security',
        jurisdiction: 'US',
        impact: 'High',
        status: 'Upcoming',
        effectiveDate: '2025-11-01', // Key updates phase in through 2025/2026
        summary: 'Highly influential state-level financial cybersecurity rules mandating annual audits, MFA, and CEO certification.',
        description: 'Applicable to all financial service providers Operating in NY, this regulation recently increased demands on C-Suite responsibility. Large firms ("Class A companies") must run independent audits. All covered entities must implement MFA, perform regular risk assessment runs, and provide immediate notification of ransom payments.',
        keyRequirements: [
            'Mandatory Multi-Factor Authentication (MFA) for all external access and internal systems.',
            'Annual independent audits for Designated Class A companies.',
            'Board-level approval of written cybersecurity policies and C-Suite validation.',
            'Cyber extortion / ransom payment reporting to NYDFS within 36 hours.'
        ],
        actionItems: [
            'Assess Class A designation criteria (turnover and employee counts).',
            'Optimize firewall configurations and active directory integrations to enforce MFA.',
            'Develop emergency payment authorization playbooks for ransomware compliance.',
            'Create executive templates for the annual board certificate of conformity.'
        ]
    },
    {
        id: 'bcbs239',
        name: 'BCBS 239',
        fullName: 'Risk Data Aggregation and Risk Reporting Principles',
        sector: 'Banking Operations',
        sectorId: 'banking',
        jurisdiction: 'Global',
        impact: 'High',
        status: 'Active',
        effectiveDate: '2016-01-01', // Continuous compliance and new supervision updates
        summary: 'Global principles for risk data aggregation capabilities to support quick decision-making during crises.',
        description: 'BCBS 239 defines guidelines for Global/Domestic Systemically Important Banks to aggregate risk metrics correctly across separate business lines during stress events. In recent supervisory reviews, regulators have increased pressure and sanctions on banks showing gaps in data quality, reconciliation, and manual spreadsheets.',
        keyRequirements: [
            'Maintain strong data governance models and data catalogs with data lineage.',
            'Ability to produce aggregated risk data across all divisions during crisis windows.',
            'Validation of manual data processing routes and eradication of un-audited spreadsheet links.',
            'Automated reconciliation loops between core general ledger and risk models.'
        ],
        actionItems: [
            'Establish metadata repositories mapping end-to-end data lineage for key risk indicators.',
            'Automate credit card and mortgage risk feed reconciliations.',
            'Run dry-run stress events to test the extraction of global risk exposures within 24 hours.',
            'Implement data validation alerts to flag quality exceptions at database level.'
        ]
    },
    {
        id: 'consumer_duty',
        name: 'Consumer Duty',
        fullName: 'FCA Consumer Duty Principle 12',
        sector: 'Asset & Wealth Management',
        sectorId: 'wealth',
        jurisdiction: 'UK',
        impact: 'High',
        status: 'Active',
        effectiveDate: '2023-07-31', // Closed products audit by July 2024
        summary: 'Sweeping UK regulations forcing financial services to deliver good outcomes for retail consumers.',
        description: 'The UK Financial Conduct Authority (FCA) Consumer Duty sets higher standards of consumer protection. Companies must regularly justify value calculations, guarantee transparent communications, verify that customer journeys do not cause harm, and actively support vulnerable clients.',
        keyRequirements: [
            'Produce and review annual "Fair Value Assessments" of all retail monetary products.',
            'Evidence consumer understanding through systematic testing of communications leaflets.',
            'Monitor and eliminate "sludge design" patterns impeding customers from switching or cancelling.',
            'Identify, tag, and support vulnerable indicators to match advisory thresholds.'
        ],
        actionItems: [
            'Draft value justification models for all retail fee/loan portfolios.',
            'Run customer testing sessions on standard disclosure and invoice structures.',
            'Modify front-end workflows to guarantee cancellation paths are as simple as signing up.',
            'Train customer desks on identifying and logging vulnerable client indicators.'
        ]
    },
    {
        id: 'solvency_uk',
        name: 'Solvency UK',
        fullName: 'Solvency II Post-Brexit Reform',
        sector: 'Insurance (Prudential)',
        sectorId: 'insurance',
        jurisdiction: 'UK',
        impact: 'Medium',
        status: 'Active',
        effectiveDate: '2024-06-30',
        summary: 'The UK variant of Solvency II, reducing risk margins and widening asset eligibility for insurers.',
        description: 'Post-Brexit, the UK PRA restructured Solvency II rules. Key changes include a 65% reduction in the risk margin for life insurers and a wider range of investment categories (including assets with lease options and construction loans) qualifying for matching adjustments.',
        keyRequirements: [
            'Calculated 65% reduction in risk margin liabilities for long-term life structures.',
            'Expanded asset criteria in Matching Adjustment portfolios.',
            'Streamlined processes for insurers seeking internal rating approvals.',
            'New senior management confirmation rules for asset-matching suitability.'
        ],
        actionItems: [
            'Rebalance Solvency capital calculations based on PRA risk margin relief rates.',
            'Identify infrastructure loan segments to move into Matching Adjustment asset pools.',
            'Revise Solvency disclosure templates for UK statutory filings.',
            'Obtain executive sign-off verifying matching asset quality models.'
        ]
    },
    {
        id: 'eu_ai_finance',
        name: 'EU AI Act (Financial Systems)',
        fullName: 'EU Artificial Intelligence Act (BFSI Applications)',
        sector: 'Security & Privacy',
        sectorId: 'security',
        jurisdiction: 'EU',
        impact: 'High',
        status: 'Upcoming',
        effectiveDate: '2026-05-01', // Risk classes phase in; initial compliance by early 2025/2026
        summary: 'Strict classification and risk governance rules for AI systems used in credit scoring and risk profiles.',
        description: 'Superimposing cybersecurity rules, the EU AI Act classifies AI tools used for evaluating creditworthiness or calculating insurance pricing as "High Risk". BFSI companies using these tools must establish robust risk management structures, test for bias, maintain logs, and guarantee human oversight.',
        keyRequirements: [
            'Establish data quality governance to prevent bias in AI training inputs.',
            'Keep automated log records of model execution for audit tracking.',
            'Ensure high levels of explainability and establish manual human-in-the-loop override panels.',
            'Register high-risk AI deployments in the official EU database.'
        ],
        actionItems: [
            'Catalog existing algorithms used in credit scoring and pricing calculations.',
            'Assess current AI procurement criteria against transparency thresholds.',
            'Set up drift and bias verification loops on machine learning pipelines.',
            'Implement API logging systems capturing input parameters and rating decisions.'
        ]
    },
    {
        id: 'fica',
        name: 'FICA / AMLD6',
        fullName: 'Sixth Anti-Money Laundering Directive & FinCEN Updates',
        sector: 'Payments & Fintech',
        sectorId: 'payments',
        jurisdiction: 'Global',
        impact: 'Critical',
        status: 'Active',
        effectiveDate: '2024-01-01',
        summary: 'Global updates targeting digital asset transactions, beneficial ownership registry reporting, and PEP thresholds.',
        description: 'Corporate transparency rules demand detailed tracking of beneficial ownership. AMLD6 expands corporate liability for money laundering, establishes stricter penalties, and forces digital wallets to perform full KYC/AML screening on self-custodial transactions.',
        keyRequirements: [
            'Filing of Beneficial Ownership Information (BOI) reports with national central registers.',
            'Enforcement of AML screening requirements for non-custodial and crypto-asset transfers.',
            'Stricter Customer Due Diligence (CDD) thresholds for politically exposed persons (PEPs).',
            'Corporate liability extensions enabling regulatory penalties for systemic manager negligence.'
        ],
        actionItems: [
            'Audit legacy client profile registries to check for missing beneficial owners.',
            'Integrate crypto transaction screening systems (AML/Sanction lists) into processing pipelines.',
            'Implement real-time alert triggers for transaction counts crossing PEP thresholds.',
            'Conduct board training regarding personal liability profiles under expanded AMLD6 rules.'
        ]
    }
];

export const assessmentQuestions = [
    {
        id: 'q_subsector',
        text: 'What is your primary BFSI subsector?',
        options: [
            { text: 'Deposit-taking & Retail/Commercial Banking', value: 'banking' },
            { text: 'Credit, Settlement & Payments/Fintech Services', value: 'payments' },
            { text: 'Wealth Management, Brokerage & Funds', value: 'wealth' },
            { text: 'Insurance Underwriting & Risk Portfolios', value: 'insurance' }
        ]
    },
    {
        id: 'q_jurisdiction',
        text: 'In which jurisdictions do you actively conduct business?',
        options: [
            { text: 'European Union (EU)', value: 'EU' },
            { text: 'United States (US)', value: 'US' },
            { text: 'United Kingdom (UK)', value: 'UK' },
            { text: 'Asia-Pacific (APAC)', value: 'APAC' },
            { text: 'Multi-regional / Global Operations', value: 'Global' }
        ]
    },
    {
        id: 'q_assets',
        text: 'What is the scale of your current operations (Employee count / Assets)?',
        options: [
            { text: 'Tier 1 / Enterprise (> $10B assets or > 2,000 employees)', value: 'tier1' },
            { text: 'Mid-Market ($1B - $10B assets or 250 - 2,000 employees)', value: 'tiermid' },
            { text: 'Emerging / Boutique (< $1B assets or < 250 employees)', value: 'tiersmall' }
        ]
    },
    {
        id: 'q_security',
        text: 'Do you process credit card cardholder data, or develop proprietary AI algorithms?',
        options: [
            { text: 'Yes, both cardholder data and proprietary AI models', value: 'both' },
            { text: 'Only cardholder data processes', value: 'cards' },
            { text: 'Only proprietary AI models (scoring / pricing)', value: 'ai' },
            { text: 'Neither of these apply', value: 'none' }
        ]
    }
];

export const newsFeed = [
    {
        date: '2026-07-09',
        type: 'alert',
        sector: 'Security & Privacy',
        item: 'NYDFS issues regulatory guidance regarding ransom notifications, warning that failures to report extortion transactions within 36 hours will trigger enforcement audits.'
    },
    {
        date: '2026-07-01',
        type: 'milestone',
        sector: 'Banking Operations',
        item: 'Basel Committee releases updated RWA evaluation matrices, stressing compliance with standardization limits and detailing implementation extensions.'
    },
    {
        date: '2026-06-25',
        type: 'fines',
        sector: 'Payments & Fintech',
        item: 'EU regulator level-2 sanction highlights: Major neobank penalized €1.4M for inadequate screening interfaces and incomplete record matching on PEP accounts.'
    },
    {
        date: '2026-06-18',
        type: 'regulatory-draft',
        sector: 'Asset & Wealth Management',
        item: 'FCA releases thematic report on Consumer Shield audits, pointing out sludge patterns in digital account management platforms.'
    },
    {
        date: '2026-06-10',
        type: 'milestone',
        sector: 'Insurance (Prudential)',
        item: 'UK PRA approves three new infrastructure funding syndicates for Solvency MA portfolios, validating simplified internal rating routes.'
    }
];
