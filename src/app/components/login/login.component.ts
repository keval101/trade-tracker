import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  seePassword = false

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  signIn() {
    if(this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).then((res: any) => {
        const token = res.user.multiFactor.user.accessToken
        const userId = res.user.multiFactor.user.uid
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        this.messageService.add({ severity: 'success', summary: 'Logged In', detail: 'Logged In Successfully!' });
        this.router.navigate(['/dashboard'])
      }).catch(error => {
        if(error.message.includes('invalid-credential')) {
          this.messageService.add({ severity: 'error', summary: 'Invalid Credential', detail: 'Invalid Credential' });
        } else if(error.message.includes('invalid-email')) {
          this.messageService.add({ severity: 'error', summary: 'Invalid Email', detail: 'The email address is Invalid' });
        }
      })
    }
  }
}
