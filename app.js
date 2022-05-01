/** Loading Modules*/
var mysql = require('mysql'); //database
var http = require('http'); //Webpage UI
var url = require('url'); //Routing
var events = require('events');
var eventEmitter = new events.EventEmitter();

 
var con = mysql.createConnection({ //Establish connection to Minikube MySQL Server and load database VaultofPlay
    host: "localhost",
    port: "7080",
    user: 'root',
    password: 'BubbaBubba99',
    insecureAuth: true,
    database: 'VaultofPlay' 

});


/**Global arrays to hold values of each column */

var names = []; //Game names
var genres = []; //Game genres
var devs = []; //Developers
var pubs = []; //Publishers
var prs = []; //Player Ratings
var ers = []; //ESRB Ratings
var stk = []; //Game Stock
var prc = []; //Game Prices
var httpStream = "";
var sqlQuery = "";


    con.connect(function(err){ //Connect to database and seed data
        if (err) throw err;
        console.log("Connected!");

        var seedTable = function(){
            con.query("SELECT * FROM Games", function (err, result, fields){ //Query Games table and grab all records
                if(err) throw err;
                
                numEntries = result.length;
                /**Iterate through each column and insert values into global arrays*/
                names = []; //Game names
                genres = []; //Game genres
                devs = []; //Developers
                pubs = []; //Publishers
                prs = []; //Player Ratings
                ers = []; //ESRB Ratings
                stk = []; //Game Stock
                prc = [];
    
                    if(err) throw err;
                    for (let n = 0; n < numEntries; n++){ 
                        names.push(result[n].Name);
                    }
                    for (let g = 0; g < numEntries; g++){
                        genres.push(result[g].Genre);
                    }
            
                    for (let d = 0; d < numEntries; d++){
                        devs.push(result[d].Developer);
                    }
            
                    for (let p = 0; p < numEntries; p++){
                        pubs.push(result[p].Publisher);
                    }
            
                    for (let pr = 0; pr < numEntries; pr++){
                        prs.push(result[pr].PlayerRating);
                    }
            
                    for (let er = 0; er < numEntries; er++){
                        ers.push(result[er].ESRBRating);
                    }
            
                    for (let s = 0; s < numEntries; s++){
                        stk.push(result[s].Stock);
                    }
            
                    for (let pri = 0; pri < numEntries; pri++){
                        prc.push(result[pri].Price);
                    } 
            });
        }


    
        eventEmitter.on('seedTable', seedTable);

    });


var numEntries = 0; //Number of Records in Games Table

eventEmitter.emit('seedTable');
http.createServer(function (req, res){ //Launch webserver
    res.writeHead(200, {'Content-Type': 'text/html'});

   /**Render HTML Table*/

    /**Header */


    eventEmitter.emit('seedTable');
    httpStream = "";
    httpStream += '<table>';
    httpStream += '<tr>';
    httpStream += '<th>Names</th>';
    httpStream += '<th>Genre</th>';
    httpStream += '<th>Developer</th>';
    httpStream += '<th>Publisher</th>';
    httpStream += '<th>Player Rating</th>';
    httpStream += '<th>ESRB Rating</th>';
    httpStream += '<th>Stock</th>';
    httpStream += '<th>Price</th>';
    httpStream += '</tr>';

    /**Populate HTML Table Rows with data from Global Arrays */
    console.log("Number of Records: " + numEntries);
    for (let i = 0; i < numEntries; i++){
        httpStream += '<tr>';
        httpStream += '<td>' + names[i].toString() + '</td>';
        httpStream += '<td>' + genres[i].toString() + '</td>';
        httpStream += '<td>' + devs[i].toString() + '</td>';
        httpStream += '<td>' + pubs[i].toString() + '</td>';
        httpStream += '<td>' + prs[i].toString() + '</td>';
        httpStream += '<td>' + ers[i].toString() + '</td>';
        httpStream += '<td>' + stk[i].toString() + '</td>';
        httpStream += '<td>' + prc[i].toString() + '</td>';
    }


    res.write(httpStream);

}).listen(8080); //Accept connections from port 8080