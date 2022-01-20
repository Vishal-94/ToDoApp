import { Component, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ToDoAPIsService } from '../../services/to-do-apis.service'

// export interface toDoListElements {
//   status: boolean;
//   title: string;
//   date: Date;
//   description: string;
// }

// const ELEMENT_DATA: toDoListElements[] = [

//   { status: true, title: 'Edit functionality task', date: new Date('01/17/2022'), description: 'Complete by EOD'},
//   { status: false, title: 'Meditate', date: new Date('01/18/2022'), description: 'Focus on Breathing'},
//   { status: false, title: 'Angular Impact training', date: new Date('01/18/2022'), description: 'Practice'},
//   { status: true, title: 'Breakfast', date: new Date('01/18/2022'), description: 'Done'},
//   { status: false, title: 'Birthday', date: new Date('01/18/2022'), description: 'Celebrate'},
//   { status: false, title: 'Full body Workout', date: new Date('01/18/2022'), description: 'exercise'}
  
// ];

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild( MatPaginator ) paginator !: MatPaginator;

  displayedColumns: string[] = ['title', 'date', 'description','status', 'Action', 'Delete'];
  //dataSource :any = ELEMENT_DATA;
  dataSource !: any [];
  filteredStudentList ! : any;
  toDoList_records !: MatTableDataSource<any>
  @Input() createToDo! :any;

  toDoDialogRef !: MatDialogRef<ToDoDialogModal, any>;
  toDoRecordData !:any;

  constructor(public dialog: MatDialog, private toDoAPIService:ToDoAPIsService) { }

  ngOnInit(): void {
    // this.toDoList_records = new MatTableDataSource(this.dataSource);
    // this.filteredStudentList = this.dataSource;
    this.getAllToDoListRecords();
  }

  // ngAfterViewInit() {
  //   this.toDoList_records.sort = this.sort;
  // }

  ngOnChanges() {
    if(this.createToDo){
      // console.log("ngOnChanges to do list component--->",this.createToDo);
      // //let addTask = this.createToDo;
      // this.dataSource.push(this.createToDo)

      // console.log("this.dataSource--->", this.dataSource);
      // this.toDoList_records = new MatTableDataSource(this.dataSource);

      // this.filteredStudentList = this.dataSource;
      // console.log("this.dataSource ---> ",this.dataSource)
      // console.log("ngOnChanges to do list component--->",this.createToDo);
      this.getAllToDoListRecords();
    }
  }

  getAllToDoListRecords(){
    this.toDoAPIService.getAllTodoList()
    .subscribe(data => {
      let todlistdata :any = data;
      //console.log("getAllToDoListRecords--->",todlistdata.msg);
      this.dataSource = todlistdata.data;
      this.toDoList_records = new MatTableDataSource([...this.dataSource].reverse());
      this.toDoList_records.sort = this.sort;
      this.toDoList_records.paginator = this.paginator;
      this.filteredStudentList = this.dataSource;
    });
  }

  editToDoRecord(rowdata:any){
    this.toDoRecordData = rowdata;
    this.openToDoDialogModal();
  }

  // editStudentRecord(rowdata:any){
  //   this.toDoRecordData = rowdata;
  //   this.openStudentDialogModal();
  // }

  applyFilter(filterValue: any) {
    let filterTerm = filterValue.value;
    console.log("filterValue--->",filterTerm);
    filterValue = filterTerm.trim(); // Remove whitespace
    filterValue = filterTerm.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.toDoList_records.filter = filterTerm;
  }
  
  openToDoDialogModal(){
    let self = this;
    this.toDoDialogRef = this.dialog.open(ToDoDialogModal, {
      width: '480px',
      height:'380px',
      panelClass: 'student-dialog-container',
      data: {
        toDoRecordData: this.toDoRecordData
      }
    });
    this.toDoDialogRef.afterClosed().subscribe(toDoData => {
      if( toDoData!= undefined && toDoData['recordEdited'] != undefined){

        console.log("toDoData 07--->", toDoData);
         delete toDoData.recordEdited;

        this.toDoAPIService.updateTodoTask(toDoData)
        .subscribe(data => {
          let updatedResponse :any = data;
          console.log("updatedResponse--->",updatedResponse.msg);
            Swal.fire({
              title: 'To do record updated successfully.',
              icon: 'success',
              confirmButtonColor: 'rgb(112, 102, 224)',
              focusConfirm: false,
              allowOutsideClick: false,
              confirmButtonText: 'OK',
              allowEscapeKey: false,
            })
        });
        

          self.dataSource.map((obj:any) => {
          if(obj.title == toDoData.title){
            obj.date = toDoData.date,
            obj.description=  toDoData.description
          }
        })
        self.toDoList_records = new MatTableDataSource(this.dataSource);

        // Swal.fire({
        //   title: 'Student record updated successfully.',
        //   icon: 'success',
        //   confirmButtonColor: '#3f51b5',
        //   focusConfirm: false,
        //   allowOutsideClick: false,
        //   confirmButtonText: 'OK',
        //   allowEscapeKey: false,
        // })

        this.toDoRecordData = '';
       }
    });
  }
  



  deleteToDoRecord(element:any){
    console.log("deleteToDoRecord--->",element);
    let self = this;
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to delete this record?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7066e0',
        cancelButtonColor: 'lightcoral',
        confirmButtonText: 'Yes, delete it!'
      }).then(function (d) {
        if (d.value) {

          let requestPayload = {
            title: element.title
          }
          
          self.toDoAPIService.deleteTodoTask(requestPayload)
          .subscribe(data => {
            let deleteResponse :any = data;
            console.log("deleteTodoTask--->",deleteResponse.msg);
            self.getAllToDoListRecords();
              Swal.fire({
                title: deleteResponse.msg,
                icon: 'success',
                confirmButtonColor: '#3f51b5',
                focusConfirm: false,
                allowOutsideClick: false,
                confirmButtonText: 'OK',
                allowEscapeKey: false,
              })
              // .then(function (d) {
              //   if (d.value) {
              //     self.getAllToDoListRecords();
              //   }
              // })

          });

          // self.filteredStudentList = self.dataSource.filter((item:any) => item.title !== element.title);
          // self.toDoList_records = new MatTableDataSource(self.filteredStudentList);
         
        }
      });
  }

  isToDoTaskCompleted(rowData:any){
    
  }


  isCheckValue(event:any, element:any){
    let requestPayload = {
      title:  element.title,
      status : event.checked,
      description : element.description
    }

    this.toDoAPIService.updateTodoTask(requestPayload)
    .subscribe(data => {
      let updatedResponse :any = data;
      console.log("updatedResponse--->",updatedResponse.msg);

      Swal.fire({
        title: 'To do status updated successfully.',
        icon: 'success',
        confirmButtonColor: '#3f51b5',
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        allowEscapeKey: false,
      })
    });
  
   this.filteredStudentList.filter((x:any )=>{
      if(x.title == element.title){
        x.status = event.checked;
      }
    })
    this.toDoList_records = new MatTableDataSource(this.filteredStudentList);
  
  }
  
  // public doFilter = (event: any) => {

  //   console.log(event.target.value)
  //   this.dataSource.filter = (event.target.value).trim().toLocaleLowerCase();
  // }
}


@Component({
  selector: 'to-do-dialog',
  templateUrl: './to-do-dialog-modal.html',
  styleUrls: ['./todolist.component.css']
})
export class ToDoDialogModal implements OnInit {

  dialogTitle !:string;
  todolistform: FormGroup;
  isEdited !: boolean;
  disableID:boolean = false;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ToDoDialogModal> ,
              @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {   
     // To initialize FormGroup  
      this.todolistform = fb.group({  
        'title' : [null, Validators.required],  
        'date' : [null, Validators.required],
        'description' : [null, Validators.required]
      });  
  }  

  ngOnInit() {
    this.dialogTitle = "Edit To Do List";
    if (this.data.toDoRecordData) {
      this.isEdited = true;
      this.todolistform.setValue({
        title : this.data.toDoRecordData['title'],
        date : this.data.toDoRecordData['date'],
        description : this.data.toDoRecordData['description']
     });
    }
  }
  // onCloseDialog() {
  //   this.dialogRef.close("closeOnly");
  // }

  onSubmit(form:any) {
      if(this.data.toDoRecordData != undefined && this.data.toDoRecordData != null && this.data.toDoRecordData != '' ){
        form['recordEdited'] = true;
        this.dialogRef.close(form);
      }
    }
}