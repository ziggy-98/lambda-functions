var mysql = require('mysql');
    
var connection = mysql.createConnection({
    host: 'parking-permits-v2.cqmzfyrm2poq.eu-west-2.rds.amazonaws.com',
    user: 'ppadmin',
    password: 'PvUWVVBuxLaulJkjSrHj',
    database: 'parking_permits_db_2',
    multipleStatements: true
});

exports.handler = async (event) => {
    let promise = new Promise((resolve, reject) => {
        let body = JSON.parse(event.body);
        let query = `INSERT INTO parking_permits_db_2.valid_permits (permit_id, registration)
                     VALUES ('${body.permit_id}','${body.registration}');
                     SELECT * FROM parking_permits_db_2.valid_permits ORDER BY valid_permits.id DESC LIMIT 15;`;
        connection.query(query, function(err, result) {
           if(err){
               connection.destroy();
               throw err;
           }else{
               let response = result[1];
               resolve({
                    'isBase64Encoded': false,
                    'statusCode': 200,
                    'headers': {'contentType': 'application/json'},
                    'multiValueHeaders': {},
                    'body': JSON.stringify({
                        'message': 'connection successful',
                        'results': response,
                    })
               });
           }
        });
    });
    
    return promise;
};