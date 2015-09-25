var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: process.env.SLACK_BOT_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'JS Bot'
});

var params = {
    icon_emoji: ':cat:'
};

/**
 * @param {object} data
 */
bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.text);
    //console.log(data);

    // We just want the message not any other junk
    if(data.type == "message" && data.subtype != "bot_message"){
        var myRe = new RegExp('^!code','i');

        //console.log('isCode: ' + myRe.test(data.text));
        console.log(data)

        var consoleLog = console.log;

        if(myRe.test(data.text)){

            var codeStr = data.text.substring(5, data.text.length);
            codeStr = codeStr.replace('&lt;', '<');
            //console.log(codeStr);

            (function(bot, params, codeStr){
                var fn;
                try {
                    console.log(codeStr)
                    fn = new Function('log', codeStr);
                } catch(e){
                    console.log(e);
                }

                if(fn){
                    fn(function(txt){
                        console.log(txt)
                        bot.postMessageToChannel('general', String(txt), params);
                    });
                } else {
                    bot.postMessageToChannel('general', 'No function found!', params);
                }
            })(bot, params, codeStr);
        }

    }


});
