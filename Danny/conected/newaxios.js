axios.get('http://localhost:8080/getcalendar').then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
    
})

function createdConsulta(){ // FUNÇÃO DE CRIAR O GAME
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var description = document.getElementById("description");
    var number = document.getElementById("number");
    var date = document.getElementById("date");
    var time = document.getElementById("time");
    var cpf = document.getElementById("cpf");

    var consulta = {
        name: name.value,
        email: email.value,
        description: description.value,
        cpf: cpf.value,
        number: number.value,
        date: date.value,
        time: time.value

    }

    axios.post('http://localhost:8080/create',consulta).then((r)=>{
            alert('Consulta Cadastrada!');
            window.location.href = './index.html'
    }).catch((err)=>{
        console.log(err)
    })
}

function GetByCpf(){
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var number = document.getElementById("number");
    var cpf = document.getElementById("cpf");

    var value = cpf.value;

    axios.get('http://localhost:8080/consult/' + value).then((r)=>{
        console.log(r);
        name.value = r.data.name;
        email.value = r.data.email;
        number.value = r.data.number
    }).catch((err) => {
        console.log(err);
    })

}