import { Component, OnInit } from '@angular/core';
import { CognitoServiceService } from "../../cognito-service.service";
import { SignupPage } from "../signup/signup.page";
import { AlertController } from '@ionic/angular';
import { NavController } from "@ionic/angular";



@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;
  signUpPage = SignupPage;

  constructor(
    public navCtrl: NavController,
    public CognitoSerive: CognitoServiceService,
    public alertController: AlertController
    ) {
  }

  ngOnInit() {
    this.CognitoSerive.getCurrentUser().then(userSession => {
      console.log(userSession['accessToken'].payload.username) 
    })
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
          text: 'Verify',
          handler: (data) => {
            this.sendMFA(data.VerificationCode);
          },
        },
      ],
    });

    await alert.present();
  }

  login(){
    this.CognitoSerive.authenticate(this.username, this.password)
    .then(res =>{
      console.log(res);
      if(res === 'SMS_MFA') {
        this.promptVerificationCode()
      } else {
        this.navCtrl.navigateRoot('/home');
      }
      
      
    }, err =>{
      console.log(err);
    });
  }

  sendMFA(verificationCode){
    this.CognitoSerive.sendMFACode(verificationCode, this.username)
    .then(res =>{
      console.log(res);
      // TODO Enter code for next move here
      
    }, err =>{
      console.log(err);
    });
  }
}