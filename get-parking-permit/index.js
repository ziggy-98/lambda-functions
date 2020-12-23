var mysql = require('mysql');
    
var connection = mysql.createConnection({
    host: 'parking-permits-v2.cqmzfyrm2poq.eu-west-2.rds.amazonaws.com',
    user: 'ppadmin',
    password: 'PvUWVVBuxLaulJkjSrHj',
    database: 'parking_permits_db_2'
});

exports.handler = async (event) => {
        let promise = new Promise((resolve, reject) => {
            if(event.queryStringParameters && event.queryStringParameters.id){
                let id = JSON.parse(event.queryStringParameters.id);
                let query = `SELECT * FROM valid_permits WHERE id = '${id}'`;

                
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
                                'results': result
                            })
                        });
                    }
                })
            }else{
                resolve({
                    'isBase64Encoded': false,
                    'statusCode': 422,
                    'headers': {'contentType': 'application/json'},
                    'multiValueHeaders': {},
                    'body': JSON.stringify({
                        'message': 'Could not return relevant permits: no id was supplied'
                    })
                })
            }
        });
        
        return promise;
};