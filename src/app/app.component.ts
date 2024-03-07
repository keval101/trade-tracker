import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DataService } from './service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'paper-trading';
  isLoginPage = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    initFlowbite();
    setTimeout(() => {
      this.isLoginPage = this.router.url.includes('/login');
    }, 50);
  }
}
