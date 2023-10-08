// use classlist instead of style property

function getObject(object){
    return document.querySelector(`.${object}`);
}

const moverlay = getObject("overlay");
const mwindow = getObject("window");
const mclose = getObject("close");
const buttonList = document.querySelectorAll(".button");

// Method 1
// for (let index = 0; index < buttonList.length; index++) {
//     buttonList[index].addEventListener('click',
//     function(){
//         moverlay.style.display = 'block';
//         mwindow.style.display = 'block';
//     });
// }

// mclose.addEventListener('click',
// function(){
//     moverlay.style.display = 'none';
//     mwindow.style.display = 'none';
// });

// moverlay.addEventListener('click',
// function(){
//     moverlay.style.display = 'none';
//     mwindow.style.display = 'none';
// });


// Method 2

const opendwindow = function(){
    moverlay.classList.remove("hidden");
    mwindow.classList.remove("hidden");
}

const closewindow = function(){
    moverlay.classList.add("hidden");
    mwindow.classList.add("hidden");
}

const escpress = function(event){
    console.log(event.key);
    if(event.key === 'Escape' && !moverlay.classList.contains("hidden") && !mwindow.classList.contains("hidden")){
        closewindow();
    }
}


for (let index = 0; index < buttonList.length; index++) {
    buttonList[index].addEventListener('click',opendwindow);
}

mclose.addEventListener('click', closewindow);

moverlay.addEventListener('click', closewindow);

document.addEventListener('keydown', escpress);


// VERY VERY IMPORTANT 💥💥💥
// mclose.addEventListener('click',closewindow());
// this does not work because when the addEventListener is interepreted
// the function is excecuted immediatly
// but the code below is just a expression 
// so it is excecuted only when addEventListener is called and closewindow
// expression is evaluated or called by the addEventListener