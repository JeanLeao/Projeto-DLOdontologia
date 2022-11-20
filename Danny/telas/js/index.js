var ValueEventClient = undefined;

axios.get('http://localhost:8080/getcalendar').then((res) => {
var element = document.getElementById("calendar");
var calendar = new FullCalendar.Calendar(element,{
    initalView: 'dayGridMonth',
    locale: 'pt-br',
    events: res.data,
    eventClick: (info) =>{ // EVENTO CLICK FULL CALENDAR

        var value = info.event.id
        axios.get('http://localhost:8080/event/'+value).then((res) => {
            console.log(res)
            ValueEventClient = res;
            window.location.href = './eventclick.html'
            localStorage.setItem("teste", res.data._id);
        })
    }
})
calendar.render();
    }).catch((err) => {
        console.log(err)
})

function Person(){
    var cpfInput = document.getElementById("cpf");
    var cpf = cpfInput.value;
    axios.get('http://localhost:8080/consult/person/'+cpf).then((res) => {
        if(res.data[0] == undefined){
            console.log('Nada encontrado')
        }else{
            localStorage.setItem("cpf", cpf);
            window.location.href = './collectionConsults.html'
        }
    })
}







