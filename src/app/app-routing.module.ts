import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './components/shared/layout/main-layout.component';
import { AuthGuardService as AuthGuard } from './components/security/auth/auth-guard.service';
import { NotFoundComponent } from './components/shared/notfound/notfound.component';
import { LoginComponent } from './components/login/login.component';
import { DocumentComponent } from './components/document/document.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { DepartmentComponent } from './components/department/department.component';
import { UserComponent } from './components/user/user.component';
import { DocumentCategoryComponent } from './components/categories/category.component';
import { SendDocumentComponent } from './components/senddocument/senddocument.component';
import { CreateSendDocumentComponent } from './components/senddocument/create/createsenddocument.component';
import { UpdateSendDocumentComponent } from './components/senddocument/detail/detailsenddocument.component';
import { BusinessPartnerComponent } from './components/businesspartner/businesspartner.component';
import { ContactPersonComponent } from './components/contactperson/contactperson.component';
import { ReceivedDocumentComponent } from './components/receiveddocument/receiveddocument.component';
import { CreateReceivedDocumentComponent } from './components/receiveddocument/create/createreceiveddocument.component';
import { InternalDocumentComponent } from './components/internaldocument/internaldocument.component';
import { CreateInternalDocumentComponent } from './components/internaldocument/create/createinternaldocument.component';
import { GlobalDocumentComponent } from './components/globaldocument/globaldocument.component';
import { DetailDocUnifyComponent } from './components/DocumentUnify/detail/detaildocumentunify.component';
import { ResultDocUnifyComponent } from './components/DocumentUnify/result/resultdocumentunify.component';
import { DetailDocConfirmComponent } from './components/documentconfirm/detail/detaildocumentconfirm.component';
import { ResultDocConfirmComponent } from './components/documentconfirm/result/resultconfirmdocumentunify.component';
import { UpdateReceivedDocumentComponent } from './components/receiveddocument/detail/detailreceiveddocument.component';
import { DetailInternalDocumentComponent } from './components/internaldocument/detail/detailinternaldocument.component';
import { ResultDocPerformComponent } from './components/DocumentPerform/result/resultdocumentperform.component';
import { DetailDocPerformComponent } from './components/DocumentPerform/detail/detaildocumentperform.component';
//
import {HomeAdminComponent} from './components/home_admin/home.component';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '', component: HomeComponent
      },
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'quan-ly-tep', component: DocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-di', component: SendDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-di/tao-moi', component: CreateSendDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-di/chi-tiet/:Id', component: UpdateSendDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-den', component: ReceivedDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-den/tao-moi', component: CreateReceivedDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-den/chi-tiet/:Id', component: UpdateReceivedDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-noi-bo', component: InternalDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-noi-bo/tao-moi', component: CreateInternalDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'van-ban-noi-bo/chi-tiet/:Id', component: DetailInternalDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'truy-van-van-ban', component: GlobalDocumentComponent, pathMatch: 'full'
      },
      {
        path: 'thong-nhat-van-ban/:Id', component: DetailDocUnifyComponent, pathMatch: 'full'
      },
      {
        path: 'ket-qua-thong-nhat/:Id', component: ResultDocUnifyComponent, pathMatch: 'full'
      },
      {
        path: 'phe-duyet-van-ban/:Id', component: DetailDocConfirmComponent, pathMatch: 'full'
      },
      {
        path: 'ket-qua-phe-duyet/:Id', component: ResultDocConfirmComponent, pathMatch: 'full'
      },
      {
        path: 'ket-qua-thuc-hien/:Id', component: ResultDocPerformComponent, pathMatch: 'full'
      },
      {
        path: 'thuc-hien-van-ban/:Id', component: DetailDocPerformComponent, pathMatch: 'full'
      }
    ]

  },
  {
    path: 'quan-tri',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '', component: HomeAdminComponent
      },
      {
        path: 'danh-muc/tai-khoan-he-thong', component: UserComponent, pathMatch: 'full'
      },
      {
        path: 'danh-muc/phong-ban', component: DepartmentComponent, pathMatch: 'full'
      },
      {
        path: 'danh-muc/the-loai-tai-lieu', component: DocumentCategoryComponent, pathMatch: 'full'
      },
      {
        path: 'danh-muc/nguoi-lien-lac', component: ContactPersonComponent, pathMatch: 'full'
      },
      {
        path: 'danh-muc/doi-tac', component: BusinessPartnerComponent, pathMatch: 'full'
      }
    ]
  },
  {
    path: 'notfound', component: NotFoundComponent
  },
  //no layout routes
  { path: 'login', component: LoginComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
