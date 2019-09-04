import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '@app/index/index.component';
import { DownloadComponent } from '@app/download/download.component';
import { DescriptionComponent } from '@app/description/description.component';
import { AlcoholComponent } from '@app/alcohol/alcohol.component';
import { LoginComponent } from '@app/login/login.component';

// tslint:disable-next-line: ban-types
const name: String = ' - 嘀嘀优品';

const routes: Routes = [
  { path: '', component: DownloadComponent, data: { title: `下载嘀嘀优品${name}` } },
  { path: 'register', component: IndexComponent, data: { title: `注册送嘀豆${name}` } },
  { path: 'download', component: DownloadComponent, data: { title: `下载嘀嘀优品${name}` } },
  { path: 'description', component: DescriptionComponent, data: { title: `嘀豆是什么${name}` } },
  { path: 'alcohol', component: AlcoholComponent, data: { title: `酒品盛宴${name}` } },
  { path: 'login', component: LoginComponent, data: { title: `用户登陆` } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
