import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../Interface/Mensaje';
import { map } from 'rxjs/operators' ;
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor( private afs: AngularFirestore,
               public afAuth: AngularFireAuth  ) {
    this.afAuth.authState.subscribe(user => {
      console.log('Estado del usuairo', user);
      
      if (!user) {
         return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges()
    .pipe(
      map((mensajes: Mensaje[]) => {
          console.log(mensajes);
          this.chats = [];
          
          for ( let mensaje of mensajes) {
             this.chats.unshift(mensaje);
          }
          return this.chats;
      }));
  }


  agregarMensaje(texto: string) {
    let mensaje: Mensaje = {
        nombre: this.usuario.nombre,
        mensaje: texto,
        fecha: new Date().getTime(),
        uid: this.usuario.uid
    };
    return this.itemsCollection.add(mensaje);
  }

  login(proveedor: string) {
    this.afAuth.auth.signInWithPopup(new auth. GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
