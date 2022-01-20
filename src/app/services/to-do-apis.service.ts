import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

const api_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class ToDoAPIsService {

  constructor(private http: HttpClient) { }

  getAllTodoList() {
    return this.http.get(api_URL + '/todolist').pipe(map(data => {
      return data;
    }))
  }

  createTodoTask(requestPayload:any) {
    return this.http.post(api_URL + '/createToDo', requestPayload).pipe(map(data => {
      return data;
    }))
  }

  deleteTodoTask(requestPayload:any) {
    return this.http.post(api_URL + '/deleteTask', requestPayload).pipe(map(data => {
      return data;
    }))
  }

  updateTodoTask(requestPayload:any) {
    return this.http.put(api_URL + '/updatetodo', requestPayload).pipe(map(data => {
      return data;
    }))
  }

}
