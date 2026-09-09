import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock. `skip`/`limit` page the result.
   * */
  getSecurities(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const matches = this._filterSecurities(securityFilter);
    const skip = securityFilter?.skip ?? 0;
    const limit = securityFilter?.limit ?? matches.length;

    return of(matches.slice(skip, skip + limit)).pipe(delay(1000));
  }

  /** Total matches for a filter, ignoring paging - backs the paginator. */
  getSecuritiesCount(securityFilter?: SecuritiesFilter): Observable<number> {
    return of(this._filterSecurities(securityFilter).length).pipe(delay(1000));
  }

  /** Distinct security types present in the data (filter bar options). */
  getSecurityTypes(): Observable<string[]> {
    return of([...new Set(SECURITIES.map((s) => s.type))].sort()).pipe(delay(300));
  }

  /** Distinct currencies present in the data (filter bar options). */
  getCurrencies(): Observable<string[]> {
    return of([...new Set(SECURITIES.map((s) => s.currency))].sort()).pipe(
      delay(300),
    );
  }

  private _filterSecurities(
    securityFilter: SecuritiesFilter | undefined
  ): Security[] {
    if (!securityFilter) return SECURITIES;

    return SECURITIES.filter(
      (s) =>
        (!securityFilter.name ||
          s.name.toLowerCase().includes(securityFilter.name.toLowerCase())) &&
        (!securityFilter.types ||
          securityFilter.types.some((type) => s.type === type)) &&
        (!securityFilter.currencies ||
          securityFilter.currencies.some(
            (currency) => s.currency == currency
          )) &&
        (securityFilter.isPrivate === undefined ||
          securityFilter.isPrivate === s.isPrivate)
    );
  }
}
