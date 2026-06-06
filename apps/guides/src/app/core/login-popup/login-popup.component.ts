import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzDividerComponent } from 'ng-zorro-antd/divider';

@Component({
    selector: 'guides-login-popup',
    templateUrl: './login-popup.component.html',
    styleUrls: ['./login-popup.component.less'],
    imports: [ReactiveFormsModule, NzFormDirective, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzSpaceCompactItemDirective, NzInputDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, NzAlertComponent, NzDividerComponent]
})
export class LoginPopupComponent {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private af = inject(AngularFireAuth);


  form: FormGroup;

  errorMessageCode: string;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
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
