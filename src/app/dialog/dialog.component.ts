import { Component, OnInit, Input, Output, Renderer2, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() phone: string;
  @Output() voted = new EventEmitter<boolean>();

  // tslint:disable-next-line: ban-types
  globalListen: Function;
  getCode: any;
  codes = Array(6).fill(null);
  position: number = 0;
  action: boolean = true;
  seconds: number = 5;
  // tslint:disable-next-line: ban-types
  text: String = `(${this.seconds})`;

  constructor(private renderer: Renderer2, private el: ElementRef) {

    // setInterval(() => {
    //   console.log('1')
    //   if (this.seconds > 0) {
    //     this.seconds -= 1;
    //     this.text = `(${this.seconds})`;
    //   }
    //   if (this.seconds === 0) {
    //     this.action = false;
    //     this.text = '';
    //   }
    // }, 1000)

  }

  ngOnInit() {
    this.globalListen = this.renderer.listen('document', 'keypress', e => {
      if (this.position < 6) {
        this.codes[this.position] = e.key;
        this.position += 1;
      }
      if (this.position === 6) {
        this.position += 1;
        this.register();
      }
    });
    this.getCode = this.countDown();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.globalListen();
  }

  public register(): void {
    console.log(this.position, this.codes.toString().replace(/,/g, ''));
  }

  public again(): void {
    this.seconds = 5;
    this.action = true;
    this.getCode = this.countDown();
  }

  public countDown() {
    return setInterval(() => {
      console.log(this.seconds);
      this.seconds -= 1;
      this.text = `(${this.seconds})`;
      if (this.seconds === 0) {
        clearInterval(this.getCode);
        this.action = false;
        this.text = '';
        return;
      }
    }, 1000);
  }

  public reset(i: number): void {
    console.log(this.el.nativeElement);
    this.position = i;
    this.codes.fill(null, i);
  }

  vote(agreed: boolean) {
    this.voted.emit(agreed);
    this.codes = Array(6).fill(null);
    this.position = 0;
  }
}
