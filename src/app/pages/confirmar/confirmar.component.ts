import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventoService } from 'src/app/services/evento.service';
declare var $ : any;
@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent implements OnInit {


  public textAreaForm: FormGroup;
  codigo = new FormControl('');

  forma: FormGroup = new FormGroup({});

  listaInvitados:any []=[];
  submitted = false;
  itemSelected : any;
  confirmados : number =0;
  noConfirmados : number =0;
  asisten : number =0;
  noAsisten : number =0;
  totalInvitados:number =0;
  constructor(private service: EventoService,private fb : FormBuilder) {
   

    this.textAreaForm = fb.group({
      textArea: ""
    });
   }

  ngOnInit() {
    this.service.getAll().subscribe(res => {
      console.log(res);
      this.listaInvitados = res;
      this.contar()
    });

    this.forma = this.fb.group({
      familia: ['',[ Validators.required, Validators.minLength(5)] ],
      invitados: this.fb.array([ ])
    })


  }

  contar(){
    this.confirmados = 0;
    this.noConfirmados = 0;
    this.asisten = 0;
    this.noAsisten =0;
    for(let fm of this.listaInvitados){
      this.totalInvitados = this.totalInvitados + fm.integrantes.length;
      if(fm.confirmar) {
        this.confirmados ++;
        for(let i of fm.integrantes){
          if(i.confirmar) this.asisten ++;
          if(!i.confirmar) this.noAsisten ++;
        }
      }else{
        this.noConfirmados ++;
      }
    }
  }

  get invitados(){
    return this.forma.get('invitados') as FormArray
  }

  get familiaNoValido(){
    return this.forma.controls['familia'].invalid && this.forma.controls['familia'].touched;
  }

  agregar(){
    this.invitados.push( this.fb.control('',Validators.required))
  }
  borrar(i: number){
    this.invitados.removeAt(i);
  }

  verificarCodigo() {
    // console.log(this.codigo);
    console.log(this.codigo.value);

    if(this.codigo.value == ''){
      return;
    }
    this.service.getInvitadoCodigo(this.codigo.value!).subscribe( res =>{
      console.log(res);
      this.listaInvitados = res;
    })
  }
  guardar(){
    if (this.forma.invalid) {
      Object.values ( this.forma.controls ).forEach( control => {
        if( control instanceof FormGroup){
          Object.values(control.controls).forEach( control => control.markAsTouched());
        }else{
          control.markAsTouched();
        }
      });
      
    }else{
      console.log(this.forma.value);
      this.service.create(this.forma.value);
       this.forma.reset();
       
       this.contar();
       this.forma = this.fb.group({
        familia: ['',[ Validators.required, Validators.minLength(5)] ],
        invitados: this.fb.array([ ])
      })
    }
  }

  borrarInvitado(){
    console.log(this.itemSelected.id)
    this.service.delete(this.itemSelected.id);
    $('#exampleModal').modal('hide');
    this.contar();
  }
  selected(item : any){
    this.itemSelected = item;
  }

}
