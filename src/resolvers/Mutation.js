import {MongoClient, ObjectID} from "mongodb";
import "babel-polyfill"
import { PubSub } from "graphql-yoga";
const Mutation ={
    addEquipo:async(parent,args,ctx,info) =>{
        const {nombre} = args;
        const  {client} = ctx;

        const db = client.db("Practica5");
        const collection = db.collection("equipo");

        if(await collection.findOne({nombre})){
            throw new Error('El equipo ya existe');
        }
        const result = await collection.insertOne(
            {nombre}
        )
        return {
            _id: result.ops[0]._id,
            nombre            
        }
    },
    addPartido:async(parent,args,ctx,info) =>{
        const {client} = ctx;
        const {nombre1,nombre2,fecha,resultado,estado} = args;
        if(nombre1 === nombre2){
            throw new Error('Error');
        }
        const db = client.db("Practica5");
        const partidos = db.collection("partidos");

        const inserted = await partidos.insertOne(
            {
            
            nombre1,
            nombre2,
            resultado,
            fecha,
            estado
            }
        )
            console.log(inserted.ops[0]);
        return inserted.ops[0];

    },
    actualizarEstadoPartido:async(parent,args,ctx,info)=>{
        const {client} = ctx;
        const {_id,estado} = args;
        const db = client.db("Practica5");
        const partidos = db.collection("partidos");
        const {pubsub} = ctx;
        console.log(estado);
        if(!await partidos.findOne({_id:ObjectID(_id)})){
            throw new Error(`Error partido no encontrado`);
        }
        if(estado !== 1){
            if(estado !== 2){
                throw new Error(`Error al introducir nuevo estado del partido`);
            }
        }

        const check = await partidos.findOne({_id:ObjectID(_id)});
        console.log(check);
        if(check.estado === estado){
            throw new Error(`No se ha modificado el valor del estado del partido`)
        }

        if(check.estado === 2 && estado ===1){
            throw new Error(`El partido ya habia terminado`);
        }

        if(check.estado === 1 && estado === 0){
            throw new Error(`El partido ya habia comenzado`);
        }

        const result = await partidos.findOneAndUpdate(
            {_id:ObjectID(_id)},
            {$set:{estado}},{returnOriginal: false}
        )


        pubsub.publish(
            _id,
            {
                subPartido: result.value
            }
        )    
        pubsub.publish(
            result.value.nombre1,
            {
                subEquipo: result.value
            }
        )   
        pubsub.publish(
            result.value.nombre2,
            {
                subEquipo: result.value
            }
        )

        
        console.log(result.value);
        return result.value;
    },
    tellYou:(parent,args,ctx,info) =>{
        const {id,value} = args;
        const{pubsub} = ctx;
        
        pubsub.publish(
            id,
            {
                tellMe:value//en el canal id publicame tellme = 1 //en este caso a porque cambiamos a por 1
            }//TODOS LOS QUE HAYAN SINTONIZADO ESE ID van a recibir un 1
        )
        return value;
    },
    updateScore:async(parent,args,ctx,info) =>{
        const {client} = ctx;
        const db = client.db("Practica5");
        const partidos = db.collection("partidos");
        const {_id,resultado} = args;
        const{pubsub} = ctx;

        const result = await partidos.findOneAndUpdate(
            {_id:ObjectID(_id)},
            {$set:{resultado}},{returnOriginal:false}
        );
        
        pubsub.publish(
            _id,
            {
                subPartido:result.value
            }
        )

        pubsub.publish(
            result.value.nombre1,
            {
                subEquipo: result.value //devolvemos el partido cuando buscamos
            }
        )

        pubsub.publish(
            result.value.nombre2,
            {
                subEquipo: result.value
            }
        )
        
        console.log(result.value);
        return result.value;
    },

}
export {Mutation as default};