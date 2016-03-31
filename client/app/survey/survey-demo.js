System.register(['angular2/core', "angular2/common"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, common_2;
    var UsernameValidator, SurveyDemo;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
                common_2 = common_1_1;
            }],
        execute: function() {
            UsernameValidator = (function () {
                function UsernameValidator() {
                }
                UsernameValidator.startsWithNumber = function (control) {
                    if (control.value != "" && !isNaN(control.value.charAt(0))) {
                        return { "startsWithNumber": true };
                    }
                    return null;
                };
                UsernameValidator.usernameTaken = function (control) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            if (control.value === "David") {
                                resolve({ "usernameTaken": true });
                            }
                            else {
                                resolve(null);
                            }
                            ;
                        }, 1000);
                    });
                };
                return UsernameValidator;
            }());
            exports_1("UsernameValidator", UsernameValidator);
            SurveyDemo = (function () {
                function SurveyDemo(builder) {
                    this.builder = builder;
                    this.username = new common_1.Control("", common_2.Validators.compose([common_2.Validators.required, UsernameValidator.startsWithNumber]), UsernameValidator.usernameTaken);
                    this.form = builder.group({
                        username: this.username
                    });
                }
                SurveyDemo.prototype.submitData = function () {
                    console.log(JSON.stringify(this.form.value));
                };
                SurveyDemo = __decorate([
                    core_1.Component({
                        template: "\n\t\t<form [ngFormModel]=\"form\">\n\t\t\t<input type=\"text\" ngControl=\"username\" />\n\t\t\t\n\t\t\t<p *ngIf=\"username.pending\">Fetching data from the server...</p>\n\t\t\t\n\t\t\t<div *ngIf=\"username.dirty && !username.valid && !username.pending\">\n\t\t\t  <p *ngIf=\"username.errors.required\">Username is required.</p>\n\t\t\t  <p *ngIf=\"username.errors.startsWithNumber\">Your username can't start with a number</p>\n\t\t\t  <p *ngIf=\"username.errors.usernameTaken\">This username is taken</p>\n\t\t\t</div>\n\t\t\t\n\t\t\t<button (click)=\"submitData()\" [disabled]=\"!form.valid\" class=\"btn btn-primary\">Sumbit data</button>\n\t\t</form>\n\t",
                        directives: [common_2.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [common_2.FormBuilder])
                ], SurveyDemo);
                return SurveyDemo;
            }());
            exports_1("SurveyDemo", SurveyDemo);
        }
    }
});
//# sourceMappingURL=survey-demo.js.map