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
        let body = event.body;
        if(body.name && body.softLimit && body.hardLimit){
            let query;
            if(body.description){
                query = `INSERT INTO parking_permits_db_2.permit_types (name, description, soft_limit, hard_limit)
                VALUES ('${body.name}','${body.description}','${body.softLimit}','${body.hardLimit}');
                SELECT * FROM parking_permits_db_2.permit_types ORDER BY permit_types.id DESC LIMIT 15;`;
            }else{
                query = `INSERT INTO parking_permits_db_2.permit_types (name, soft_limit, hard_limit)
                VALUES ('${body.name}','${body.softLimit}','${body.hardLimit}');
                SELECT * FROM parking_permits_db_2.permit_types ORDER BY permit_types.id DESC LIMIT 15;`;
            }
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
                    'body': {
                        'message': 'permit type creation successful',
                        'results': response,
                    }
                });
            }
            });
        }else{

        }
    });
    
    return promise;
};