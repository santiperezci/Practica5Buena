import {MongoClient, ObjectID} from "mongodb";
import {GraphQLServer,PubSub} from "graphql-yoga";//pubsub es la esta para q nos avise cuando la mutacion cambie
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Partido from './resolvers/Partido';
import Subscription from './resolvers/Subscription';
import * as uuid from 'uuid';
//falta la mutacion añadir facturas
import "babel-polyfill";

//logueado != registrado
//La api como sabe que yo ya estoy logueado¿?
//En el resolver que hago?

const usr = "avalero";
const pwd = "123456abc";
const url = "cluster0-vbkmi.gcp.mongodb.net/test?retryWrites=true&w=majority";
//ESTADO ES UN INT PORQEU PUEDE SER ANTES DURANTE Y DESPUES
const connectToDb = async function(usr, pwd, url) {
    const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    await client.connect();
    return client;
};
const runGraphQLServer = function(context){
    const resolvers = {
        Partido,
        Query,//seria Query:Query COMO YA LO TENEMOS DEFINIDO, SE LLAMA SIMPLEMENTE PONIENDO EL NOMBRE
        Mutation,
        Subscription       
    }//ahora a typedefs le pasamos la ruta de donde están
    const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers, context });
  const options = {
    port: 4000
  };
  //En el otro vamos a meter los resolvers de la factura

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};
//En la subscripcion creo el canal y en la mutacion escribo en ese canal

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  const pubsub = new PubSub();
  const a = 0;
  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client, pubsub,a});
    //En la otra le paso db: definicion... y esa mierda
  } catch (e) {
      console.log(e)
    client.close();
  }
};

runApp();