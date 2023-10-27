import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth'
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth : AngularFireAuth, private router : Router) { }

  private isLoggedIn: boolean = false;

  //login 
  login (email : string, password : string ){
    this.fireauth.signInWithEmailAndPassword(email,password).then(() => {
      localStorage.setItem('token','true');
      // this.router.navigate(['/dashboard']);
      this.router.navigate(['dashboard']);
      this.isLoggedIn = true;
    },err => {
      alert(err.message);
      this.router.navigate(['/login']);
      this.isLoggedIn = false;
    })
  }

  //register method
  register(email: string, password: string){
    this.fireauth.createUserWithEmailAndPassword(email,password).then(() => {
      alert('Registeration Successful');
      this.router.navigate(['/login']);
      this.isLoggedIn = true;
    },err => {
      alert(err.message);
      this.router.navigate(['/register']);
      this.isLoggedIn = false;
    })
  }

  //sign out
  logout (){
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      this.isLoggedIn = false;
    },err => {
      alert(err.message);
    })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

      localStorage.setItem('token', JSON.stringify(res.user?.uid));
      this.router.navigate(['/dashboard']);
      this.isLoggedIn = true;

    }, err => {
      alert(err.message);
      this.isLoggedIn = false;
    })
  }
}
