'use strict';
export const uploadUrl='http://localhost:8099/api/v1/ecmdemo/upload';
export const baseUrl='http://localhost:8099/api/v1/ecmdemo';
//export const baseUrl='http://localhost:53064/api/v1/ecmdemo';
export const uploadDataUrl='http://localhost:8099/upload';
export const RegisterStatusList=[
    {value:0,label:"Dự thảo"},
    {value:1,label:"Chờ đăng ký"},
    {value:2,label:"Đã đăng ký"},
    {value:3,label:"Không đăng ký"},
]
export const AgreeStatusList=[
    {value:1,label:"Chờ thống nhất"},
    {value:2,label:"Đã thống nhất"},
    {value:-1,label:"Không thống nhất"}
]
export const ConsiderStatusList=[
    {value:1,label:"Chờ xem xét"},
    {value:2,label:"Đã xem xét"}
]
export const PerformStatusList=[
    {value:1,label:"Chờ thực hiện"},
    {value:2,label:"Đã thực hiện"}
]
export const SecretLevels=[
    {value:0,label:"Thường"},
    {value:1,label:"Mật"},
    {value:1,label:"Tối mật"}
]
export const DeliveryMethods=[
    {value:0,label:"Chuyển phát nhanh"},
    {value:1,label:"Chuyển phát nhanh của chính phủ"},
    {value:2,label:"E-mail"},
    {value:3,label:"Fax"},
    {value:4,label:"HTVB ngoài"}
]
export const PartnerTypes=[
    {value:0,label:"Pháp nhân"},
    {value:1,label:"Cá nhân"},
    {value:2,label:"Cá nhân kinh doanh"},
    {value:3,label:"Pháp nhân ngoài lãnh thổ Việt Nam"},
]