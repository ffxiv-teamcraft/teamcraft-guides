import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';
import firebase from 'firebase/app';

@Component({
  selector: 'guides-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.less']
})
export class LoginPopupComponent {

  form: FormGroup;

  errorMessageCode: string;

  constructor(private fb: FormBuilder,
              private modalRef: NzModalRef,
              private message: NzMessageService,
              private af: AngularFireAuth) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    delete this.errorMessageCode;
    this.af.signInWithEmailAndPassword(this.form.value.email, this.form.value.password)
      .then(() => {
        this.modalRef.close(true);
      })
      .catch(err => this.onError(err));
  }

  public sendResetPassword(): void {
    const email = this.form.getRawValue().email;
    this.af.sendPasswordResetEmail(email);
    this.message.success('Reset email sent');
    this.modalRef.close(false);
  }

  private onError(error: any): void {
    this.errorMessageCode = error.code;
  }

  public googleOauth(): void {
    delete this.errorMessageCode;
    from(this.af.signInWithPopup(new firebase.auth.GoogleAuthProvider()) as Promise<any>).subscribe(() => {
      this.modalRef.close(true);
    });
  }


}
