import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { ApiService } from './api.service';
import { throwError, Observable, Subscriber } from 'rxjs';

export class BaseABMService {

  public endpoint: string;
  public notification: NotificationService;
  public apiService: ApiService;

  items = [];
  subscriber: Subscriber<any[]>;
  fetched = false;

  constructor() { }

  getAll(): Observable<any[]> {
    return new Observable((subscriber) => {
      this.subscriber = subscriber;
      if (this.fetched) {
        this.subscriber.next(this.items);
      } else {
        this.apiService.get(this.endpoint).subscribe(
          (items: []) => {
            this.items = items;
            this.fetched = true;
            this.subscriber.next(this.items);
          }
        );
      }
    });
  }

  getOne(id: number) {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }

  save(values: any) {
    if (this.endpoint) {
      const body = values;
      return this.apiService.post(this.endpoint, body).pipe(
        catchError(
          (err) => this.onError(err)
        ),
        tap(
          (val) => this.onSave(val)
        )
      );
    } else {
      this.notification.error('Endpoint no definido en la clase.');
    }
  }

  update(id: number, values: any) {
    if (this.endpoint) {
      const body = values;
      return this.apiService.put(`${this.endpoint}/${id}`, body).pipe(
        catchError(
          (err) => this.onError(err)
        ),
        tap(
          (val) => this.onUpdate(id, val)
        )
      );
    } else {
      this.notification.error('Endpoint no definido en la clase.');
    }
  }

  delete(id: number) {
    if (this.endpoint) {
      return this.apiService.delete(`${this.endpoint}/${id}`).pipe(
        catchError(
          (err) => this.onError(err)
        ),
        tap(
          (result) => this.onDelete(id, result)
        )
      );
    } else {
      this.notification.error('Endpoint no definido en la clase.');
    }
  }

  onSave(val) {
    this.notification.message('Guardado correctamente');
    this.items.push(val);
  }

  onUpdate(id, val) {
    this.notification.message('Actualizado correctamente');
    this.items = this.items.map(
      (item) => item.id === id ? val : item
    );
  }

  onDelete(id, result) {
    if (result.deleted) {
      this.notification.message('Eliminado correctamente');
      this.items = this.items.filter(
        (item: any) => item.id !== id
      );
      this.subscriber.next(this.items);
    }
  }

  onError(err) {
    this.notification.error(err);
    return throwError(err);
  }

}
