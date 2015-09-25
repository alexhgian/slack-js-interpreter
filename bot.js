var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: process.env.SLACK_BOT_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'JS Bot'
});

var params = {
    icon_emoji: ':cat:'
};

var CHANNEL = 'iot';

/**
 * @param {object} data
 */
bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.text);
    //console.log(data);

    // We just want the message not any other junk
    if(data.type == "message" && data.subtype != "bot_message"){
        var clearRe = new RegExp('^!clear','i');
        if(clearRe.test(data.text)){
            var tmp = '';
            for(var c=0; c<10; c++){
                tmp += '\n\n\n\n';
            }
            bot.postMessageToChannel(CHANNEL, '```'+tmp+'```', params);
        }
        var myRe = new RegExp('^!code','i');

        //console.log('isCode: ' + myRe.test(data.text));
        console.log(data)

        var consoleLog = console.log;

        if(myRe.test(data.text)){

            var codeStr = data.text.substring(5, data.text.length);
            codeStr = codeStr.replace('&lt;', '<');
            //console.log(codeStr);

            (function(bot, params, codeStr){
                var toChannel = function(txt){
                    console.log(txt)
                    bot.postMessageToChannel(CHANNEL, String(txt), params);
                };
                var fn;
                try {
                    console.log(codeStr)
                    fn = new Function('log','msg', codeStr);
                    if(fn){
                        fn(toChannel,function(username, txt){
                            bot.postMessageToUser(username, String(txt), params).then(function(){
                                toChannel('Sent to user.')
                            }).fail(function(){
                                toChannel('Failed to send to user.')
                            });
                        });
                    } else {
                        bot.postMessageToChannel(CHANNEL, 'No function found!', params);
                    }
                } catch(e){
                    console.log(e);
                    bot.postMessageToChannel(CHANNEL, String(e), params);
                }
            })(bot, params, codeStr);
        }
    }
});
