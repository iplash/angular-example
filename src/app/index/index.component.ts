import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ConfigService, Captcha, RegisterData, Register } from '@app/config/config.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  providers: [ConfigService],
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  // tslint:disable-next-line: ban-types
  globalListen: Function;
  globalSeconds: number = 59;
  getCode: any;
  telphone: string = '';
  invisible: boolean = false;
  codes: Array<any> = Array(6).fill(null);
  position: number = 0;
  codeValue: string = '';
  action: boolean = true;
  seconds: number = this.globalSeconds;
  text: string = `${this.seconds}`;
  loading: boolean = false;
  tips: boolean = false;
  error: string;
  shareCode: string = '';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.shareCode = params.shareCode;
    });
  }

  ngOnInit() {
    this.globalListen = this.renderer.listen('document', 'keypress', e => {
      if (e.keyCode === 13) {
        this.submitTel(this.el.nativeElement.querySelector('#phone').value);
      }
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.globalListen();
  }

  public onChange(value): void {
    const lastChar = value[value.length - 1];
    if (value.length < this.codeValue.length && this.position > 0 && this.position <= 6) {
      const pos = this.position - 1;
      if (pos === 0) {
        this.position = 0;
        this.codes = Array(6).fill(null);
        this.codeValue = '';
        this.el.nativeElement.querySelector('#code').value = '';
      } else {
        this.position = pos;
        this.codes[pos] = null;
      }
    } else {
      if (this.invisible && ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(lastChar)) {
        if (this.position < 6) {
          this.codes[this.position] = lastChar;
          this.position += 1;
        }
        if (this.position === 6) {
          this.register();
        }
      }
    }
    this.codeValue = value;
  }

  public submitTel(phone: string): void {
    if (phone.length === 11 && phone.match(/^[1][3456789]\d{9}$/g)) {
      this.captchaFocus(true);
      this.telphone = phone;
      this.loading = true;
      this.configService.getVerificationCode(phone).subscribe((data: Captcha) => {
        this.loading = false;
        if (data.code === 'OK') {
          this.invisible = true;
          this.getCode = this.countDown();
        } else {
          this.errorMessage('请求超限,请稍后再试!');
        }
      }, error => {
        this.captchaFocus(false);
        this.loading = false;
        this.errorMessage(error);
      });
    } else {
      this.errorMessage('手机号码格式错误');
    }

  }

  public captchaFocus(flag: boolean): void {
    flag ? this.el.nativeElement.querySelector('#code').focus() : this.el.nativeElement.querySelector('#code').blur();
  }

  public register(): void {
    const code = this.codes.toString().replace(/,/g, '');
    if (code.length < 6) {
      this.position = 0;
      this.codes = Array(6).fill(null);
      this.errorMessage('验证码输入错误!');
      return;
    }
    this.el.nativeElement.querySelector('#code').blur();
    const data: RegisterData = {
      phone: this.telphone,
      code,
      inviteCode: this.shareCode
    };
    this.loading = true;
    this.configService.registerRequest(data).subscribe((response: Register) => {
      this.loading = false;
      if (response.code === '4000') {
        this.errorMessage('注册成功');
        this.router.navigate(['/download']);
      } else {
        this.position = 0;
        this.codes = Array(6).fill(null);
        this.el.nativeElement.querySelector('#code').value = '';
        this.errorMessage(response.data);
      }
    }, error => this.errorMessage(error));
  }

  public again(phone): void {
    if (this.action) {
      return;
    }
    this.loading = true;
    this.captchaFocus(true);
    this.configService.getVerificationCode(phone).subscribe((data: Captcha) => {
      this.loading = false;
      if (data.code === 'OK') {
        this.position = 0;
        this.codes = Array(6).fill(null);
        this.el.nativeElement.querySelector('#code').value = '';
        this.seconds = this.globalSeconds;
        this.text = `${this.globalSeconds}`;
        this.action = true;
        this.getCode = this.countDown();
      } else {
        this.errorMessage('请求超限,请稍后再试!');
      }
    }, error => {
      this.captchaFocus(false);
      this.errorMessage(error);
    });
  }

  public countDown() {
    return setInterval(() => {
      this.seconds -= 1;
      this.text = `${this.seconds}`;
      if (this.seconds === 0) {
        clearInterval(this.getCode);
        this.action = false;
        this.text = '';
        return;
      }
    }, 1000);
  }

  public reset(i: number): void {
    this.position = i;
    this.codes.fill(null, i);
    this.captchaFocus(true);
  }

  vote(agreed: boolean) {
    clearInterval(this.getCode);
    this.invisible = agreed;
    this.codes = Array(6).fill(null);
    this.position = 0;
    this.seconds = this.globalSeconds;
    this.text = `${this.globalSeconds}`;
    this.action = true;
  }

  public errorMessage(error: string): void {
    this.tips = true;
    this.error = error;
    setTimeout(() => {
      this.tips = false;
    }, 2500);
  }
}
