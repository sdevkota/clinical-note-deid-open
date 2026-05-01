const project = {
  "slug": "clinical-note-deid-open",
  "title": "Clinical Note De-ID Open",
  "version": "1.0.0",
  "tagline": "Open PHI risk checks for AI-ready clinical text pipelines.",
  "problem": "Clinical AI needs data, but unsafe de-identification can expose patients and block responsible research.",
  "solution": "A de-identification readiness checker that records PHI classes, replacement strategy, reviewer status, and residual risk before release.",
  "required": [
    "corpus.name",
    "corpus.count",
    "deid.names",
    "deid.dates",
    "deid.locations",
    "review.privacyOfficer",
    "review.residualRisk"
  ],
  "opportunities": [
    "FHIR export",
    "PHI pattern packs",
    "review dashboards",
    "risk scoring research"
  ]
};

const samplePacket = {
  "corpus": {
    "name": "cardiology-notes",
    "count": 2500
  },
  "deid": {
    "names": "surrogate",
    "dates": "shifted",
    "locations": "generalized"
  },
  "review": {
    "privacyOfficer": "",
    "residualRisk": "medium"
  }
};

function getPath(input, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => {
    if (value === undefined || value === null) return undefined;
    return value[key];
  }, input);
}

function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return true;
  return false;
}

function looksRisky(value) {
  if (typeof value !== "string") return false;
  return /(ignore previous|system:|developer:|send secrets|full[-_ ]?access|all permissions|wildcard|unreviewed|unknown)/i.test(value);
}

function scanRiskSignals(input, prefix = "") {
  const findings = [];
  if (Array.isArray(input)) {
    input.forEach((item, index) => findings.push(...scanRiskSignals(item, `${prefix}[${index}]`)));
    return findings;
  }
  if (!input || typeof input !== "object") {
    if (looksRisky(input)) {
      findings.push({
        id: "risky-language",
        path: prefix || "value",
        severity: "medium",
        message: "Risky instruction-like or over-broad language detected.",
        recommendation: "Review this field as untrusted data and keep it separate from system instructions."
      });
    }
    return findings;
  }
  for (const [key, value] of Object.entries(input)) {
    const next = prefix ? `${prefix}.${key}` : key;
    findings.push(...scanRiskSignals(value, next));
  }
  return findings;
}

function analyze(packet = samplePacket) {
  const missing = project.required
    .filter((field) => isEmpty(getPath(packet, field)))
    .map((field) => ({
      id: "missing-required-field",
      path: field,
      severity: "high",
      message: `Missing required field: ${field}`,
      recommendation: "Provide this value so the packet can be audited and reused by other tools."
    }));

  const riskSignals = scanRiskSignals(packet);
  const findings = [...missing, ...riskSignals];
  const highCount = findings.filter((finding) => finding.severity === "high").length;
  const mediumCount = findings.filter((finding) => finding.severity === "medium").length;
  const score = Math.max(0, 100 - highCount * 18 - mediumCount * 7);
  const status = score >= 90 ? "ready" : score >= 70 ? "needs-review" : "blocked";

  return {
    project: {
      slug: project.slug,
      title: project.title,
      version: project.version
    },
    status,
    score,
    summary: `${project.title} found ${findings.length} issue(s); readiness score ${score}/100.`,
    findings,
    nextActions: findings.length
      ? findings.slice(0, 5).map((finding) => finding.recommendation)
      : ["Packet is complete for the v1 validator. Consider adding adapter-specific evidence."],
    contributionIdeas: project.opportunities
  };
}

module.exports = { project, samplePacket, analyze };
