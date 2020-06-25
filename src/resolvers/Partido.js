import "babel-polyfill"
const Partido = {
    nombre1:async (parent,args,ctx,info) =>{
        const {client} = ctx;
        const {nombre1} = parent;

        console.log(nombre1);
        const db = client.db("Practica5");
        const collection = db.collection("equipo");
        const equipoEncontrado = await collection.findOne({nombre:nombre1});
        console.log(`Equipo encontrado ${equipoEncontrado}`);
       // if(!equipoEncontrado)throw new Error('Unexpected error');
        return equipoEncontrado;
    },
    nombre2:async (parent,args,ctx,info) =>{
        const {client} = ctx;
        const {nombre2} = parent;
        const db = client.db("Practica5");
        const collection = db.collection("equipo");
        const equipoEncontrado = await collection.findOne({nombre: nombre2});
        //if(!equipoEncontrado)throw new Error('Unexpected error');
        return equipoEncontrado;
    }
}
export {Partido as default};