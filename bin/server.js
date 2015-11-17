var BinaryServer = require('/home/mahendra/node/node_modules/binaryjs').BinaryServer;
var fs = require('fs');

var connections = [];

var server = BinaryServer({port: 8000});
server.on('connection', function(client){
    //console.log("Server got client");

    addToChannelList(client);
    client.on('stream', function(stream, meta){

        console.log("New Stream");
      //  var file = fs.createReadStream();
        //console.log(client);
       // var responseStream = client.createStream('fromserver');
        //stream.pipe(responseStream);
//	var file = fs.createWriteStream(meta.file);
//    stream.pipe(file);

        stream.on('data',function(data)
        {
            console.log(data);
            for(var i=0;i<connections.length;i++)
            {
               try {
                   var remote_client = connections[i];
                   remote_client.write(data);
               }
                catch(error)
                {
                    removeItem(i);
                }
            }
        });

    });


});



var addToChannelList = function(client)
{
   // var stream = client.stream;
   var remote_stream = client.createStream();
    connections.push(remote_stream);

}



var removeItem = function(Item)
{

    var prior = connections.splice(0,Item-1);
    var next = connections.splice(Item+1,Item.length);
    connections = prior.concat(next);


}


console.log("Server is up");