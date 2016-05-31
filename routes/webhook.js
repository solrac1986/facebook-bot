/**
 * Created by solrac on 31/05/16.
 */


app.get('/', function(req, res) {
    if(req.query['hub.verify_token'] === 'testbot_verify_token_22') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});