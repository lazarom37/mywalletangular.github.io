import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth'
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth : AngularFireAuth, private router : Router) { }

  //login 
  login (email : string, password : string ){
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('userProfile', JSON.stringify(res));
      localStorage.setItem('userID', JSON.stringify(res.user?.uid));
      
      if(res.user?.emailVerified == true) {
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate(['verifyemail'])
      }
    },err => {
      alert(err.message);
      this.router.navigate(['/login']);
    })
  }

  //register method
  register(email: string, password: string){
    this.fireauth.createUserWithEmailAndPassword(email,password).then( res => {
      alert('Registeration Successful');
      this.router.navigate(['/login']);
      this.sendEmailForVerification(res.user);
    },err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  //sign out
  logout (){
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    },err => {
      alert(err.message);
    })
  }

  // forgot password
  forgotPassword(email : string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verifyemail'])
    }, err => {
      alert('ERROR: Something went wrong');
    })
  }

  //email verification
  sendEmailForVerification(user: any) {
    user.sendEmailForVerification().then((res : any) => {
      this.router.navigate(['/verifyemail'])
    }, (err : any) => {
      alert('Something went wrong. Unable to send email')
    })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      localStorage.setItem('userProfile', JSON.stringify(res));
      localStorage.setItem('userID', JSON.stringify(res.user?.uid));
      this.router.navigate(['/dashboard']);

    }, err => {
      alert(err.message);
    })
  }

  checkUserLogin() {
    if (localStorage.getItem('userID') == null) {
      return false;
    }
    return true;
  }
}
