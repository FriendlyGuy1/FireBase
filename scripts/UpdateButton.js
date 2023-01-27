import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase,ref,get,update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./firebase.js";

const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();




export function UpdateButton(){
    get(ref(database, `users/${auth.currentUser.uid}/posts` )).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        get(ref(database, `users/${auth.currentUser.uid}/posts/${Object.keys(data)[PostCount.value-1]}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let Newdata = snapshot.val()
            UpdTitle.value = Newdata.Title
            UpdCategory.value = Newdata.Category
            UpdDescription.value = Newdata.Description
            UpdPrice.value = Newdata.Price
            UpdImages.value = Newdata.Images
            
          } else {
            console.log("No data available");
          }
        })
      }
      else{
        alert("You have no posts available")
      }
    })
}


export function ConfirmUpdate(){
    get(ref(database, `users/${auth.currentUser.uid}/posts` )).then((snapshot) => {
      let data = snapshot.val()
      update(ref(database, `users/${auth.currentUser.uid}/posts/${Object.keys(data)[PostCount.value-1]}`) ,{
        Title: UpdTitle.value,
        Category: UpdCategory.value,
        Description: UpdDescription.value,
        Price: UpdPrice.value,
        Images: UpdImages.value
      })
    })
}



