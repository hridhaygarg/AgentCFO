# Changelog

## 0.1.0 (2026-04-25)

### Features
- Initial release
- OpenAI `chat.completions.create` auto-instrumentation via `wrap()`
- Task grouping via `task()` with AsyncLocalStorage context propagation
- Batched transport (50 records / 5s flush interval)
- Pre-computed cost from built-in model pricing table
- Silent failure mode — SDK errors never interrupt customer code
- ESM + CJS dual output
