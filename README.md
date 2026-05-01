# Clinical Note De-ID Open

Open PHI risk checks for AI-ready clinical text pipelines.

> Version: 1.0.0 | License: MIT | Status: production-oriented v1 foundation

## Problem

Clinical AI needs data, but unsafe de-identification can expose patients and block responsible research.

## What this project solves

A de-identification readiness checker that records PHI classes, replacement strategy, reviewer status, and residual risk before release.

Clinical Note De-ID Open ships as a small, dependency-free CLI and library. It validates a domain-specific JSON packet, emits actionable findings, and gives contributors a concrete surface for adding adapters, richer checks, schemas, and integrations.

## Who it is for

Health AI researchers, data stewards, privacy engineers.

## Quick start

```bash
npm test
npm start -- sample
```

Analyze your own packet:

```bash
clinical-note-deid-open ./packet.json
```

Or pipe JSON:

```bash
cat packet.json | node src/cli.js
```

## Example packet

```json
{
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
}
```

## Library usage

```js
const { analyze } = require("./src/index.js");

const report = analyze({
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
});
console.log(report.summary);
```

## v1 behavior

- Validates required fields for the domain packet.
- Scores readiness from 0 to 100.
- Reports missing or weak governance evidence.
- Suggests next actions and contributor extension points.
- Runs fully offline with no API keys and no network access.

## Contribution map

Good first contributions:

- Add FHIR export.
- Add PHI pattern packs.
- Add review dashboards.
- Add risk scoring research.

Larger contributions:

- Add a JSON Schema and compatibility tests.
- Build import/export adapters for popular AI frameworks.
- Add real-world fixtures from public, non-sensitive examples.
- Improve scoring with transparent, documented heuristics.

## Project principles

- Human agency over blind automation.
- Open standards over vendor lock-in.
- Auditable decisions over hidden magic.
- Privacy and safety as design constraints, not release notes.

## GitHub Pages

The marketing site lives in `site/index.html`. Enable GitHub Pages from the `site` folder or use the included Pages workflow after publishing.

## Security

This project does not process secrets by default. If you build adapters that touch production systems, keep least privilege, explicit consent, and auditable logs in the design.
