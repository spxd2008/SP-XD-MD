const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "YPt2GRJC#7dCEokvK79hGQshanS8XpCOO97xNTVHjOCx4KR_4uG0",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/s9c6sg.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "Hello User i'm alive now!",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};
