import { createUserWithEmailAndPassword,getAuth} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, set ,ref} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();



const registerNewUser = () =>{

    const email = document.getElementById("register_email").value
    const password = document.getElementById("register_password").value
    const username = document.getElementById("register_username").value

    createUserWithEmailAndPassword(auth, email, password)

    .then((userCredential) => {
    // Signed up 
        const user = userCredential.user;

        const LoginTime = new Date()
        set(ref(database, "users/" + user.uid), {
            user_email: email,
            user_username: username,
            role: "another_user",
            last_login: LoginTime
        });

        console.log("user created")

  })
    .catch((error) => {
        if(error.code == "auth/email-already-in-use") {
            alert("The email address is already in use");
        }else if (error.code == "auth/invalid-email") {
            alert("The email address is not valid.");
        } else if (error.code == "auth/operation-not-allowed") {
            alert("Operation not allowed.");
        } else if (error.code == "auth/weak-password") {
            alert("The password is too weak.");
        }
  });
}

export {registerNewUser} 