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


//Admin//
document.getElementById("BackToMain").addEventListener("click", ()=> {
  document.getElementById("login-box").style.display="none"
  document.getElementById("AdminDiv").style.display="none"
  document.getElementById("MainDiv").style.display="block"
})

document.getElementById("AdminPanel").style.display="none"

let CategoryInput = document.getElementById("CategoryInp")
let SubmitBtn = document.getElementById("SubmitCategory")

SubmitBtn.addEventListener("click", ()=>{

  console.log(auth.currentUser)
  if(CategoryInput.value === ""){
    alert("Input cant be empty!")
  }
  else{
    push(ref(database, 'users/' + "/Categories"), {
      Categories: CategoryInput.value
    });
  }
})

onValue(ref(database, "users/" + "/Categories"), (snapshot) =>{
  const data = snapshot.val()
  document.getElementById("Category").innerHTML = ""
  for(let j = 0; j < Object.keys(data).length; j++){
    let keys = Object.keys(data)[j]
    document.getElementById("Category").innerHTML += "<option>" + data[keys].Categories + "</option>"
  }
})

onValue(ref(database, "users/"), (snapshot) =>{
  const data= snapshot.val()
  document.getElementById("tbodyAdmin").innerHTML = ""
  let Count = 0
  for(let j = 1; j<Object.keys(data).length;j++){
    let keys = Object.keys(data)[j]
    onValue(ref(database, "users/" + keys + "/posts"), (snapshot)=>{
      const data = snapshot.val()
      if(data !== null){

        for(let k= 0; k<Object.keys(data).length;k++){
          Count+=1
          let keys = Object.keys(data)[k]
          document.getElementById("tbodyAdmin").innerHTML += "<tr><td>"+ (Count) +"</td><td>"+data[keys].Title+"</td><td>"+data[keys].Category+"</td><td>"+data[keys].Description+"</td><td>"+data[keys].Price+"</td><td><img height='100' width = '150'src="+data[keys].Images+"></td></tr>";
        }
      }
    })
  }
})
//Admin//


// check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user)

    console.log("user is logged in")
    document.getElementById("login-box").style.display="none"
    document.getElementById("AdminDiv").style.display="none"
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
          Images: Images.value,
          UserId: uid
        });
      }
    })

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
      }
      else {
        console.log("hello user")
      }
    
    })
    //Prints out all posts of user
    onValue(ref(database,"users/" + uid + `/posts`), (snapshot) => {
      const data = snapshot.val();
      
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
    // document.getElementById("MainDiv").style.display="none"

  } else {
    //signed out
    document.getElementById("MainDiv").style.display="none"
    document.getElementById("AdminDiv").style.display="none"
    document.getElementById("login-box").style.display="block"
  }
});

// onValue(ref(database, "users/"), (snapshot) =>{
//   const data= snapshot.val()
//   document.getElementById("tbodyAll").innerHTML = ""
//   let Count = 0
//   for(let j = 1; j<Object.keys(data).length;j++){
//     let keys = Object.keys(data)[j]
//     onValue(ref(database, "users/" + keys + "/posts"), (snapshot)=>{
//       const data = snapshot.val()
//       if(data !== null){
//         for(let k= 0; k<Object.keys(data).length;k++){
//           Count+=1
//           let keys = Object.keys(data)[k]
//           document.getElementById("tbodyAll").innerHTML += "<tr><td>"+ (Count) +"</td><td>"+data[keys].Title+"</td><td>"+data[keys].Category+"</td><td>"+data[keys].Description+"</td><td>"+data[keys].Price+"</td><td><img height='100' width = '150'src="+data[keys].Images+"></td></tr>";
//         }
//       }
//     })
//   }
// })

// Sign Out
document.getElementById("signOut").addEventListener("click", SignOut)

