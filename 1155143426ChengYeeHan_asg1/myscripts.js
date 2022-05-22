//Name: ChengeYeeHan
//SID: 1155143426
function displaybutton() {
    let display_button = document.getElementById("hiddenbutton");
    if (display_button.style.display == "none")
        display_button.style.display = "block";
    else
        display_button.style.display = "none";
  }

function align() {
    let s1 = document.getElementById("s1_h"); 
    let s2 = document.getElementById("s2_h");
    let s3 = document.getElementById("s3_h");  
    let s4 = document.getElementById("s4_h"); 
    let s5 = document.getElementById("s5_h"); 
    if(s1.style.textAlign==="center"){
        s1.style.textAlign = "right";
        s2.style.textAlign = "right";
        s3.style.textAlign = "right";
        s4.style.textAlign = "right";
        s5.style.textAlign = "right";
    }
    else if(s1.style.textAlign==="right"){
        s1.style.textAlign = "left";
        s2.style.textAlign = "left";
        s3.style.textAlign = "left";
        s4.style.textAlign = "left";
        s5.style.textAlign = "left";
    }
    else{
        s1.style.textAlign = "center";
        s2.style.textAlign = "center";
        s3.style.textAlign = "center";
        s4.style.textAlign = "center";
        s5.style.textAlign = "center";
        }
}

function add(){
    let i = prompt("Enter a new hobby: ", "your hobby");
    if (i != null) {
        let item = document.createElement("li");
        let node = document.createTextNode(i);
        item.appendChild(node);
        let child = document.querySelector("#hobby").nextElementsibling;
        document.querySelector("#hobby").insertBefore(item,child);
    }
}

function display_progressbar(){
    let display_pb = document.getElementById("bar");
    if (display_pb.style.display == "none") {
        display_pb.style.display = "block";
    } else {
        display_pb.style.display = "none";
    }
    
}


window.onscroll = function() {scroll()};
function scroll() {
  let scrolled = (window.scrollY/ (document.body.clientHeight-window.innerHeight))*100;
  document.getElementById("progressBar").style.width = scrolled + "%";
}

function processform(){
    let checkcomment=document.querySelector("#new-comment");
    let checkemail=document.querySelector("#new-email");
 
    if(!(/[a-z]+[@]+[a-z]/.test(checkemail.value))||checkemail.value=="")
        checkemail.classList.add("is-invalid");
    else
        checkemail.classList.remove("is-invalid"); 

    if(checkcomment.value=="")
        checkcomment.classList.add("is-invalid"); 
    else
       checkcomment.classList.remove("is-invalid");

    if(checkcomment.value==""||checkemail.value==""||!(/[a-z]+[@]+[a-z]/.test(checkemail.value)))
        return false;
    
    let newComment = document.createElement("div");
    let element = '<div><svg height="100" width="100"><circle cx="50" cy="50"r="40"></svg></div><div><h5></h5><p></p></div>';
    newComment.innerHTML = element;
    newComment.className = "d-flex";
    newComment.querySelectorAll("div")[0].className = "flex-shrink-0"; // 1st div
    newComment.querySelectorAll("div")[1].className = "flex-grow-1"; // 2nd div
    let lastComment = document.querySelector("#comments").lastElementChild; // instead of lastChild for div element
    newComment.id = 'c' + (Number(lastComment.id.substr(1)) + 1);
    newComment.querySelector("h5").innerHTML = document.querySelector("#new-email").value;
    newComment.querySelector("p").innerHTML = document.querySelector("#new-comment").value;
    let color = document.querySelectorAll("input[name=new-color]:checked")[0].value;// look for checked radio buttons
    newComment.querySelector("circle").setAttribute("fill", color);
    document.querySelector("#comments").appendChild(newComment);
    document.querySelector("form").reset();
    savefile();
}

window.onload = function() {loadfile();};

function loadfile(){
    fetch('comments.txt').then(res => res.text()).then(txt => {if(txt.length>1){document.querySelector("#comments").innerHTML=txt;}})
}


function savefile(){
    let item = document.createElement("div");
    item.innerHTML=document.getElementById("comments").innerHTML;
    fetch('comments.txt', {method: 'PUT',body:item.innerHTML});
}


