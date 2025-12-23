const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "CHAMOD~MD=XB9EGYDB#Y8IQqWvqwt0cbdUWVHAwCwc457EpuREf4V-EBM8O1rs",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/s9c6sg.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "Hello User i'm alive now!",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};
