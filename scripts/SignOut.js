import { getAuth,signOut} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const auth = getAuth();

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

