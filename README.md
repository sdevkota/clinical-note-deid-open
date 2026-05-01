# Clinical Note De-ID Open

Open PHI risk checks for AI-ready clinical text pipelines.

> Version: 2.0.0 | Runtime: Python | License: MIT | Status: production-oriented v2 foundation

## Problem

Clinical AI needs data, but unsafe de-identification can expose patients and block responsible research.

## What this project solves

A de-identification readiness checker that records PHI classes, replacement strategy, reviewer status, and residual risk before release.

Clinical Note De-ID Open is now Python-first. It ships as a dependency-free Python package and CLI that validates a domain-specific JSON packet, emits actionable findings, and gives contributors a practical foundation for adapters, datasets, evals, and workflow integrations.

## Quick start

```bash
python3 -m unittest discover -s tests
python3 -m clinical_note_deid_open.cli sample
```

Analyze your own packet:

```bash
python3 -m clinical_note_deid_open.cli ./packet.json
```

Or pipe JSON:

```bash
cat packet.json | python3 -m clinical_note_deid_open.cli
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

```python
from clinical_note_deid_open import analyze

report = analyze({
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
})
print(report["summary"])
```

## v2 behavior

- Python-first CLI and importable library.
- Validates required fields for the domain packet.
- Scores readiness from 0 to 100.
- Reports missing or weak governance evidence.
- Runs fully offline with no API keys and no network access.

## Contribution map

- Add FHIR export.
- Add PHI pattern packs.
- Add review dashboards.
- Add risk scoring research.

## Project principles

- Human agency over blind automation.
- Open standards over vendor lock-in.
- Auditable decisions over hidden magic.
- Privacy and safety as design constraints, not release notes.
