const db = require('../_helpers/db');
const Chat = db.Chat;

module.exports = {
    getAll,
    getById,
    getByMatchId,
    message,
    create,
    delete: _delete
};

async function getAll() {
    return await Chat.find();
}

async function getById(id) {
    return await Chat.findById(id);
}

async function getByMatchId(mId) {
    return await Chat.find({matchId: mId});
}

async function create(chatParams) {
    const matchId = chatParams.matchId;

    const newChat = new Chat({
        matchId
    });

    return await newChat.save();
}

async function message(messageParams) {
    const chatId = chatParams.chatId;
    const sender = chatParams.sender;
    const text = chatParams.text;

    const newMessage = new Message({
        chatId,
        sender,
        text
    });

    return await newMessage.save();
}

async function _delete(id) {
    return await Chat.findByIdAndRemove(id);
}

