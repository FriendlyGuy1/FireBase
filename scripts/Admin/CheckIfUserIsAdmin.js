import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase,ref,onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "../firebase.js";

const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();



export function IsUserAdmin(){
    onAuthStateChanged(auth, (user) => {
        if(user){
          console.log(auth.currentUser)
          onValue(ref(database,"users/" + auth.currentUser.uid), (snapshot) => {
          const data = snapshot.val()
          if(data.role === "admin"){
            document.getElementById("AdminPanel").style.display="block"
            console.log("hello admin")
            document.getElementById("AdminPanel").addEventListener("click", () => {
              document.getElementById("MainDiv").style.display="none"
              document.getElementById("login-box").style.display="none"
              document.getElementById("AdminDiv").style.display="block"
            })
        }else {
          console.log("hello user")
        }
      })
        }
      })
}
