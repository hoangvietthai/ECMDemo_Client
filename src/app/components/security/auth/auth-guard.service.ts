import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.auth.isAuthenticated()) {
        return true;
      }
      else {
       
        localStorage.clear();
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }
    else return false;
  }

}
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate();
     // confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
  }
}
