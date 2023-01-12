import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, set ,ref,update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./firebase.js";

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
        console.log(error)
  });
}

document.getElementById("signUp").addEventListener("click",registerNewUser)


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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("user is logged in")    
    document.getElementById("login-box").style.display="none"
    document.getElementById("MainDiv").style.display="block"


  } else {
    document.getElementById("MainDiv").style.display="none"
    document.getElementById("login-box").style.display="block"

    console.log("user is signed out")
  }
});


document.getElementById("signOut").addEventListener("click", () =>{
    signOut(auth).then(() => {
        console.log("Signed out")
      }).catch((error) => {
        console.log(error)
      });
})

let i = 0

function AddToTable(){
  i+=1;

  let Title = document.getElementById("Title");
  let Category = document.getElementById("Category");
  let Description = document.getElementById("Description");
  let Price = document.getElementById("Price");
  let Images = document.getElementById("Images")

  let output = document.getElementById("tbody")

  output.innerHTML += "<tr><td>"+i+"</td><td>"+Title.value+"</td><td>"+Category.value+"</td><td>"+Description.value+"</td><td>"+Price.value+"</td><td><img height='100' width = '150'src="+Images.value+"></td></tr>";

  // let userId = push(child(ref(database), "users")).key

  // set(ref(database, 'users/' + userId), {
  //   something: Title
  // });
  

}

document.getElementById("Insert").addEventListener("click",AddToTable)


function RemoveFromTable(){
  document.querySelector(".table").deleteRow(i)
  i-=1;
}

document.getElementById("Delete").addEventListener("click",RemoveFromTable)