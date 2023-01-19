import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, set ,ref,onValue,push,remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./scripts/firebase.js";

const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

import { registerNewUser } from "./scripts/Register.js";
import {loginUser} from "./scripts/Login.js";
import {SignOut} from "./scripts/SignOut.js"

// Register
document.getElementById("signUp").addEventListener("click",registerNewUser)

// Login
document.getElementById("signIn").addEventListener("click",loginUser)

let Title = document.getElementById("Title");
let Category = document.getElementById("Category");
let Description = document.getElementById("Description");
let Price = document.getElementById("Price");
let Images = document.getElementById("Images");

let output = document.getElementById("tbody");
let PostCount = document.getElementById("PostCount")

let DeleteBtn = document.getElementById("Delete")

document.getElementById("AdminPanel").style.display="none"

// check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

    console.log(user)

    console.log("user is logged in")    
    document.getElementById("login-box").style.display="none"
    document.getElementById("MainDiv").style.display="block"

    // Input
    document.getElementById("Insert").addEventListener("click", ()=> {
      //checks if Image link is a valid image
      let isImageLink = Images.value.match(/\.(jpeg|jpg|gif|png)$/) != null;

  
      if(Title.value === "" || Category.value === "" || Description.value === "" || Price.value === "" || Images.value === ""){
        alert("You forgot to enter some information!")
      }
      else if(isImageLink === false){
        alert("image link is not correct")
      }
      else {
        const postListRef = ref(database, 'users/' + uid + "/posts");
        const newPostRef = push(postListRef);
        set(newPostRef, {
          Title: Title.value,
          Category: Category.value,
          Description: Description.value,
          Price: Price.value,
          Images: Images.value
        });
      }
    })
    //Prints out all posts of user
    onValue(ref(database,"users/" + uid + `/posts`), (snapshot) => {
      
      const data = snapshot.val();

      onValue(ref(database,"users/" + uid), (snapshot) => {
        const data = snapshot.val()
        if(data.role === "admin"){
          document.getElementById("AdminPanel").style.display="block"
          console.log("hello admin")
          document.getElementById("AdminPanel").addEventListener("click", () => {
            window.location.href="./AdminPanel/admin.html"
            })
        }
        else {
          console.log("hello user")
        }
  
      })
      
      //check for data
      if(data !== null){

        // DeleteBtn.addEventListener("click",() => {
        //   console.log(PostCount.value)
        //   if(isNaN(PostCount.value)){
        //     console.log(Object.keys(data)[PostCount.value])
        //     alert("You have no posts available")
        //   }else {
        //     let Confirmation = false
        //     Confirmation = confirm(`Are you sure you want to delete #${PostCount.value} Post`)
        //     console.log(Confirmation)
        //     if(Confirmation == true){
        //       remove(ref(database, "users/" + uid + "/posts" + `/${Object.keys(data)[PostCount.value-1]}`))
        //       console.log(Object.keys(data)[PostCount.value-1])
        //     }
        //   }
        // })

        output.innerHTML = ""
        PostCount.innerHTML = ""
        for(let j = 0; j < Object.keys(data).length; j++){
          let keys = Object.keys(data)[j]
          output.innerHTML += "<tr><td>"+ (j+1) +"</td><td>"+data[keys].Title+"</td><td>"+data[keys].Category+"</td><td>"+data[keys].Description+"</td><td>"+data[keys].Price+"</td><td><img height='100' width = '150'src="+data[keys].Images+"></td></tr>";
          PostCount.innerHTML += "<option>" + (j+1) + "</option>"
        }
      }
      else {
        DeleteBtn.addEventListener("click", () => {
          alert("You have no posts available")
        })
        output.innerHTML = ""
        PostCount.innerHTML = ""
        PostCount.innerHTML += "<option>" + "--There are no posts--" + "</option>" 
      }
    })


  } else {
    //signed out
    document.getElementById("MainDiv").style.display="none"
    document.getElementById("login-box").style.display="block"
  }
});

// Sign Out
document.getElementById("signOut").addEventListener("click", SignOut)



// const name = async (event) => {
//   preventdefault
// }