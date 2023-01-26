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
              document.getElementById("AdminPan").addEventListener("click", () => {
                document.getElementById("CreatePost").style.display="none"
                document.getElementById("top-right-buttons").style.display="block"
                document.getElementById("MainPage").style.display="none"
                document.getElementById("login-box").style.display="none"
                document.getElementById("AdminDiv").style.display="block"
              })
          }else {
            if(document.getElementById("AdminPan") !== null ){
              document.getElementById("AdminPan").remove()
            }
          }
        })
        }
      })
}
