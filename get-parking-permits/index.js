var mysql = require('mysql');
    
var connection = mysql.createConnection({
    host: 'parking-permits-v2.cqmzfyrm2poq.eu-west-2.rds.amazonaws.com',
    user: 'ppadmin',
    password: 'PvUWVVBuxLaulJkjSrHj',
    database: 'parking_permits_db_2'
});

exports.handler = async (event) => {
        let promise = new Promise((resolve, reject) => {
            if(event.queryStringParameters && event.queryStringParameters.registration){
                let registration = JSON.parse(event.queryStringParameters.registration);
                let query = `SELECT * FROM valid_permits WHERE `;
                if(Array.isArray(registration)){
                    registration.forEach((value, index) => {
                        if(index < registration.length -1){
                            query += `valid_permits.registration = '${value}' OR `;
                        }else{
                            query += `valid_permits.registration = '${value}'`;   
                        }
                    })
                }else{
                    query += `valid_permits.registration = '${registration}'`;
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
                                'registration': registration
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
                        'message': 'Could not return relevant permits: no registration was supplied'
                    })
                })
            }
        });
        
        return promise;
};