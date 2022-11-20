class ConsultaFactory{ // CRIANDO A FABRICA DE TRATAMENTO DE DADOS

    Build(simpleconsultas){

        var day = simpleconsultas.date.getDate()+1;
        var month = simpleconsultas.date.getMonth();
        var year = simpleconsultas.date.getFullYear();

        var hour = Number.parseInt(simpleconsultas.time.split(':')[0]);
        var minute = Number.parseInt(simpleconsultas.time.split(':')[1]);

        var startdate = new Date(year,month,day,hour,minute,0,0);
       // startdate.setHours( startdate.getHours() - 3);
        
        var consulta = { // PASSANDO UMA VARIAVEL CONTENDO OS DADOS "TRATADOS"
            id: simpleconsultas._id,
            title: simpleconsultas.name,
            start: startdate,
            end: startdate,
            email: simpleconsultas.email,
            notified: simpleconsultas.notified
        }

        return consulta;
    }

}


module.exports = new ConsultaFactory();