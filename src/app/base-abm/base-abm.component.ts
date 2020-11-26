import { Router, ActivatedRoute } from '@angular/router';
import { BaseABMService } from './../services/base-abm.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-abm',
  template: ``,
  styles: []
})
export class BaseABMComponent implements OnInit {


  editar: boolean;
  nuevo = true;
  format = {};
  form: FormGroup;
  router: Router;
  redirectRoute: string;
  route: ActivatedRoute;
  itemId;
  accion = 'nuevo';
  item: any;

  constructor(
    public service: BaseABMService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.itemId = +params.get('id');
        if (this.itemId > 0) {
          this.accion = 'editar';
          this.loadData();
        }

      }
    );
  }

  loadData() {
    this.service.getOne(this.itemId).subscribe(
      (item) => {
        this.item = item;
        this.form.patchValue(item);
      }
    );
  }

  save() {
    if (this.form.valid) {
      const values = { ...this.form.value };
      this.formatValues(values);
      this.service.save(values).subscribe(
        (item) => {
          this.onSave(item);
        }
      );
    }
  }

  update() {
    if (this.form.valid) {
      const values = { ...this.form.value };
      this.formatValues(values);
      this.service.update(this.itemId, values).subscribe(
        (item) => {
          this.onUpdate(item);
        }
      );
    }
  }

  delete(id: number) {
    this.service.delete(id);
    this.onDelete();
  }

  onSave(item) {
    this.redirect();
  }

  onUpdate(item) {
    this.redirect();
  }

  onDelete() {
  }

  redirect() {
    if (this.redirectRoute) {
      this.router.navigate([this.redirectRoute]);
    }
  }

  formatValues(values: any) {
    for (const key in values) {
      if (values[key]) {
        const func = this.format[key];
        if (func && typeof func === 'function') {
          values[key] = func(values[key]);
        }
      }
    }
  }

}
