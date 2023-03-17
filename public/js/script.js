const search = document.querySelector("#search")
document.querySelector('#copyright').textContent += new Date().getFullYear()

search.oninput = function(){
    console.log(this.value);
}

window.onscroll = ()=>{
    if(window.scrollY > 80)
        document.querySelector('nav').style.padding = '15px 7.5px'
    else 
        document.querySelector('nav').style.padding = '20px 10px'
}