import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase,ref,remove,get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./firebase.js";

const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();




export function DeleteButton(){
    get(ref(database, `users/${auth.currentUser.uid}/posts` )).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          let Confirmation = false
          Confirmation = confirm(`Are you sure you want to delete #${PostCount.value} Post`)
            if(Confirmation === true){
              remove(ref(database, "users/" + auth.currentUser.uid + "/posts" + `/${Object.keys(data)[PostCount.value-1]}`))
            }
        }
        else{
          alert("You have no posts available")
        }
      })
}
