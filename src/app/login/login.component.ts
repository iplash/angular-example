import { Component, OnInit } from '@angular/core';
import { userInfo, ConfigService } from '@app/config/config.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public redirect: string;

  constructor(
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.redirect = params.redirect;
    });
  }

  ngOnInit() {
  }

  login = () => {
    const name = 'test';
    const password = 'test';
    this.configService.login({ name, password }).subscribe((response: any) => {
      const { status, statusText } = response;
      if (200 === status) {
        this.redirect ? this.router.navigate([this.redirect]) : this.router.navigate(['/index']);
      }
      console.log(response);
    }, error => {
      console.log(`component: ${error}`);
    });
  }

  signout = () => {
    const name = 'test';
    const password = 'test';
    this.configService.signOut({ name, password }).subscribe((response: userInfo) => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

}
