var mysql = require('mysql');
    
var connection = mysql.createConnection({
    host: 'parking-permits-v2.cqmzfyrm2poq.eu-west-2.rds.amazonaws.com',
    user: 'ppadmin',
    password: 'PvUWVVBuxLaulJkjSrHj',
    database: 'parking_permits_db_2'
});

exports.handler = async (event) => {
        let promise = new Promise((resolve, reject) => {
                let name = JSON.parse(event.queryStringParameters.name);
                let query = `SELECT * permit_types`;
                if(name){
                    query += ` WHERE name CONTAINS ${name}`;
                }

                
                connection.query(query, function(err, result) {
                    if(err){
                      connection.destroy();
                      throw err;  
                    }else{
                        resolve({
                            'isBase64Encoded': false,
                            'statusCode': 200,
                            'headers': {'contentType': 'application/json'},
                            'multiValueHeaders': {},
                            'body': JSON.stringify({
                                'message': 'connection successful',
                                'results': result,
                            })
                        });
                    }
                })
        });
        
        return promise;
};