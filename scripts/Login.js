import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase,ref,update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const loginUser = () => {
    const login_email = document.getElementById("login_email").value
    const login_password = document.getElementById("login_password").value

    signInWithEmailAndPassword(auth, login_email,login_password)

    .then((userCredential) => {
        // Signed in 
            const user = userCredential.user;
            const LoginTime = new Date()
            update(ref(database, "users/" + user.uid), {
                last_login: LoginTime
            })
            console.log(user,"Login Successful")

    
      })
        .catch((error) => {
            if(error.code == "auth/wrong-password"){
                alert("Wrong Password")
            }
            console.log(error)
      });
}

export {loginUser}