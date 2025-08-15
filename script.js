// Show current year in footer
document.getElementById('yr').textContent = new Date().getFullYear();

// UPI settings
const UPI_VPA = '8078330536@upi';
const UPI_NAME = 'Kannur Bike Rentals';
const UPI_NOTE = 'Bike booking payment';

// Calculate rental price
function calcPrice() {
  const pVal = document.getElementById('pickupTime').value;
  const dVal = document.getElementById('dropoffTime').value;
  if (!pVal || !dVal) {
    alert('Select pickup and drop-off');
    return;
  }

  const p = new Date(pVal);
  const d = new Date(dVal);
  if (d <= p) {
    alert('Drop-off must be after pickup');
    return;
  }

  const hours = Math.ceil((d - p) / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  let price = 0;

  if (days >= 22) {
    price = days * 250 + rem * (545 / 24);
  } else if (days >= 7) {
    price = days * 457 + rem * (545 / 24);
  } else if (days >= 1) {
    price = days * (545 * 0.9) + rem * (545 / 24);
  } else {
    price = hours * (545 / 24);
  }

  price = Math.round(price * 100) / 100;

  document.getElementById('priceDisplay').textContent = 'Estimated total: ₹' + price.toFixed(2);
  document.getElementById('summary').innerHTML = `
    <div><strong>Pickup:</strong> ${document.getElementById('pickup').value}</div>
    <div><strong>Pickup time:</strong> ${p.toLocaleString()}</div>
    <div><strong>Drop-off time:</strong> ${d.toLocaleString()}</div>
    <div style="margin-top:8px"><strong>Total:</strong> ₹${price.toFixed(2)}</div>
  `;

  document.getElementById('paymentArea').hidden = false;
  prepareUpi(price);
}

// Prepare UPI link & QR code
function prepareUpi(amount) {
  const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(UPI_NAME)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(UPI_NOTE)}`;

  document.getElementById('upiBtn').onclick = function () {
    window.location = upiUri;
  };

  const qrData = encodeURIComponent(upiUri);
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${qrData}`;
  document.getElementById('qrImg').src = qrUrl;
  document.getElementById('qrWrap').style.display = 'block';
}

// Open WhatsApp with pre-filled booking
function bookWhatsApp() {
  const summaryEl = document.getElementById('summary').innerText || '';
  const text = encodeURIComponent('Hi Kannur Bike Rentals, I want to book a bike. ' + summaryEl);
  const waNumber = '918078330536';
  const url = `https://wa.me/${waNumber}?text=${text}`;
  window.open(url, '_blank');
}

// Fallback pay
function payUpi() {
  alert('This will open your UPI app if available. If nothing happens, scan the QR code or copy the UPI number into your app.');
}
