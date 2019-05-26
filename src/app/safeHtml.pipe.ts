import { Pipe,PipeTransform } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser'

// use better logic for every content load
let loadJsURL = function (url: string) {
  
  let canJsLoad = function (url: string) {
    if (!url) return false;
    let scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
      // *td
      // better with substring or pos, make work with //
      if (scripts[i].src == url) return false;
    }
    return true;
  }


  // Load js url
  let insertJsUrl = function (url: string) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.body.appendChild(script);
  }
  insertJsUrl(url);
  //if (canJsLoad(url)) {
  //  insertJsUrl(url)
  //}
}

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }
  transform(value: string) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Pipe({ name: 'checkScripts' })
export class CheckScriptsPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }
  transform(value: string) {
    let jsUrls = value.match('<script.*?src="(.*?)"');
    if (jsUrls) {
      loadJsURL(jsUrls[1]);
    }
    return value;
  }
}
