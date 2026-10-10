// Couple-specific content. Leave unavailable media/accounts empty; never use invented bank details.
window.weddingPremium = {
  brideAddress: '', // Exact address; empty keeps the supplied locality and labels its map as an area.
  videoUrl: '', // Local MP4/WebM or HTTPS video file (not a YouTube page).
  gifts: [
    { label: 'Mừng cưới chú rể', bankName: '', accountNumber: '', accountName: '', qrImage: '' },
    { label: 'Mừng cưới cô dâu', bankName: '', accountNumber: '', accountName: '', qrImage: '' },
  ], // qrImage: verified VietQR image file supplied by each account holder.
  effects: { filmGrain: true, fireworks: true },
};
