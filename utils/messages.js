
const moment=require('moment');
function formatMessage(username,text)
{
    return {

        username,  // could write like this username:username . but both key and value are same , so no need to write key
        text,
        time:moment().format('h:mm a')
    }

}

module.exports=formatMessage;