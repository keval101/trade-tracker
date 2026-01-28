// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, timeout, catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userId = localStorage.getItem('userId');
    
    // If userId exists in localStorage, wait for Firebase to restore the session
    if (userId) {
      // Wait for Firebase to restore auth state
      // Filter out null values and wait for actual user (up to 3 seconds)
      return this.authService.getCurrentUser().pipe(
        filter(user => user !== null), // Skip initial null, wait for user
        timeout(3000), // Wait up to 3 seconds for Firebase to restore
        take(1),
        map(user => {
          if (user && user.uid === userId) {
            // User authenticated and matches stored userId
            return true;
          } else {
            // User ID mismatch or no user - clear and redirect
            this.clearAuthData();
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError(() => {
          // Timeout or error - Firebase didn't restore session
          // This might mean user is actually logged out
          this.clearAuthData();
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
    
    // No userId in localStorage - check auth state normally
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Get userId from current user and store it
          this.authService.getCurrentUser().pipe(take(1)).subscribe(user => {
            if (user) {
              localStorage.setItem('userId', user.uid);
            }
          });
          return true;
        } else {
          this.clearAuthData();
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }
}
