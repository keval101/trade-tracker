import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DataService } from './service/data.service';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'paper-trading';
  isLoginPage = false;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    initFlowbite();
    setTimeout(() => {
      this.isLoginPage = this.router.url.includes('/login') || this.router.url.includes('/register');
    }, 50);

    this.authService.getCurrentUserDetail().subscribe(res => {
      localStorage.setItem('preferredMarket', res.preferredMarket)
    })
  }

  checkForLoginPage() {
    this.isLoginPage = this.router.url.includes('/login') || this.router.url.includes('/register');
  }
}
