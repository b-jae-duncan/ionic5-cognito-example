import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from "@ionic/angular";

import { AlertController } from '@ionic/angular';
import { CognitoServiceService } from "../../cognito-service.service";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  username: string;
  password: string;
  phone: string;

  constructor(
    // public navCtrl: NavController,
    // public navParams: NavParams,
    public alertController: AlertController,
    public CognitoService: CognitoServiceService
  ) {}

  ngOnInit() {
  }

  async promptVerificationCode() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enter Verfication Code!',
      inputs: [
        {
          name: 'VerificationCode',
          placeholder: 'Verification Code',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (data) => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Re-send Code',
          role: 'resend',
          handler: (data) => {
            this.resendVerification();
          }
        },
        {
          text: 'Verify',
          handler: (data) => {
            this.verifyUser(data.VerificationCode);
          },
        },
      ],
    });

    await alert.present();
  }



  register() {
    this.CognitoService.signUp(this.username, this.password, this.phone).then(
      res => {
        console.log(res);
        this.promptVerificationCode();
      },
      err => {
        console.log(err);
      }
    );
  }

  verifyUser(verificationCode) {
    this.CognitoService.confirmUser(verificationCode, this.username).then(
      res => {
        console.log(res);
      },
      err => {
        alert(err.message);
      }
    );
  }

  resendVerification() {
    this.CognitoService.resendConfirmationCode(this.username).then(
      res => {
        console.log(res);
        this.promptVerificationCode();
      },
      err => {
        alert(err.message)
      }
    )
  }

}


