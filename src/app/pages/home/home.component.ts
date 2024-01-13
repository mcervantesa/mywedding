import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, timer } from 'rxjs';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  today: Date = new Date();
  _second = 1000;
  _minute = this._second * 60;
  _hour = this._minute * 60;
  _day = this._hour * 24;
  end: any;
  now: any;
  day: any;
  hours: any;
  minutes: any;
  seconds: any;
  source = timer(0, 1000);
  clock: any;
  listaInvitados: any;
  myForm: FormGroup;
  bandera : boolean = false;
  confirmado : boolean= false;
  isLoadingInvited: boolean;
  formConfirmation: FormGroup;
  checking : boolean = false;

  constructor(private service: EventoService, private fb: FormBuilder,) {
    this.myForm = new FormGroup({
      codigo: new FormControl('',Validators.required),
    });
  }


  ngOnInit() {
    this.clock = this.source.subscribe(t => {
      this.now = new Date();
      this.end = new Date('03/2/' + (this.now.getFullYear()) + ' 13:00');
      this.showDate();
    });
    this.formConfirmation = this.fb.group({
      name: ["", Validators.required],
      
    });
  }

  showDate() {
    let distance = this.end - this.now;
    this.day = Math.floor(distance / this._day);
    this.hours = Math.floor((distance % this._day) / this._hour);
    this.minutes = Math.floor((distance % this._hour) / this._minute);
    this.seconds = Math.floor((distance % this._minute) / this._second);
  }

  verificarCodigo() {
    // console.log(this.codigo);
    // console.log(this.codigo.value);

    // if (this.codigo.value == '') {
    //   return;
    // }
    // this.service.getInvitadoCodigo(this.codigo.value!).subscribe(res => {
    //   console.log(res);
    //   this.listaInvitados = res;
    // })
  }
  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    if(form.valid){
      console.log(form.value.codigo);
      this.service.getInvitadoCodigo(form.value.codigo!).subscribe(res => {
          console.log(res[0]);
          
          if(res.length == 0){
            this.bandera = true;
          }else{
            if(res[0].confirmar){
              this.confirmado = true;
            }else{
              this.listaInvitados = res[0];
            }
          }
        })
    }else{
      this.bandera = true;
    }
  }

  toggleVisibility(event : any){
    console.log(event);
    console.log(event.currentTarget.checked);
    console.log(event.currentTarget.value);

    //if(event.currentTarget.checked){

//      this.listaInvitados.integrantes.filter((fil : any) => fil.nombre == event.currentTarget.value);

      for(let obj of this.listaInvitados.integrantes){
        if(obj.nombre == event.currentTarget.value ){
          obj.confirmar = event.currentTarget.checked;
        }
      }
      console.log(this.listaInvitados);
      //this.listaInvitados.confirmar = event.currentTarget.checked;
  }

  guardar(){
    for(let obj of this.listaInvitados.integrantes){
       if(obj.confirmar) this.checking= true;
    }

    if(this.checking || this.listaInvitados.mensaje !=''){
      this.listaInvitados.confirmar = true;
      this.service.update(this.listaInvitados);
    }else{
      this.cerrar();
    }
  }

  cerrar(){
    this.bandera = false;
    this.confirmado = false;
    this.listaInvitados = undefined
  }
}
