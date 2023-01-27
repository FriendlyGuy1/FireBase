export function DisplayCheck(){
    document.getElementById("post").addEventListener("click",()=>{
        document.getElementById("login-box").style.display="none"
        document.getElementById("AdminDiv").style.display="none"
        document.getElementById("top-right-buttons").style.display="block"
        document.getElementById("CreatePost").style.display="block"
        document.getElementById("MainPage").style.display="none"
        document.getElementById("FavoritePage").style.display="none"
      })
      
      document.querySelectorAll("h1").forEach(element => {
        document.getElementById("MainDiv").addEventListener("click",()=>{
          document.getElementById("login-box").style.display="none"
            document.getElementById("AdminDiv").style.display="none"
            document.getElementById("top-right-buttons").style.display="block"
            document.getElementById("CreatePost").style.display="none"
            document.getElementById("MainPage").style.display="block"
            document.getElementById("FavoritePage").style.display="none"
        })
      
        element.addEventListener("click", ()=>{
            document.getElementById("login-box").style.display="none"
            document.getElementById("AdminDiv").style.display="none"
            document.getElementById("top-right-buttons").style.display="block"
            document.getElementById("CreatePost").style.display="none"
            document.getElementById("MainPage").style.display="block"
            document.getElementById("FavoritePage").style.display="none"
        })
      });

      document.getElementById("FavoritePageBtn").addEventListener("click", ()=>{
        document.getElementById("login-box").style.display="none"
        document.getElementById("AdminDiv").style.display="none"
        document.getElementById("top-right-buttons").style.display="block"
        document.getElementById("CreatePost").style.display="none"
        document.getElementById("MainPage").style.display="none"
        document.getElementById("FavoritePage").style.display="block"
      })
}