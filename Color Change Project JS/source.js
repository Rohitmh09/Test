let body = document.querySelector("body");
let buttons = document.querySelectorAll(".button"); // provide array of buttons you can apply foreach
console.log(buttons);

buttons.forEach(function (button) {
  
    
  button.addEventListener("click", function (event) 
                                    {
                                     console.log(event.target);// privide you all attrivutes of button class means its id also
                                     let myId = event.target.id;
                                     
                                     switch (myId) {
                                     case "gray":
                                        body.style.backgroundColor = "gray";
                                        break; 

                                     case "pink":
                                        body.style.backgroundColor = "pink";
                                        break; 

                                     case "red":
                                        body.style.backgroundColor = "red";
                                        break; 

                                     case "white":
                                        body.style.backgroundColor = "white";
                                        break; 
                                    }
                                    })


});

const clock = document.querySelector("#clock");

setInterval(function () {
    let date = new Date();
       clock.innerHTML = date.toLocaleTimeString();
},1500);