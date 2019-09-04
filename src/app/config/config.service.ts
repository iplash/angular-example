import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

export interface Captcha {
  requestId: string;
  bizId: string;
  code: string;
  message: string;
}

export interface Register {
  data: any;
  code: string;
}

export interface RegisterData {
  phone: string;
  code: string;
  inviteCode: string;
}

// tslint:disable-next-line: class-name
export interface userInfo {
  name: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(private http: HttpClient) { }

  baseUrl: string = `${window.location.protocol}${environment.aipUrl}`;
  configUrl = 'assets/captcha.json';

  jsonToFormData(data) {
    const result = new FormData();
    // tslint:disable-next-line: forin
    for (const key in data) {
      result.append(key, data[key]);
    }
    return result;
  }

  getVerificationCode(phone: string) {
    return this.http.get<Captcha>(`${this.baseUrl}/api/web/code?phone=${phone}`);
  }

  registerRequest(data: RegisterData) {
    return this.http.post<Register>(`${this.baseUrl}/api/web/register`, this.jsonToFormData(data));
  }

  login(data: userInfo) {
    return this.http.post<userInfo>(`${this.baseUrl}/demo`, data);
  }

  signOut(data: userInfo) {
    return this.http.post<userInfo>(`${this.baseUrl}/signOut`, this.jsonToFormData(data));
  }
}
