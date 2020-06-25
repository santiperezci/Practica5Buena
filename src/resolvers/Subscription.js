const Subscription = {
    tellMe:{
        subscribe(parent,args,ctx,info){
            const {id} = args;
            const {pubsub} = ctx;//Viene del contexto
            return pubsub.asyncIterator(id)//dentro el nombre del canal. SI se suscribe con el canal 123, tu le dices toma la sintonia con el canal 123
            //ahora vamos a la mutacion // estoy creando un canal con el nombre de id(convertido a string). todos los que llamen a tellme estaran suscritos a ese canal
        }//En este ejemplo se crea un canal por cada id
    },
    subPartido:{
        subscribe(parent,args,ctx,info){
            const{_id} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(_id);
        }
    },
    subEquipo:{
        subscribe(parent,args,ctx,info){
            const{nombre} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(nombre);        }
    }
}
export {Subscription as default};