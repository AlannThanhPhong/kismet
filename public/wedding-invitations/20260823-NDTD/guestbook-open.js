const unlockDialog = document.querySelector('.guestbook-unlock');
const unlockForm = document.querySelector('#guestbook-unlock-form');
const unlockStatus = document.querySelector('#unlock-status');
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
    window.top.location.href = '/thiep/20260823-NDTD/loi-chuc';
  } catch (error) { unlockStatus.textContent = error.name === 'TimeoutError' ? 'Kết nối chậm. Bạn thử lại nhé.' : error.message; }
  finally { submit.disabled = false; }
});
