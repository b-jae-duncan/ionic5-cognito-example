import { Component } from '@angular/core';
import { CognitoServiceService } from "../cognito-service.service";
import { NavController } from "@ionic/angular";



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string;

  constructor(
    public CognitoSerive: CognitoServiceService,
    public navCtrl: NavController,

  ) {
    console.log("Constructor")
        this.CognitoSerive.isAuthenticated().then((res) => {
        if (res) {
          console.log('Logged In')
          this.CognitoSerive.getCurrentUser().then(userSession => {
            this.username = userSession['accessToken'].payload.username
            console.log(userSession['accessToken'].payload.username) 
          })
        } else {
          console.log('Not Logged In')
          this.navCtrl.navigateRoot('/login');
        }
      }).catch(err => {
        console.log(err)
        this.navCtrl.navigateRoot('/login');
      })
  }

  ngOnInit() {
    console.log('ngOnInit')
  }

  async signOut() {
    this.CognitoSerive.signOut().then(() => {
      this.navCtrl.navigateRoot('/login');
    }).catch(err => {
      this.navCtrl.navigateRoot('/login');
    });
    
 
  }

}
