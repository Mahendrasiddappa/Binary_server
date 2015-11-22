var BinaryServer = require('binaryjs').BinaryServer;
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
            console.log("data received");
            for(var i=0;i<connections.length;i++)
            {
               try {
                   var remote_client = connections[i];
                   remote_client.write(data);
               }
                catch(error)
                {
                    removeItem(i);
                    i --;
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

    var prior = connections.slice(0,Item);
    var next = connections.slice(Item+1,connections.length);
    connections = prior.concat(next);


}


console.log("Server is up");