import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, set ,ref,update,onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./firebase.js";

const app =initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// register
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
        console.log(error)
  });
}

document.getElementById("signUp").addEventListener("click",registerNewUser)


// login
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
            console.log(error)
      });
}


document.getElementById("signIn").addEventListener("click",loginUser)

let Title = document.getElementById("Title");
let Category = document.getElementById("Category");
let Description = document.getElementById("Description");
let Price = document.getElementById("Price");
let Images = document.getElementById("Images");

let output = document.getElementById("tbody");

// check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("user is logged in")    
    document.getElementById("login-box").style.display="none"
    document.getElementById("MainDiv").style.display="block"

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
        update(ref(database,"users/" + uid + `/posts` + `/${Title.value}`), {
          Title: Title.value,
          Category: Category.value,
          Description: Description.value,
          Price: Price.value,
          Images: Images.value
        })
        i+=1;
      }
    })
    onValue(ref(database,"users/" + uid + `/posts` + `/${Title.value}`), (snapshot) => {
      const data = snapshot.val();
      if(data !== null){
        output.innerHTML = ""
        for(let j = 0; j < Object.keys(data).length; j++){
          let keys = Object.keys(data)[j]
          output.innerHTML += "<tr><td>"+ (j+1) +"</td><td>"+data[keys].Title+"</td><td>"+data[keys].Category+"</td><td>"+data[keys].Description+"</td><td>"+data[keys].Price+"</td><td><img height='100' width = '150'src="+data[keys].Images+"></td></tr>";
        }
      }
    })


  } else {
    //signed out
    document.getElementById("MainDiv").style.display="none"
    document.getElementById("login-box").style.display="block"
  }
});

// sign out
document.getElementById("signOut").addEventListener("click", () =>{
    signOut(auth).then(() => {
        console.log("Signed out")
        output.innerHTML = ""
        window.location.reload();

      }).catch((error) => {
        console.log(error)
      });
})


// function RemoveFromTable(){
//   document.querySelector(".table").deleteRow(i)
//   i-=1;
// }

// document.getElementById("Delete").addEventListener("click",RemoveFromTable)
