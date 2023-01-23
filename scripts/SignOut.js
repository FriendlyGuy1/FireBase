import { getAuth,signOut} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

const app =initializeApp(firebaseConfig);
const auth = getAuth(app);

let output = document.getElementById("tbody");
let PostCount = document.getElementById("PostCount")

function SignOut(){
    signOut(auth).then(() => {
        output.innerHTML = ""
        PostCount.innerHTML = ""
        window.location.reload();

      }).catch((error) => {
        console.log(error)
      });
}


export {SignOut}

