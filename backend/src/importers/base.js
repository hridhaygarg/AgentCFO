export class ImporterResult {
  constructor({ rows = [], cursor = null, periodStart = null, periodEnd = null } = {}) {
    this.rows = rows;
    this.cursor = cursor;
    this.periodStart = periodStart;
    this.periodEnd = periodEnd;
  }
}
