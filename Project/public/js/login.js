/* eslint-disable */

const login = async (email, password) =>{
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data:{
                email,
                password
            }
        });
        if(res.data.status === 'success'){
            location.assign('/')
        }
    }catch(err){
        console.log(err.response.data);
    }
}
const form=document.querySelector('.form');
if(form){
    form.addEventListener('submit', e=>{
        e.preventDefault();
        const email=document.getElementById("email").value;
        const password=document.getElementById("password").value;
        login(email, password);
    });
}

const logout = async () =>{
    console.log("aici?");
    try{
        const res=await axios.get('http://127.0.0.1:3000/api/v1/users/logout');
        if (res.status === 200){
            location.reload(true);
        }
    }catch{
        console.log("error loggin out");
    }
}
const logoutButton=document.querySelector('.nav__el--logout');
if(logoutButton){
    logoutButton.addEventListener('click', logout);
}