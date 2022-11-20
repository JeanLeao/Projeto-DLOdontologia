const consulte = require('../models/Consulta.js')
const ConsultaFactory = require('../Factory/ConsultaFactory.js')
const mailer = require('nodemailer'); 

class ConsultaService { // CLASSE PARA TRABALHAR O MONGOOSE

    async Create(name, email, description, number, date, time, cpf){ // TRABALANDO O CREATE DO MONGO
        var consulta = new consulte ({
            name: name, 
            email: email, 
            description: description,
            number: number, 
            date: date, 
            time: time,
            cpf: cpf,
            finished: false,
            notified: false
        });
        try{
            await consulta.save();
            return true;
        }catch(err){
            console.log(err)
            return false;
        }
    }

    async GetAll(showFineshed){ // PEGANDO TODAS AS INFORMAÇÕES DE PACIENTES NO PARAMETRO (FALSE, TRUE) PARA O FULL CALENDAR

        if(showFineshed){
            try{
                var consultas = await consulte.find({});
                var consultaProcessed  = []
     
                consultas.forEach((consulta) => {
                    if(consulta.date != undefined){
                        consultaProcessed.push(ConsultaFactory.Build(consulta)/*Enviando Para A Fabrica Tratar os Dados!*/);
                    }
                })
    
                return consultaProcessed;
            }catch (err){
                return console.log(err)
            }
        }else{

            var consultas = await consulte.find({finished: false});
            var consultaProcessed  = []
 
            consultas.forEach((consulta) => {
                if(consulta.date != undefined){
                    consultaProcessed.push(ConsultaFactory.Build(consulta)/*Enviando Para A Fabrica Tratar os Dados!*/);
                }
            })

            return consultaProcessed;

        }

    }

    async GetById(id){ // PEGANDO PACIENTE POR ID
        try{
            var event = await consulte.findById(id);
            return event;
        }catch(err){
            console.log(err);
        }
    }

    async GetByCpf(cpf){ // PEGANDO PACIENTE POR ID
        try{
            var event = await consulte.findOne({cpf: cpf});
            return event;
        }catch(err){
            console.log(err);
        }
    }

    async Finish(id){ // ALTERANDO UM ATRIBUTO FINALIZADO POR ID
     try{
        var event = await consulte.findOneAndUpdate({_id: id},{finished: true});
        return true;
    }catch(err) {
            console.log(err)
            return false;
        }

    }
    
    async Notified(id){ // FAZENDO UMA NOTIFICAÇÃO POR ID
        try{
            var event = await consulte.findOneAndUpdate({_id: id},{notified: true});
            return true;
        }catch(err) {
                console.log(err)
                return false;
            }
    }

    async SendNotification(){  // ENVIANDO EMAIL POR NODEMAILER
       var consultas = await this.GetAll(false)
       var trasporter = mailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 25,
            auth: {
                user: "21ab9fcafa3e9c",
                pass: "89009ca0f0df12"
            }
        });


       consultas.forEach(async (consulta) => {
            var date = consulta.start.getTime(); // PEGANDO A HORA
            var hour = 1000 * 60 * 60;
            var gap = date-Date.now();
            if(gap <= hour){
                if(consulta.notified === false){
                    var inf = await this.GetById(consulta.id);
                    await this.Notified(consulta.id);
                    fetch('http://localhost:8080/messagewpp/'+inf.number +'/' + inf.name + '/' + inf.time).then(() => {
                        console.log('Mensagem Enviada!')
                    })
                    trasporter.sendMail({
                        from: "Jean Leao <jean@teste.com.br>",
                        to: consulta.email,
                        subject: "Sua Consulta É Hoje!, Fique atento!",
                        text: "Hoje é sua consulta é hoje fique atento pois não perca o horário."
                    }).then(() =>{
                        console.log('Foi enviado email')
                    }).catch((err) => {
                        console.log(err)
                    })


                }
            }
       })
    
    }

    async GetPerson(cpf){
        try{
            var event = await consulte.find({cpf: cpf});
            return event;
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new ConsultaService();