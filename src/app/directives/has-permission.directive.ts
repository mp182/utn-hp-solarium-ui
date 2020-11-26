import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AclService } from '../services/acl/acl.service';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  permiso: string;

  constructor(
    private aclService: AclService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input('appHasPermission')
  set hasPermission(val: string) {
    this.permiso = val;
    this.updateView();
  }

  private updateView() {
    this.aclService.can(this.permiso).subscribe(
      result => {
        if (result) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    );
  }

}
