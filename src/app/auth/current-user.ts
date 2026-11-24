import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { components } from '../api/schema';

export type Role = components['schemas']['Role'];
type CurrentUserDto = components['schemas']['CurrentUser'];

const staffRoles: readonly Role[] = ['ASSESSOR', 'DECISION_MAKER'];

// Loaded once before the app starts, so the navigation and the guards never wait for it.
@Service()
export class CurrentUser {
  private readonly http = inject(HttpClient);
  private readonly roles = signal<readonly Role[]>([]);

  readonly isApplicant = computed(() => this.roles().includes('APPLICANT'));
  readonly isStaff = computed(() => this.roles().some((role) => staffRoles.includes(role)));
  readonly hasAnyRole = computed(() => this.roles().length > 0);

  async load(): Promise<void> {
    const user = await firstValueFrom(this.http.get<CurrentUserDto>('/api/v1/me'));
    this.roles.set(user.roles);
  }

  holdsAnyOf(roles: readonly Role[]): boolean {
    return this.roles().some((role) => roles.includes(role));
  }

  startPage(): string {
    if (this.isApplicant() || this.isStaff()) {
      return '/applications';
    }
    return this.hasAnyRole() ? '/funding-calls' : '/no-access';
  }
}
