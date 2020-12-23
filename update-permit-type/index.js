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
        if(body.id){
            let query = `UPDATE parking_permits_db_2.permit_types`;
            if(body.name){
                query += `SET name = ${body.name}`;
            }
            if(body.description){
                query += `SET description = ${body.description}`;
            }
            if(body.soft_limit){
                query += `SET soft_limit = ${body.soft_limit}`;
            }
            if(body.hard_limit){
                query += `SET hard_limit = ${body.hard_limit}`;
            }
            if(body.category){
                query += `SET category = ${body.category}`;
            }

            query += `WHERE id = ${body.id};
                      SELECT * FROM parking_permits_db_2.valid_permits WHERE id = ${body.id}`;
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
                            'message': 'update successful',
                            'results': response,
                        })
                   });
               }
            });
        }else{
            resolve({
                'isBase64Encoded': false,
                'statusCode': 422,
                'headers': {'ContentType': 'application/json'},
                'multiValueHeaders': {},
                'body': JSON.stringify({
                    'message': 'Could not update permit: an id must be supplied for the valid permit.'
                })
            });
        }
    });
    
    return promise;
};