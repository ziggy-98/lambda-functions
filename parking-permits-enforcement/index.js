var mysql = require('mysql');
    
var connection = mysql.createConnection({
    host: 'parking-permits-v2.cqmzfyrm2poq.eu-west-2.rds.amazonaws.com',
    user: 'ppadmin',
    password: 'PvUWVVBuxLaulJkjSrHj'
});

console.log(connection);

exports.handler = async (event, context, callback) => {
    
    connection.connect(function(err) {
        if (err) throw err;
        return connection.query('SELECT * FROM valid_permits', function(err, result) {
            if(err) throw err;
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'query successful',
                    permits: result
                })
            };
            
        })
    }).then(res => {
        console.log(res);
        return res;
    });
};