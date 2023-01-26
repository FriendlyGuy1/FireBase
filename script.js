import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, set ,ref,onValue,push,remove,get,child,update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./scripts/firebase.js";

const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

import { registerNewUser } from "./scripts/Register.js";
import {loginUser} from "./scripts/Login.js";
import {SignOut} from "./scripts/SignOut.js"
import { IsUserAdmin } from "./scripts/Admin/CheckIfUserIsAdmin.js";
import {DeleteButton} from "./scripts/DeleteButton.js"
import {UpdateButton,ConfirmUpdate} from "./scripts/UpdateButton.js"
import {DisplayCheck} from "./scripts/DisplayCheck.js"

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
let UpdateBtn = document.getElementById("Update")
let ConfirmUpdateBtn = document.getElementById("UpdateInfoBtn")

let CategoryInput = document.getElementById("CategoryInp")
let SubmitBtn = document.getElementById("SubmitCategory")

SubmitBtn.addEventListener("click", ()=>{
  if(CategoryInput.value === ""){
    alert("Input cant be empty!")
  }
  else{
    push(ref(database, 'users/' + "/Categories"), {
      Categories: CategoryInput.value
    });
    CategoryInput.value = ""
  }
})

// Delete Button
DeleteBtn.addEventListener("click", DeleteButton)
// Update Button
UpdateBtn.addEventListener("click", UpdateButton)
// Confirming Info Update
ConfirmUpdateBtn.addEventListener("click", ConfirmUpdate)


// check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    IsUserAdmin()
    // gets users username
    get(ref(database, `users/${uid}` )).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        if(data.user_username == ""){
          document.getElementById("UsernameBtn").append("Guest")
        }else{
          document.getElementById("UsernameBtn").append(data.user_username)
        }
    }
  }).catch((error) => {
    console.error(error);
  });

  onValue(ref(database, "users/" + "/Categories"), (snapshot) =>{
    const data = snapshot.val()
    document.getElementById("Category").innerHTML = ""
    for(let j = 0; j < Object.keys(data).length; j++){
      let keys = Object.keys(data)[j]
      document.getElementById("Category").innerHTML += "<option>" + data[keys].Categories + "</option>"
      document.getElementById("UpdCategory").innerHTML += "<option>" + data[keys].Categories + "</option>"
    }
  })
  
  onValue(ref(database, "users/"), (snapshot) =>{
    const Newdata= snapshot.val()
    document.getElementById("tbodyAdmin").innerHTML = ""
    document.getElementById("tbodyAll").innerHTML = ""
    let Count = 0
    for(let j = 1; j<Object.keys(Newdata).length;j++){
      let keys = Object.keys(Newdata)[j]
      
      onValue(ref(database, "users/" + keys + "/posts"), (snapshot)=>{
        const data = snapshot.val()
        if(data !== null){
          for(let k= 0; k<Object.keys(data).length;k++){
            Count+=1
            let keys = Object.keys(data)[k]
            document.getElementById("tbodyAdmin").innerHTML += "<tr><td>"+ (Count) +"</td><td>"+data[keys].Title+"</td><td>"+data[keys].Category+"</td><td>"+data[keys].Description+"</td><td>"+data[keys].Price+"</td><td><img height='100' width = '150'src="+data[keys].Images+"></td></tr>";
            if(auth.currentUser.uid === Object.keys(Newdata)[j]){
              continue;
            }
            document.getElementById("tbodyAll").innerHTML += "<tr><td>"+ (Count) +"</td><td>"+data[keys].Title+"</td><td>"+data[keys].Category+"</td><td>"+data[keys].Description+"</td><td>"+data[keys].Price+"</td><td><img height='100' width = '150'src="+data[keys].Images+"></td><td><i class='fa-regular fa-star fa-2x' id='Favorite' onclick='changeIcon(this)'></i>"+"</td></tr>";
          }
        }
      })
    }
  })

    console.log("user is logged in")
    document.getElementById("login-box").style.display="none"
    document.getElementById("AdminDiv").style.display="none"
    document.getElementById("top-right-buttons").style.display="block"
    document.getElementById("CreatePost").style.display="none"
    document.getElementById("MainPage").style.display="block"
    document.getElementById("FavoritePage").style.display="none"

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
          Images: Images.value,
          UserId: uid
        });
      }
    })

    //Prints out all posts of user
    onValue(ref(database,"users/" + uid + `/posts`), (snapshot) => {
      const data = snapshot.val();
      
      //check for data
      if(data !== null){
        output.innerHTML = ""
        PostCount.innerHTML = ""
        for(let j = 0; j < Object.keys(data).length; j++){
          let keys = Object.keys(data)[j]
          console.log()
          output.innerHTML += "<tr><td>"+ (j+1) +"</td><td>"+data[keys].Title+"</td><td>"+data[keys].Category+"</td><td>"+data[keys].Description+"</td><td>"+data[keys].Price+"</td><td><img height='100' width = '150'src="+data[keys].Images+"></td></tr>";
          PostCount.innerHTML += "<option>" + (j+1) + "</option>"
        }
      }
      else {
        output.innerHTML = ""
        PostCount.innerHTML = ""
        PostCount.innerHTML += "<option>" + "--There are no posts--" + "</option>" 
      }
    })

  } else {
    //signed out
    document.getElementById("CreatePost").style.display="none"
    document.getElementById("AdminDiv").style.display="none"
    document.getElementById("login-box").style.display="block"
    document.getElementById("MainPage").style.display="none"
    document.getElementById("FavoritePage").style.display="none"
    document.getElementById("top-right-buttons").style.display="none"
  }
});

// Sign Out
document.getElementById("signOut").addEventListener("click", SignOut)

DisplayCheck()

// console.log(document.getElementById("Favorite"))
// if (document.getElementById("Favorite")){
//   document.getElementById("Favorite").addEventListener("click",()=>{
//     console.log("heyo")
//   })  
// }
