import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HTTP_INTERCEPTORS,HttpClientModule  } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {MainLayoutComponent} from './components/shared/layout/main-layout.component';
import {NotFoundComponent} from './components/shared/notfound/notfound.component';
import {NavMenuComponent} from './components/shared/nav-menu/navmenu.component';
import { AuthGuardService as AuthGuard } from './components/security/auth/auth-guard.service';
import { AuthService } from './components/security/auth/auth.service';
import { AuthInterceptor } from './request.module';
import { JwtModule } from '@auth0/angular-jwt';
import {TopMenuComponent} from './components/shared/nav-menu/top-menu/topmenu.component';
import {DropdownModule} from 'primeng/dropdown';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ButtonModule} from 'primeng/button';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TreeModule} from 'primeng/tree';
import {MenubarModule} from 'primeng/menubar';
import {InputTextModule} from 'primeng/inputtext';
import {ToolbarModule} from 'primeng/toolbar';
import {SplitButtonModule} from 'primeng/splitbutton';
import {DialogModule} from 'primeng/dialog';
import {TabViewModule} from 'primeng/tabview';
import {FileUploadModule} from 'primeng/fileupload';
import {ListboxModule} from 'primeng/listbox';
import {CalendarModule} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TreeTableModule} from 'primeng/treetable';
import {FieldsetModule} from 'primeng/fieldset';
import {CheckboxModule} from 'primeng/checkbox';
import {ContextMenuModule} from 'primeng/contextmenu';
//
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
//
import {DocumentComponent} from './components/document/document.component';
import {CreateDirectoryComponent} from './components/directory/create/createdirectory.component';
import {DocumentCategoryComponent} from './components/categories/category.component';
import {CreateCategoryComponent} from './components/categories/create/createcategory.component';
//
import {SendDocumentComponent} from './components/senddocument/senddocument.component';
import {CreateSendDocumentComponent} from './components/senddocument/create/createsenddocument.component';
import {UpdateSendDocumentComponent} from './components/senddocument/detail/detailsenddocument.component';
//
import {UpdateReceivedDocumentComponent} from './components/receiveddocument/detail/detailreceiveddocument.component';
//
import {ReceivedDocumentComponent} from './components/receiveddocument/receiveddocument.component';
import {CreateReceivedDocumentComponent} from './components/receiveddocument/create/createreceiveddocument.component';
import {InternalDocumentComponent} from './components/internaldocument/internaldocument.component';
import {CreateInternalDocumentComponent} from './components/internaldocument/create/createinternaldocument.component';
//
import {CreateDocUnifyComponent} from './components/DocumentUnify/create/createunify.component';
import {CreateDocPerformComponent} from './components/DocumentPerform/create/createperform.component';
import {CreateDocConfirmComponent} from './components/documentconfirm/create/createconfirm.component';
import { SelectUserComponent} from './components/user/selectuser/selectuser.component';
// 
import {DepartmentComponent} from './components/department/department.component';
import {UserComponent} from './components/user/user.component';
import {BusinessPartnerComponent} from './components/businesspartner/businesspartner.component';
import {CreatePartnerComponent} from './components/businesspartner/create/createbusinesspartner.component';
import {ContactPersonComponent} from './components/contactperson/contactperson.component';
import {CreateContactPersonComponent} from './components/contactperson/create/createcontactperson.component';
import {CreateUserComponent} from './components/user/create/createuser.component';
import { DialogService,MessageService } from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {TooltipModule} from 'primeng/tooltip';
import {MessageModule} from 'primeng/message';
import {BlockUIModule} from 'primeng/blockui';
import {PanelModule} from 'primeng/panel';
import {StepsModule} from 'primeng/steps';
//
import {GlobalDocumentComponent} from './components/globaldocument/globaldocument.component';
import {DirectoryComponent} from './components/directory/directory.component';
//
import { SelectDirectoryComponent} from './components/directory/selectdir/selectdir.component';
import {SelectCategoryComponent} from './components/categories/selectcategory/selectcategory.component';
//
import {ErrorDialogService} from './components/shared/error/dialog/errordialog.service';
import {ErrorDialogComponent} from './components/shared/error/dialog/errordialog.component';
import {ErrorComponent} from './components/shared/error/error.component';
import {DetailDocUnifyComponent} from './components/DocumentUnify/detail/detaildocumentunify.component';
import {ResultDocUnifyComponent} from './components/DocumentUnify/result/resultdocumentunify.component';
//
import {DetailDocPerformComponent} from './components/DocumentPerform/detail/detaildocumentperform.component';
import {ResultDocPerformComponent} from './components/DocumentPerform/result/resultdocumentperform.component';
//
import {DetailDocConfirmComponent} from './components/documentconfirm/detail/detaildocumentconfirm.component';
import {ResultDocConfirmComponent} from './components/documentconfirm/result/resultconfirmdocumentunify.component';
//
import {DetailInternalDocumentComponent} from './components/internaldocument/detail/detailinternaldocument.component';
//
import {CreateProcessComponent} from './components/documentprocess/create/createprocess.component';
import {DetailProcessComponent} from './components/documentprocess/detail/detailprocess.component';
//
import {HomeAdminComponent} from './components/home_admin/home.component';
//
import {dateToTimePipe,secondsToTimePipe,GroupByPipe} from './time.pipe';
export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainLayoutComponent,
    NotFoundComponent,
    NavMenuComponent,
    TopMenuComponent,
    //
    DocumentComponent,
    CreateDirectoryComponent,
    DocumentCategoryComponent,
    CreateCategoryComponent,
    DepartmentComponent,
    UserComponent,
    SendDocumentComponent,
    CreateSendDocumentComponent,
    UpdateSendDocumentComponent,
    BusinessPartnerComponent,
    CreatePartnerComponent,
    ContactPersonComponent,
    CreateContactPersonComponent,
    ReceivedDocumentComponent,
    CreateReceivedDocumentComponent,
    CreateInternalDocumentComponent,
    InternalDocumentComponent,
    CreateUserComponent,
    GlobalDocumentComponent,
    ErrorComponent,
    ErrorDialogComponent,
    DirectoryComponent,
    SelectDirectoryComponent,
    SelectCategoryComponent,
    SelectUserComponent,
    CreateDocUnifyComponent,
    CreateDocConfirmComponent,
    DetailDocUnifyComponent,
    ResultDocUnifyComponent,
    DetailDocConfirmComponent,
    ResultDocConfirmComponent,
    CreateProcessComponent,
    DetailProcessComponent,
    dateToTimePipe,
    UpdateReceivedDocumentComponent,
    DetailInternalDocumentComponent,
    DetailDocPerformComponent,
    CreateDocPerformComponent,
    ResultDocPerformComponent,
    HomeAdminComponent,
    secondsToTimePipe,
    GroupByPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        headerName: 'token',
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3001'],
        blacklistedRoutes: ['localhost:3001/auth/'],

      }
    }),
    NgProgressHttpModule,
    NgProgressModule.withConfig({
      trickleSpeed: 200,
      min: 20,
      meteor: false,
      color:'blue',
      spinner:false
    }),
    DropdownModule,
    BreadcrumbModule,
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    PanelMenuModule,
    TreeModule,
    MenubarModule,
    InputTextModule,
    ToolbarModule,
    SplitButtonModule,
    DialogModule,
    TabViewModule,
    FileUploadModule,
    ListboxModule,
    CalendarModule,
    ToastModule,
    DynamicDialogModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    TreeTableModule,
    FieldsetModule,
    CheckboxModule,
    ContextMenuModule,
    ChipsModule,
    ToggleButtonModule,
    TooltipModule,
    MessageModule,
    BlockUIModule,
    PanelModule,
    StepsModule
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    AuthService,
    DialogService,
    MessageService,
    ErrorDialogService
    
  ],
  entryComponents: [
    CreateDirectoryComponent,
    CreateCategoryComponent,
    CreatePartnerComponent,
    CreateContactPersonComponent,
    CreateUserComponent,
    ErrorDialogComponent,
    SelectDirectoryComponent,
    SelectCategoryComponent,
    SelectUserComponent,
    CreateDocUnifyComponent,
    CreateDocPerformComponent,
    CreateDocConfirmComponent,
    CreateProcessComponent,
    DetailProcessComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
