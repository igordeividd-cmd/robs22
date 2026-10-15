# RoB 2 Studio

Interactive Portuguese adaptation of the supplied RoB 2 IRPG beta v9 Excel workbook for individually randomized parallel-group trials. Buildless static HTML/CSS/JS; no dependencies or server required for the app.

## Behavior

- Five domains plus overall risk; separate ITT and PP workflows.
- Algorithms represented as a restricted decision AST extracted from both original VBA forms, with original operator precedence. No VBA, eval, or generated functions are executed in the app.
- Conditional applicability, original English questions, Portuguese interface, evidence notes, final assessor judgments, optional bias directions and weights.
- A provisional algorithm suggestion becomes an automatic final judgment only after applicable domain questions are answered. Overall auto-final waits for all five domain finals. Manual decisions are supported with justification.
- The v9 3.2 = NI form/algorithm mismatch is preserved and explained; a manual domain judgment is requested.
- Weighted proportions use the same denominator and rounding as Summary, separately for ITT and PP. Missing judgments remain in the denominator and are shown in gray. Exact workbook chart colors are preserved in SVG/PNG exports.
- XLSM/XLSX Results/Summary import reads OOXML ZIP data using native DecompressionStream; macros are never loaded or executed. Modern browsers required; CSV/TSV and JSON are alternatives.
- JSON backup, 85-column Results CSV, 23-column Summary CSV, SVG, 3× PNG, and browser print-to-PDF with full question/evidence report.
- Local browser storage, no cross-device cloud sync. The original partial AAA/X assessment is preserved on first open.

## Validation

Run `npm test` or `node --test tests/*.test.mjs`. The decision tests enumerate 962,110 combinations (including empty answers and NA) against an independent, test-only direct statement translation of the original VBA. They do not execute Microsoft Excel. Additional tests verify conditional flows, known decisions, assessor overrides, weighted denominators, CSV round trips, reading the original XLSM ZIP, input validation, and SVG escaping.

`reference/algorithm.vba` preserves the exact six original button handlers. `tooling/extract-model.py` generated the AST and source metadata from the initial analysis files; `tooling/build-oracle.py` independently translates VBA statements for the test oracle. These tools are development-only and not deployed.

Browser visual QA is unavailable in this environment; syntax, decisions, import/export, markup generation, and responsive CSS are checked without a browser.
