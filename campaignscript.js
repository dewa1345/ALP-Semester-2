// campaignscript.js
// Script for campaign card join/leave and event period

document.addEventListener('DOMContentLoaded', function () {
    const campaignCards = document.querySelectorAll('.campaign-card, [style*="background:#fff;"][style*="border-radius:16px"]');
    const joinButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.trim().toLowerCase() === 'join' || btn.textContent.trim().toLowerCase() === 'leave');
    // Track joined status for each card
    const joinedStatus = Array(campaignCards.length).fill(false);

    //  event periods for each card (customize as needed)
    const eventPeriods = [
        '15 Juni 2025 - 20 Juni 2025',
        '18 Juni 2025 - 25 Juni 2025',
        '21 Juni 2025 - 28 Juni 2025',
        '25 Juni 2025 - 30 Juni 2025',
        '1 Juli 2025 - 7 Juli 2025',
        '5 Juli 2025 - 10 Juli 2025',
        '10 Juli 2025 - 15 Juli 2025',
    ];

    // Add period info to each card
    campaignCards.forEach((card, idx) => {
        // Cek jika sudah ada, jangan double
        if (!card.querySelector('.event-period')) {
            const periodDiv = document.createElement('div');
            periodDiv.className = 'event-period';
            periodDiv.style = 'color:#d35400; font-size:0.98rem; margin-top:4px; font-weight:600;';
            periodDiv.innerHTML = `<b>Periode:</b> ${eventPeriods[idx] || '-'} `;
            // Sisipkan setelah meta info
            const meta = card.querySelector('div[style*="color:#2e944b;"]');
            if (meta) meta.parentNode.insertBefore(periodDiv, meta.nextSibling);
            else card.appendChild(periodDiv);
        }
    });

    // Join/Leave logic
    joinButtons.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
            if (!btn.classList.contains('joined')) {
                btn.textContent = 'Leave';
                btn.style.background = '#e74c3c';
                btn.style.color = '#fff';
                btn.classList.add('joined');
                joinedStatus[idx] = true;
            } else {
                btn.textContent = 'Join';
                btn.style.background = '#2e944b';
                btn.style.color = '#fff';
                btn.classList.remove('joined');
                joinedStatus[idx] = false;
            }
        });
    });

    // --- VALIDASI FORM CREATE CAMPAIGN ---
    const modal = document.getElementById('createCampaignModal');
    if (modal) {
        const form = modal.querySelector('form');
        const inputs = form.querySelectorAll('input[type="text"], input[type="date"], input[type="file"], textarea');
        const createBtn = form.querySelector('button[type="submit"]');

        function checkFormFilled() {
            let filled = true;
            inputs.forEach(input => {
                if (input.type === 'file') {
                    if (!input.files || input.files.length === 0) filled = false;
                } else {
                    if (!input.value.trim()) filled = false;
                }
            });
            createBtn.disabled = !filled;
            createBtn.style.opacity = filled ? '1' : '0.5';
            createBtn.style.cursor = filled ? 'pointer' : 'not-allowed';
        }

        inputs.forEach(input => {
            input.addEventListener('input', checkFormFilled);
            if (input.type === 'file') input.addEventListener('change', checkFormFilled);
        });
        checkFormFilled();

        // --- TAMBAH CARD BARU ---
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // Ambil data
            const [name, desc, organizer, date1, date2, fileInput] = [
                form.querySelector('input[type="text"]'),
                form.querySelector('textarea'),
                form.querySelectorAll('input[type="text"]')[1],
                form.querySelectorAll('input[type="date"]')[0],
                form.querySelectorAll('input[type="date"]')[1],
                form.querySelector('input[type="file"]')
            ];
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgSrc = event.target.result;
                const card = document.createElement('div');
                card.className = 'campaign-card';
                card.style = 'background:#fff; border-radius:16px; box-shadow:0 2px 8px rgba(46,148,75,0.07); max-width:600px; width:100%; display:flex; flex-direction:row; align-items:center; overflow:hidden; min-height:170px; border:2px solid #e0f5e7; position:relative;';
                card.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; width:200px; min-width:140px; height:120px; position:relative;">
                        <div class="like-btn-bg"></div>
                        <img src="Gambar/heart-icon.jpg" class="like-btn" onclick="toggleLikeBtn(this)">
                        <img src="${imgSrc}" alt="${name.value}" style="width:180px; height:120px; object-fit:cover; border-radius:12px; display:block; margin:auto;">
                    </div>
                    <div style="padding:16px 20px; display:flex; flex-direction:column; justify-content:center; flex:1; min-width:0; position:relative;">
                        <h2 style="color:#2e944b; font-size:1.3rem; font-weight:bold; margin:0 0 6px 0;">${name.value}</h2>
                        <p style="color:#222; font-size:0.98rem; margin-bottom:8px;">${desc.value}</p>
                        <div style="color:#2e944b; font-size:0.98rem; margin-bottom:6px;">
                            <b>Organized by:</b> <span style="color:#388e3c; font-weight:normal;">${organizer.value}</span><br>
                            <b style="color:red;">Periode:</b> <span style="color:red; font-weight:normal;">${date1.value} - ${date2.value}</span>
                        </div>
                        <div style="margin-top:6px;">
                            <div style="font-size:0.98rem; color:#2e944b; font-weight:700; margin-bottom:3px;">Partisipan:</div>
                            <div style="display:flex; align-items:center; gap:6px;">
                                <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="P1" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:2px solid #2e944b;">
                                <img src="https://randomuser.me/api/portraits/women/21.jpg" alt="P2" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:2px solid #2e944b;">
                                <img src="https://randomuser.me/api/portraits/men/31.jpg" alt="P3" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:2px solid #2e944b;">
                                <span style="color:#388e3c; font-size:1rem; font-weight:600; margin-left:4px;">+0 lainnya</span>
                            </div>
                        </div>
                        <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
                            <button class="join-btn" onclick="toggleJoinBtn(this)" style="background:#fff; color:#2e944b; border:2px solid #2e944b; border-radius:8px; padding:7px 18px; font-weight:600; font-size:1rem; box-shadow:0 2px 8px rgba(46,148,75,0.10); cursor:pointer; transition:all 0.2s; margin-bottom:4px;">JOIN</button>
                        </div>
                    </div>
                `;
                document.getElementById('campaignCardsWrapper').appendChild(card);
                closeCreateCampaignModal();
                form.reset();
                checkFormFilled();
            };
            if (fileInput.files && fileInput.files[0]) {
                reader.readAsDataURL(fileInput.files[0]);
            }
        });
    }
});
