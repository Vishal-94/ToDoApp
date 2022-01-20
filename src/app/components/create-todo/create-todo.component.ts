import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ToDoAPIsService } from '../../services/to-do-apis.service'

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  createToDo:any;
  showList !:boolean;
  todolistform: FormGroup;

//   todolistform = new FormGroup({
//     title   : new FormControl(""),
//     date    : new FormControl(""),
//     description : new FormControl("")
// })

  constructor(private fb: FormBuilder, private toDoAPIService:ToDoAPIsService) { 
    this.todolistform = fb.group({  
      'title' : [null, Validators.required],  
      'date' : [null, Validators.required],
      'description' : [null, Validators.required]
    });  
  }

  ngOnInit(): void {
    this.showList = false;
  }

  showToList(){
    this.showList = true;
  }

  backToCreateToDo(){
    this.showList = false;
  }

  onSubmit(value:any) {
    this.createToDo = value;
      this.createToDo['status'] = false;

      this.toDoAPIService.createTodoTask(this.createToDo)
    .subscribe(data => {
      let createdResponse :any = data;
      console.log("createTodoTask 03 --->", createdResponse);

      let self = this;
      Swal.fire({
        title: createdResponse['msg'],
        icon: 'success',
        confirmButtonColor: '#lightslategrey',
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        allowEscapeKey: false,
      }).then(function (d) {
        if (d.value) {
          self.showList = true;
        }
      })
      
      // this.dataSource = todlistdata.data;
      // this.toDoList_records = new MatTableDataSource(this.dataSource);
      // this.filteredStudentList = this.dataSource;
    });

      console.log("this.createToDo --->",this.createToDo);
      this.todolistform.reset()    }
}
