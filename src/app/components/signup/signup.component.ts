import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  registerForm: FormGroup;
  ERROR_MESSAGES = {
    weekPassword: 'Password should be at least 6 characters',
  }
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  }


  register() {
    if(this.registerForm.valid) {
      const payload = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      }
      this.authService.signup(payload.email, payload.password).then(res => {
        const user = res.user.multiFactor.user;
        const data = this.registerForm.value;
        data['uid'] = user.uid
        this.authService.storeUserData(user.uid, data)
        this.messageService.add({ severity: 'success', summary: 'Register', detail: 'Register Successfully!' });
        this.router.navigate(['/dashboard']);
      }).catch(error => {
        if(error.message.includes('weak-password')) {
          this.messageService.add({ severity: 'error', summary: 'Week Password', detail: 'Password should be at least 6 characters' });
        } else if(error.message.includes('invalid-email')) {
          this.messageService.add({ severity: 'error', summary: 'Invalid Email', detail: 'The email address is Invalid' });
        }  else if(error.message.includes('email-already-in-use')) {
          this.messageService.add({ severity: 'error', summary: 'Email Already In Use', detail: 'The email address is already in use by another account' });
        }
      })
    }
  }
}
