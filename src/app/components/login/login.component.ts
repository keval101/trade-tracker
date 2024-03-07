import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  signIn() {
    console.log(this.loginForm.value)
    this.authService.signIn(this.loginForm.value).then((res: any) => {
      const token = res.user.accessToken
      const userId = res.user.uid
      console.log(token, userId)
    })
  }
}
