import { Component, OnInit, AfterViewInit, SimpleChanges, ChangeDetectorRef, OnChanges } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
@Component({
    templateUrl: './errordialog.component.html'
})
export class ErrorDialogComponent implements OnInit, AfterViewInit, OnChanges {
    statusCode: number;
    Message: string;
    Title: string;
    ngOnInit(): void {

        this.statusCode = this.config.data.status;
        this.Message = this.config.data.reason;
        this.config.autoZIndex = false;
        this.config.baseZIndex = 9999;
        this.config.header = this.Title;


    }
    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private cd: ChangeDetectorRef) {

    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.cd.detectChanges();
            this.Change();
        })

    }
    Change() {
        switch (this.statusCode) {
            case 0: {
                
        
                this.config.header = "Kết nối tới server thất bại!";
                this.Message = "Hãy đảm bảo rằng đường truyền mạng của bạn vẫn hoạt động.";
                break;
            }
            case 400: {
                this.config.header = "Kết nối tới server thất bại!";
                this.Message = "Bạn vui lòng tải lại trang hoặc thử lại sau ít phút nữa! <br/>Vui lòng thử lại hoặc liên hệ YODO để nhận hỗ trợ";
                break;
            }
            case 401: {
                this.config.header = "Invalid credential"
                if (this.Message.length == 0) {
                    this.Message="Bạn đã bị đăng xuất khỏi hệ thống! <br/>Lý do: "+this.Message;
                    this.Message = "Chúng tôi phát hiện ra rằng thông tin đăng nhập của bạn có vấn đề.<br/> Bạn sẽ được chuyển tới trang đăng nhập sau đây để xác thực lại thông tin đăng nhập.";
                }
                this.ref.close(true);
                break;
            }
            case 404: {
                this.config.header = "Invalid request"
                this.Message = "Failed to load resource: the server responded with a status of 404";
                this.ref.close(true);
                break;
            }
            case null: {
                this.config.header = "Thông báo";
                break;
            }
            default: {
                this.config.header = "Đã xảy ra lỗi"
                this.Message = "Bạn vui lòng tải lại trang hoặc thử lại sau ít phút nữa!";
                break;
            }
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.statusCode = this.config.data.status;
        this.Message = this.config.data.reason;
        this.config.header = this.Title;
        this.Change();
    }
}