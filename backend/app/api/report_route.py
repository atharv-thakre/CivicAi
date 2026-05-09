
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from app.database.complaints import get_complaint

router = APIRouter(prefix="/report", tags=["Report"])

@router.get("/{complaint_id}", response_class=HTMLResponse)
def report_pdf(complaint_id: int):
    complaint = get_complaint(complaint_id)
    action = complaint.action_plan or {}

    img_main  = f"https://app.totalchaos.online/data/complaints/{complaint.ref}/img_main.jpg"
    img_after = f"https://app.totalchaos.online/data/complaints/{complaint.ref}/img_left.jpg"

    severity_color = {"High": "#dc2626", "Medium": "#d97706", "Low": "#16a34a"}.get(complaint.ai_severity, "#6b7280")
    status_color   = {
        "draft": "#6b7280", "open": "#2563eb", "in_progress": "#d97706",
        "resolved": "#16a34a", "closed": "#374151"
    }.get((complaint.status or "").lower(), "#6b7280")

    tags_html = "".join(
        f'<span class="tag">{t}</span>' for t in (complaint.ai_tags or [])
    )
    resources_html = "".join(
        f'<li><span class="res-icon">⚙</span>{r}</li>' for r in action.get("resources", [])
    )
    action_items_html = "".join(
        f'<li><span class="step-num">{i+1}</span><span>{s}</span></li>'
        for i, s in enumerate(action.get("action_plan", []))
    )

    confidence_pct = int((complaint.ai_confidence or 0) * 100)
    is_urgent  = "Yes" if complaint.is_urgent else "No"
    priority   = complaint.internal_priority or 0
    upvotes    = complaint.upvotes or 0
    created    = complaint.created_at.strftime("%d %B %Y, %H:%M") if complaint.created_at else "—"
    assigned   = complaint.assigned_to or "Unassigned"
    pincode    = complaint.pincode or "—"
    coords     = f"{complaint.lat:.6f}, {complaint.lng:.6f}" if complaint.lat else "—"

    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Complaint Report #{complaint.ref}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>

*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

:root {{
  --blue:     #1d4ed8;
  --blue-dk:  #1e40af;
  --blue-lt:  #eff6ff;
  --blue-mid: #dbeafe;
  --g50:  #f8fafc;
  --g100: #f1f5f9;
  --g200: #e2e8f0;
  --g400: #94a3b8;
  --g500: #64748b;
  --g700: #334155;
  --g800: #1e293b;
  --font: 'IBM Plex Sans', Arial, sans-serif;
  --mono: 'IBM Plex Mono', 'Courier New', monospace;
  --sev:  {severity_color};
  --sts:  {status_color};
}}

body {{
  font-family: var(--font);
  background: var(--g50);
  color: var(--g800);
  font-size: 13px;
  line-height: 1.6;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}}

/* ══════════════════════════════════════
   SCREEN-ONLY ACTION BAR
══════════════════════════════════════ */
.action-bar {{
  position: sticky; top: 0; z-index: 100;
  background: #fff;
  border-bottom: 1px solid var(--g200);
  padding: 12px 24px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 1px 6px rgba(0,0,0,.06);
}}
.app-label {{
  font-family: var(--mono);
  font-size: 12px; font-weight: 600;
  color: var(--blue);
  letter-spacing: .08em; text-transform: uppercase;
}}
.btn-dl {{
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--blue); color: #fff;
  border: none; border-radius: 7px;
  padding: 9px 18px;
  font-family: var(--font); font-size: 13px; font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(29,78,216,.28);
  transition: background .15s, box-shadow .15s, transform .1s;
}}
.btn-dl:hover  {{ background: var(--blue-dk); transform: translateY(-1px); }}
.btn-dl:active {{ transform: translateY(0); }}

/* ══════════════════════════════════════
   REPORT WRAPPER (screen)
══════════════════════════════════════ */
.report {{
  max-width: 860px;
  margin: 24px auto 48px;
  background: #fff;
  border: 1px solid var(--g200);
  border-radius: 14px;
  overflow: visible;          /* ← never clip on screen either */
  box-shadow: 0 6px 32px rgba(15,23,42,.08);
}}

/* ══════════════════════════════════════
   HEADER BAND
══════════════════════════════════════ */
.hdr {{
  background: var(--blue) !important;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  padding: 26px 32px 20px;
  color: #fff;
  border-radius: 14px 14px 0 0;
  position: relative;
  overflow: hidden;
}}
.hdr-orb1 {{
  position: absolute; right: -50px; top: -50px;
  width: 220px; height: 220px; border-radius: 50%;
  background: rgba(255,255,255,.07);
  pointer-events: none;
}}
.hdr-orb2 {{
  position: absolute; right: 80px; bottom: -70px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,.05);
  pointer-events: none;
}}
.hdr-top {{
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 8px; position: relative; z-index: 1;
}}
.ref-mono {{
  font-family: var(--mono);
  font-size: 11px; font-weight: 500;
  background: rgba(255,255,255,.18);
  padding: 3px 10px; border-radius: 4px;
  letter-spacing: .08em;
}}
.status-pill {{
  font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 999px;
  background: {status_color} !important;
  color: #fff !important;
  letter-spacing: .05em; text-transform: uppercase;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}}
.hdr h1 {{
  font-size: 21px; font-weight: 700; line-height: 1.25;
  margin-bottom: 5px;
  position: relative; z-index: 1;
}}
.hdr-sub {{
  font-size: 12.5px; opacity: .82;
  margin-bottom: 13px;
  position: relative; z-index: 1;
}}
.badge-row {{
  display: flex; flex-wrap: wrap; gap: 6px;
  position: relative; z-index: 1;
}}
.badge {{
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: 999px;
  background: rgba(255,255,255,.18) !important; color: #fff !important;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.badge.sev {{
  background: {severity_color} !important;
  box-shadow: 0 0 0 2px rgba(255,255,255,.35);
}}
.badge.urgent-badge {{
  background: rgba(220,38,38,.85) !important;
}}

/* ══════════════════════════════════════
   BODY
══════════════════════════════════════ */
.body {{ padding: 24px 32px; }}

.section {{ margin-bottom: 20px; }}
.section:last-child {{ margin-bottom: 0; }}

.sec-title {{
  font-size: 10px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 9px;
  display: flex; align-items: center; gap: 8px;
}}
.sec-title::after {{
  content: ''; flex: 1; height: 1px;
  background: var(--blue-mid);
}}

/* ── META GRID ── */
.meta-grid {{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 9px;
  margin-bottom: 20px;
}}
.meta-cell {{
  background: var(--g50) !important;
  border: 1px solid var(--g200);
  border-radius: 8px;
  padding: 10px 12px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.mc-label {{
  font-size: 9.5px; font-weight: 700;
  letter-spacing: .09em; text-transform: uppercase;
  color: var(--g400); margin-bottom: 3px;
}}
.mc-val {{
  font-size: 12.5px; font-weight: 600;
  color: var(--g800); line-height: 1.3;
}}
.mc-val.mono {{ font-family: var(--mono); font-size: 11px; }}

/* ── DESCRIPTION ── */
.desc-box {{
  background: var(--g50) !important;
  border-left: 3px solid var(--blue);
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  font-size: 13px; line-height: 1.7;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}

/* ── AI ANALYSIS GRID ── */
.info-grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}}
.info-card {{
  background: var(--g50) !important;
  border: 1px solid var(--g200);
  border-radius: 8px;
  padding: 12px 14px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.info-card.span2 {{ grid-column: span 2; }}
.ic-label {{
  font-size: 9.5px; font-weight: 700;
  letter-spacing: .09em; text-transform: uppercase;
  color: var(--g400); margin-bottom: 5px;
}}
.ic-val {{ font-size: 13px; line-height: 1.6; color: var(--g800); }}

/* confidence bar */
.conf-row {{ display: flex; align-items: center; gap: 8px; }}
.conf-bar {{
  flex: 1; height: 6px;
  background: var(--g200);
  border-radius: 999px; overflow: hidden;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.conf-fill {{
  height: 100%; width: {confidence_pct}%;
  background: var(--blue) !important;
  border-radius: 999px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.conf-pct {{
  font-family: var(--mono);
  font-size: 12px; font-weight: 700; color: var(--blue);
}}

/* tags */
.tags-wrap {{ display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }}
.tag {{
  background: var(--blue-lt) !important;
  color: var(--blue) !important;
  border: 1px solid var(--blue-mid);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px; font-weight: 600;
  font-family: var(--mono);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}

/* ── IMAGES ── */
.img-grid {{
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}}
.img-wrap {{
  border-radius: 8px;
  border: 1px solid var(--g200);
  background: var(--g100);
  overflow: hidden;
  position: relative;
  aspect-ratio: 4/3;
}}
.img-wrap img {{
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}}
.img-lbl {{
  position: absolute; top: 7px; left: 7px;
  background: rgba(15,23,42,.7) !important;
  color: #fff !important;
  font-size: 9.5px; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 4px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.img-err {{
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: var(--g400); font-size: 12px;
}}

/* ── ACTION PLAN ── */
.action-list {{ list-style: none; display: flex; flex-direction: column; gap: 7px; }}
.action-list li {{
  display: flex; align-items: flex-start; gap: 10px;
  background: var(--blue-lt) !important;
  border: 1px solid var(--blue-mid);
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 13px; line-height: 1.5;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.step-num {{
  flex-shrink: 0; width: 20px; height: 20px;
  background: var(--blue) !important; color: #fff !important;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  font-family: var(--mono); margin-top: 1px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}

/* ── RESOURCES ── */
.res-list {{ list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }}
.res-list li {{
  background: var(--g50) !important;
  border: 1px solid var(--g200);
  border-radius: 6px;
  padding: 4px 11px;
  font-size: 12px; color: var(--g700);
  display: flex; align-items: center; gap: 5px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.res-icon {{ font-size: 10px; }}

/* ── ETA ── */
.eta-chip {{
  display: inline-flex; align-items: center; gap: 7px;
  background: #f0fdf4 !important;
  border: 1px solid #bbf7d0;
  color: #15803d !important;
  border-radius: 7px;
  padding: 8px 14px;
  font-size: 14px; font-weight: 700;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}

/* ── METRICS ROW ── */
.metrics-row {{ display: flex; gap: 9px; }}
.metric-cell {{
  flex: 1;
  background: var(--g50) !important;
  border: 1px solid var(--g200);
  border-radius: 7px;
  padding: 11px 13px; text-align: center;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.m-val {{
  font-size: 20px; font-weight: 700;
  color: var(--blue) !important;
  font-family: var(--mono); display: block;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.m-label {{
  font-size: 9.5px; font-weight: 600;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--g400); margin-top: 2px;
}}

/* ── LOCATION ── */
.coord-box {{
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--g50) !important;
  border: 1px solid var(--g200);
  border-radius: 6px;
  padding: 7px 13px;
  font-family: var(--mono); font-size: 11.5px; color: var(--g700);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}

/* ── FOOTER ── */
.ftr {{
  border-top: 1px solid var(--g200);
  background: var(--g50) !important;
  padding: 11px 32px;
  display: flex; align-items: center; justify-content: space-between;
  border-radius: 0 0 14px 14px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.ftr-text {{
  font-size: 10.5px; color: var(--g400);
  font-family: var(--mono);
}}

/* ══════════════════════════════════════
   PRINT STYLES
   Key fixes:
   1. Remove card border/shadow/border-radius that causes clipping
   2. Remove sticky bar
   3. Force all backgrounds to print
   4. A4 page margins
══════════════════════════════════════ */
@media print {{
  @page {{
    size: A4;
    margin: 12mm 14mm;
  }}

  html, body {{
    background: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  .action-bar {{ display: none !important; }}

  .report {{
    margin: 0 !important;
    max-width: 100% !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    overflow: visible !important;
  }}

  .hdr {{
    border-radius: 0 !important;
  }}

  .ftr {{
    border-radius: 0 !important;
  }}

  /* prevent awkward breaks */
  .section      {{ page-break-inside: avoid; break-inside: avoid; }}
  .img-grid     {{ page-break-inside: avoid; break-inside: avoid; }}
  .meta-grid    {{ page-break-inside: avoid; break-inside: avoid; }}
  .action-list  {{ page-break-inside: avoid; break-inside: avoid; }}
  .metrics-row  {{ page-break-inside: avoid; break-inside: avoid; }}
  .info-grid    {{ page-break-inside: avoid; break-inside: avoid; }}
}}
</style>
</head>
<body>

<!-- SCREEN-ONLY TOP BAR -->
<div class="action-bar">
  <span class="app-label">⚡ TotalChaos — Complaint #{complaint.ref}</span>
  <button class="btn-dl" onclick="window.print()">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none"
         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
    </svg>
    Download PDF
  </button>
</div>

<!-- ═══ REPORT ═══ -->
<div class="report" id="report">

  <!-- HEADER -->
  <div class="hdr">
    <div class="hdr-orb1"></div>
    <div class="hdr-orb2"></div>
    <div class="hdr-top">
      <span class="ref-mono">COMPLAINT #{complaint.ref}</span>
      <span class="status-pill">{(complaint.status or 'unknown').upper()}</span>
    </div>
    <h1>{complaint.title or 'Complaint Report'}</h1>
    <div class="hdr-sub">
      📍 {complaint.address} &nbsp;·&nbsp; 📮 {pincode} &nbsp;·&nbsp; 📅 {created}
    </div>
    <div class="badge-row">
      <span class="badge">🏢 {complaint.ai_department}</span>
      <span class="badge">🗂 {complaint.category}</span>
      <span class="badge sev">⚠ {complaint.ai_severity} Severity</span>
      {'<span class="badge urgent-badge">🚨 URGENT</span>' if complaint.is_urgent else ''}
      <span class="badge">👤 {assigned}</span>
    </div>
  </div>

  <div class="body">

    <!-- META GRID -->
    <div class="meta-grid">
      <div class="meta-cell">
        <div class="mc-label">Status</div>
        <div class="mc-val" style="color:{status_color}">{(complaint.status or '—').title()}</div>
      </div>
      <div class="meta-cell">
        <div class="mc-label">Severity</div>
        <div class="mc-val" style="color:{severity_color}">{complaint.ai_severity}</div>
      </div>
      <div class="meta-cell">
        <div class="mc-label">Urgent</div>
        <div class="mc-val" style="color:{'#dc2626' if complaint.is_urgent else 'inherit'}">{is_urgent}</div>
      </div>
      <div class="meta-cell">
        <div class="mc-label">Upvotes</div>
        <div class="mc-val mono">👍 {upvotes}</div>
      </div>
      <div class="meta-cell">
        <div class="mc-label">Priority Score</div>
        <div class="mc-val mono">{priority:.2f}</div>
      </div>
      <div class="meta-cell">
        <div class="mc-label">Pincode</div>
        <div class="mc-val mono">{pincode}</div>
      </div>
      <div class="meta-cell">
        <div class="mc-label">Assigned To</div>
        <div class="mc-val">{assigned}</div>
      </div>
      <div class="meta-cell">
        <div class="mc-label">Created</div>
        <div class="mc-val mono" style="font-size:11px">{created}</div>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="section">
      <div class="sec-title">Incident Description</div>
      <div class="desc-box">{complaint.description}</div>
    </div>

    <!-- AI ANALYSIS -->
    <div class="section">
      <div class="sec-title">AI Analysis</div>
      <div class="info-grid">
        <div class="info-card">
          <div class="ic-label">Category</div>
          <div class="ic-val">{complaint.category}</div>
        </div>
        <div class="info-card">
          <div class="ic-label">AI Confidence</div>
          <div class="ic-val">
            <div class="conf-row">
              <div class="conf-bar"><div class="conf-fill"></div></div>
              <span class="conf-pct">{confidence_pct}%</span>
            </div>
          </div>
        </div>
        <div class="info-card span2">
          <div class="ic-label">AI Tags</div>
          <div class="ic-val">
            <div class="tags-wrap">{tags_html or '—'}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- IMAGES -->
    <div class="section">
      <div class="sec-title">Visual Evidence</div>
      <div class="img-grid">
        <div class="img-wrap">
          <div class="img-lbl">Before</div>
          <img src="{img_main}" crossorigin="anonymous"
               onerror="this.parentElement.innerHTML='<div class=\\'img-err\\'>Image unavailable</div>'"/>
        </div>
        <div class="img-wrap">
          <div class="img-lbl">After</div>
          <img src="{img_after}" crossorigin="anonymous"
               onerror="this.parentElement.innerHTML='<div class=\\'img-err\\'>Image unavailable</div>'"/>
        </div>
      </div>
    </div>

    <!-- ROOT CAUSE + IMPACT -->
    <div class="section">
      <div class="sec-title">Root Cause &amp; Impact</div>
      <div class="info-grid">
        <div class="info-card">
          <div class="ic-label">Root Cause</div>
          <div class="ic-val">{action.get('root_cause', '—')}</div>
        </div>
        <div class="info-card">
          <div class="ic-label">Impact</div>
          <div class="ic-val">{action.get('impact', '—')}</div>
        </div>
      </div>
    </div>

    <!-- ACTION PLAN -->
    {'<div class="section"><div class="sec-title">Action Plan</div><ol class="action-list">' + action_items_html + '</ol></div>' if action.get('action_plan') else ''}

    <!-- RESOURCES -->
    {'<div class="section"><div class="sec-title">Resources Required</div><ul class="res-list">' + resources_html + '</ul></div>' if action.get('resources') else ''}

    <!-- ETA -->
    {'<div class="section"><div class="sec-title">Estimated Resolution</div><div class="eta-chip">🕒 ' + action.get("eta","") + '</div></div>' if action.get('eta') else ''}

    <!-- ENGAGEMENT METRICS -->
    <div class="section">
      <div class="sec-title">Engagement &amp; Priority</div>
      <div class="metrics-row">
        <div class="metric-cell">
          <span class="m-val">{upvotes}</span>
          <div class="m-label">👍 Upvotes</div>
        </div>
        <div class="metric-cell">
          <span class="m-val">{confidence_pct}%</span>
          <div class="m-label">🤖 AI Confidence</div>
        </div>
        <div class="metric-cell">
          <span class="m-val">{priority:.1f}</span>
          <div class="m-label">⚙ Internal Priority</div>
        </div>
        <div class="metric-cell">
          <span class="m-val">{'Yes' if complaint.is_urgent else 'No'}</span>
          <div class="m-label">🚨 Urgent Flag</div>
        </div>
      </div>
    </div>

    <!-- LOCATION -->
    <div class="section">
      <div class="sec-title">Location Details</div>
      <div class="info-grid">
        <div class="info-card">
          <div class="ic-label">Full Address</div>
          <div class="ic-val">{complaint.address}<br>
            <span style="color:var(--g400);font-size:12px">Pincode: {pincode}</span>
          </div>
        </div>
        <div class="info-card">
          <div class="ic-label">GPS Coordinates</div>
          <div class="ic-val">
            <div class="coord-box">📍 {coords}</div>
          </div>
        </div>
      </div>
    </div>

  </div><!-- /body -->

  <div class="ftr">
    <span class="ftr-text">⚡ Generated by TotalChaos Civic AI Platform</span>
    <span class="ftr-text" id="gen-date"></span>
  </div>

</div><!-- /report -->

<script>
document.getElementById('gen-date').textContent =
  new Date().toLocaleDateString('en-IN', {{day:'numeric', month:'long', year:'numeric'}});
</script>
</body>
</html>"""
    return HTMLResponse(content=html)