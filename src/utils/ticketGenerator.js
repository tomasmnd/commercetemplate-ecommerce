import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..', '..');

export function generateTicketPDF(ticketData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = path.join(rootDir, 'uploads', 'tickets', `ticket_${ticketData.code}.pdf`);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(18).text(`Ticket Code: ${ticketData.code}`);
    doc.fontSize(14).text(`Purchase Date: ${new Date(ticketData.purchase_datetime).toLocaleString()}`);
    doc.fontSize(14).text(`Total Amount: $${ticketData.amount}`);
    doc.fontSize(14).text(`Purchaser name: ${ticketData.purchaser_name} ${ticketData.purchaser_lastname}`);

    doc.fontSize(16).text('Items:');
    ticketData.products.forEach(product => {
      console.log("Processing product:", product);
      const title = product.title || 'Unknown Product';
      const quantity = product.quantity || 0;
      const price = product.price || 0;
      doc.fontSize(12).text(`- ${title} (${quantity} x $${price})`);
    });

    doc.end();

    stream.on('finish', () => {
      resolve(filePath);
    });

    stream.on('error', reject);
  });
}


export default generateTicketPDF;