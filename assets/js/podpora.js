// Podpora in donacije

document.addEventListener('DOMContentLoaded', () => {
    // Povratna navigacija
    const backLink = document.querySelector('.podpora-container > .back-link:not(.close-panel-btn)');
    const backLinkText = backLink ? backLink.querySelector('.back-link-text') : null;
    if (backLink) {
        const referrer = document.referrer;
        const currentOrigin = window.location.origin;
        let isInternalReferrer = false;

        try {
            if (referrer) {
                const refUrl = new URL(referrer);
                isInternalReferrer = (refUrl.origin === currentOrigin);
            }
        } catch (e) {
            isInternalReferrer = false;
        }

        if (referrer && referrer.includes('arhiv.html')) {
            backLink.href = 'arhiv.html';
            backLink.setAttribute('aria-label', 'Nazaj na arhiv projektov');
            if (backLinkText) backLinkText.textContent = 'Nazaj na arhiv';
        } else if (referrer && (referrer.includes('index.html') || referrer === currentOrigin + '/')) {
            backLink.href = 'index.html#contact';
            backLink.setAttribute('aria-label', 'Nazaj na kontaktno sekcijo');
            if (backLinkText) backLinkText.textContent = 'Nazaj na portfolio';
        } else {
            // Neposreden obisk iz spleta (Google, zaznamek ipd.)
            backLink.href = 'index.html';
            backLink.setAttribute('aria-label', 'Nazaj na glavno stran');
            if (backLinkText) backLinkText.textContent = 'Nazaj na portfolio';
        }

        // Če je uporabnik prišel z naše strani, s klikom ohranimo stanje filtrov in drsenja
        backLink.addEventListener('click', (e) => {
            if (isInternalReferrer && window.history.length > 1) {
                e.preventDefault();
                window.history.back();
            }
        });
    }

    // Obvestilo
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch (error) {
                if (typeof document.execCommand !== 'function') throw error;
            }
        }

        if (typeof document.execCommand !== 'function') {
            throw new Error('Ta brskalnik ne podpira kopiranja v odložišče.');
        }

        const activeElement = document.activeElement;
        const selection = window.getSelection();
        const savedRanges = selection
            ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
            : [];
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.setAttribute('aria-hidden', 'true');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);

        try {
            textArea.focus();
            textArea.select();
            if (!document.execCommand('copy')) {
                throw new Error('Brskalnik je zavrnil kopiranje v odložišče.');
            }
        } finally {
            textArea.remove();
            if (activeElement instanceof HTMLElement && activeElement.isConnected) {
                activeElement.focus({ preventScroll: true });
            }
            if (selection) {
                selection.removeAllRanges();
                savedRanges.forEach(range => selection.addRange(range));
            }
        }
    }

    // Kopiranje v odložišče
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetSelector = btn.getAttribute('data-copy-target');
            const targetElement = targetSelector ? document.querySelector(targetSelector) : null;
            const textToCopy = btn.getAttribute('data-copy-text') || (targetElement ? targetElement.textContent.trim() : '');

            if (!textToCopy) {
                showToast('Podatka za kopiranje ni mogoče najti.');
                return;
            }

            try {
                await copyText(textToCopy);

                // Vizualna potrditev
                const originalHtml = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Kopirano!
                `;
                showToast(`Kopirano: ${textToCopy}`);

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalHtml;
                }, 2000);
            } catch (err) {
                console.error('Kopiranje ni uspelo:', err);
                showToast('Napaka pri kopiranju. Prosimo kopirajte ročno.');
            }
        });
    });

    // Izbira zneska in generiranje UPN QR kode
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmountInput');
    const qrContainer = document.getElementById('upnQrContainer');
    const upnAmountDisplay = document.getElementById('upnAmountDisplay');
    const ibanElement = document.getElementById('ibanValue');
    const recipientIban = ibanElement ? ibanElement.textContent.trim().replace(/\s+/g, '') : 'LT153250000408122643';
    const maxUpnAmountCents = 99999999999;
    let qrDebounceTimeout;
    let qrCodeInstance = null;

    function updateQrCode(amount) {
        if (!qrContainer || !Number.isFinite(amount) || amount <= 0) return;

        const cents = Math.round(amount * 100);
        if (!Number.isSafeInteger(cents) || cents > maxUpnAmountCents) {
            qrContainer.replaceChildren();
            qrCodeInstance = null;
            if (upnAmountDisplay) upnAmountDisplay.textContent = '—';
            showToast('Znesek presega tehnično omejitev UPN QR kode.');
            return;
        }

        if (upnAmountDisplay) {
            upnAmountDisplay.textContent = `${amount} €`;
        }

        // Formatiranje zneska v cente (11 mest)
        const amountCentsStr = String(cents).padStart(11, '0');

        // UPN QR specifikacija za slovenski bančni standard (ZBS)
        const upnQrString = [
            'UPNQR',
            '', // IBAN plačnika
            '', // Polog
            '', // Dvig
            '', // Referenca plačnika
            '', // Ime plačnika
            '', // Naslov plačnika
            '', // Kraj plačnika
            amountCentsStr, // Znesek v centih
            '', // Datum plačila
            '', // Nujno
            'CHAR', // Koda namena (CHAR = Donacija/Dobrodelnost)
            'Podpora projektom', // Namen
            '', // Rok plačila
            recipientIban, // IBAN prejemnika
            'SI00', // Model in sklic
            'Miha Knific', // Prejemnik
            '', // Ulica prejemnika
            '' // Kraj prejemnika
        ].join('\n') + '\n';

        // 100 % lokalno risanje v brskalniku brez zunanjih klicev
        if (typeof QRCode !== 'undefined') {
            if (qrCodeInstance) {
                qrCodeInstance.makeCode(upnQrString);
            } else {
                qrContainer.innerHTML = '';
                qrCodeInstance = new QRCode(qrContainer, {
                    text: upnQrString,
                    width: 170,
                    height: 170,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
            }
        }
    }

    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            amountButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const amount = parseFloat(btn.getAttribute('data-amount')) || 5;
            if (customAmountInput) customAmountInput.value = '';
            updateQrCode(amount);
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            const val = parseFloat(customAmountInput.value);

            // Preveri, ali se vpisani znesek ujema s katerim od prednastavljenih gumbov
            amountButtons.forEach(btn => {
                if (parseFloat(btn.getAttribute('data-amount')) === val) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            clearTimeout(qrDebounceTimeout);
            qrDebounceTimeout = setTimeout(() => {
                if (!isNaN(val) && val > 0) {
                    updateQrCode(val);
                } else if (customAmountInput.value === '') {
                    // Če izbriše, povrnemo na privzeti 5 € gumb
                    const defaultBtn = document.querySelector('.amount-btn[data-amount="5"]');
                    if (defaultBtn) {
                        amountButtons.forEach(b => b.classList.remove('active'));
                        defaultBtn.classList.add('active');
                        updateQrCode(5);
                    }
                }
            }, 300);
        });
    }

    // Začetni prikaz QR kode (privzeto 5 €)
    updateQrCode(5);
});
