var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var express = require('express');
var events = require('events');


var channelList = [];
var connections = [];

var expressPort = 8015;
var livePort = 8014; /* Port for live streaming */

var server = BinaryServer({port: livePort});
server.on('connection', function(client){
    //console.log("Server got client");

    addToChannelList(client);
    client.on('stream', function(stream, meta){

        console.log("New Stream = " + meta);
        createChannel(client, meta);
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

console.log("Server is up at port "+ livePort);

var addToChannelList = function(client)
{
   // var stream = client.stream;
   var remote_stream = client.createStream();
    connections.push(remote_stream);

}


var createChannel = function(client, chName)
{
    if(channelList.indexOf(chName) > -1)
            client.send("Error: channel name exists");

    channel_sub = [{channel_name: chName, subscribers: []}];
    channelList.push(channel_sub);
}


var removeItem = function(Item)
{
    var prior = connections.slice(0,Item);
    var next = connections.slice(Item+1,connections.length);
    connections = prior.concat(next);
}



var app = express();
app.get('/*.mpd', function(request, response)
{
    var manifestName = request.url.toString();
    console.log("request received for .mpd file: " + manifestName.substring(1) );

    manifestName.sub
    manifestName = "manifestFiles"+manifestName;
    try {
        var data = fs.readFileSync(manifestName);
        response.status(200).write(data.toString());

        console.log(response.message);
    }
    catch(e)
    {
        console.log("An error occured while reading mainfest file");
    }
 //   events.EventEmitter.emit('sendManifest', request, response);
});


//var sendManifest = function ()
//{

//}


var express_server = app.listen(expressPort,function () {
    var host = express_server.address().address;
    var port = express_server.address().port;

    console.log("VOD server is up at port:%s", port);
});





