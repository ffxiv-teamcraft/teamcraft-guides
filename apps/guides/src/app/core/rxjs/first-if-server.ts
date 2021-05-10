import { first, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { MonoTypeOperatorFunction } from 'rxjs';

export function firstIfServer<T>(platform: Object): MonoTypeOperatorFunction<T> {
  if (isPlatformServer(platform)) {
    return first();
  }
  return tap();
}
