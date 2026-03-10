# Generate a UPI payment QR code for the provided details
import qrcode

upi_link = "upi://pay?pa=9087612000@ybl&pn=Rasihorn&am=1499&cu=INR"

qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_Q,
    box_size=10,
    border=4,
)
qr.add_data(upi_link)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
path = "./public/upi_qr_1499_rasihorn.png"
img.save(path)

path