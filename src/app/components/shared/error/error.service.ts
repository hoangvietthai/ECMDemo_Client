import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class ErrorService {
    constructor(private route: Router) {
    }
    RedicrectToError() {
        this.route.navigate(['error']);
    }
    
}
