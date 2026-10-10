const unlockDialog = document.querySelector('.guestbook-unlock');
const unlockForm = document.querySelector('#guestbook-unlock-form');
const unlockStatus = document.querySelector('#unlock-status');
const navigationWindow = window.top;
// A fresh document always starts with the unopened invitation.
if (navigationWindow.location.hash === '#loi-chuc') {
  navigationWindow.history.replaceState(navigationWindow.history.state, '', navigationWindow.location.pathname + navigationWindow.location.search);
}
let guestbookFrame = null;
let previousOverflow = '';

function closeGuestbook() {
  if (!guestbookFrame) return;
  guestbookFrame.remove();
  guestbookFrame = null;
  document.body.style.overflow = previousOverflow;
  document.querySelector('.invitation-content').inert = false;
  document.querySelector('#open-guestbook').focus({ preventScroll: true });
}

function showGuestbook(pushHistory = true) {
  if (guestbookFrame) return;
  const frame = document.createElement('iframe');
  frame.className = 'guestbook-page';
  frame.title = 'Lời chúc và danh sách xác nhận';
  frame.src = '/thiep/20260823-NDTD/loi-chuc?embedded=1';
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  document.querySelector('.invitation-content').inert = true;
  guestbookFrame = frame;
  document.body.appendChild(frame);
  if (pushHistory) navigationWindow.history.pushState(navigationWindow.history.state, '', '#loi-chuc');
  frame.focus();
}

navigationWindow.addEventListener('popstate', () => {
  if (navigationWindow.location.hash === '#loi-chuc') showGuestbook(false);
  else closeGuestbook();
});
window.addEventListener('message', event => {
  if (event.origin !== window.location.origin || event.source !== guestbookFrame?.contentWindow) return;
  if (event.data?.type === 'kismet:close-guestbook') navigationWindow.history.back();
});
document.querySelector('#open-guestbook').addEventListener('click', () => {
  unlockStatus.textContent = '';
  unlockForm.reset();
  unlockDialog.showModal();
  document.querySelector('#unlock-password').focus();
});
document.querySelector('#cancel-unlock').addEventListener('click', () => unlockDialog.close());
unlockDialog.addEventListener('click', event => { if (event.target === unlockDialog) unlockDialog.close(); });
unlockForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submit = unlockForm.querySelector('[type=submit]');
  if (submit.disabled) return;
  submit.disabled = true;
  unlockStatus.textContent = 'Đang mở…';
  try {
    const response = await fetch('/api/invitations/20260823-NDTD/guestbook-access', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: unlockForm.elements.password.value }), signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Chưa mở được sổ lưu bút.');
    unlockForm.reset();
    unlockDialog.close();
    showGuestbook();
  } catch (error) { unlockStatus.textContent = error.name === 'TimeoutError' ? 'Kết nối chậm. Bạn thử lại nhé.' : error.message; }
  finally { submit.disabled = false; }
});
