import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, RouterStateSnapshot, RouterState } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // const codeMessage: object = {
  //   200: '服务器成功返回请求的数据。',
  //   201: '新建或修改数据成功。',
  //   202: '一个请求已经进入后台排队（异步任务）。',
  //   204: '删除数据成功。',
  //   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  //   401: '用户没有权限（令牌、用户名、密码错误）。',
  //   403: '用户得到授权，但是访问是被禁止的。',
  //   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  //   406: '请求的格式不可得。',
  //   410: '请求的资源被永久删除，且不会再得到的。',
  //   422: '当创建一个对象时，发生一个验证错误。',
  //   500: '服务器发生错误，请检查服务器。',
  //   502: '网关错误。',
  //   503: '服务不可用，服务器暂时过载或维护。',
  //   504: '网关超时。',
  // };
  public state: RouterStateSnapshot;

  constructor(
    private router: Router
  ) {
    this.state = router.routerState.snapshot;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('login') === -1) {
      const auth = Date.now();
      req = req.clone({
        headers: req.headers.set('Auth', auth.toString())
      });
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.codeHandler(event);
          console.log('event', event);
        }
        return event;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(errors: HttpErrorResponse) {
    const { status, error } = errors;
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(`Backend returned code ${status}, ` + `body was: ${error}`);
    }
    return throwError('Server error, please try again later.');
  }

  private codeHandler(response: HttpResponse<any>) {
    const { status, statusText } = response;
    if (status === 401) {
      sessionStorage.clear();
      this.router.navigate([`/login`], { queryParams: { redirect: this.state.url } });
      return;
    }
    //this.router.navigate([`/${status}`]);
  }
}
