import puppeteer from "puppeteer";

export const generatePDF = async (estimate) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true, // classic headless
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const rows = (estimate.items || [])
      .map(
        (i, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td style="text-align:left">${i.itemName || ""}</td>
          <td>${i.hsn || ""}</td>
          <td>${i.qty || 0}</td>
          <td>${i.unit || ""}</td>
          <td class="right">₹${Number(i.price || 0).toFixed(2)}</td>
          <td class="right">₹${Number(i.total || 0).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const html = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 11px;
          color: #000;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
        }

        .company-details {
          width: 70%;
        }

        .company-details h1 {
          color: red;
          font-size: 20px;
          margin: 0;
        }

        .company-details p {
          margin: 2px 0;
        }

        .logo img {
          width: 90px;
          height: auto;
        }

        h2 {
          text-align: center;
          margin: 10px 0;
          text-transform: uppercase;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #000;
          padding: 5px;
          text-align: center;
        }

        th {
          background: #f2f2f2;
          font-weight: bold;
        }

        .right {
          text-align: right;
        }

        .info-table td {
          border: 1px solid #000;
          padding: 4px;
        }

        .total-row td {
          font-weight: bold;
        }
      </style>
    </head>

    <body>

      <div class="header">
        <div class="company-details">
          <h1>SARVODAYA INTERIOR</h1>
          <p>1. Infront of Post Office High Plaza Dukan No 1 Nowgong Distt Chhatarpur (M.P)</p>
          <p>2. Infront of Police Station B.K Marriage House Dukan No 3 Harpalpur Distt Chhatarpur</p>
          <p><b>Phone:</b> 7753077270, 7869687315</p>
          <p><b>Email:</b> sarvodayainterior1@gmail.com</p>
          <p><b>GSTIN:</b> </p>
          <p><b>State:</b> 16 Madhya Pradesh</p>
        </div>

        <div class="logo">
          <img src="https://res.cloudinary.com/did9uj4ef/image/upload/v1766558330/estimate_app/companies/kf7xvhbv91l1c1jvjdlu.png" />
        </div>
      </div>

      <h2>Estimate</h2>

      <table class="info-table">
        <tr>
          <td width="50%"><b>Estimate For:</b> ${estimate.customerName || ""}</td>
          <td width="25%"><b>Estimate No:</b> ${estimate.estimateNo || ""}</td>
          <td width="25%"><b>Date:</b> ${
            estimate.createdAt
              ? new Date(estimate.createdAt).toLocaleDateString()
              : ""
          }</td>
        </tr>
      </table>

      <table style="margin-top:10px">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item Name</th>
            <th>HSN / SAC</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <table style="margin-top:10px">
        <tr>
          <td colspan="6" class="right"><b>Total</b></td>
          <td class="right">₹${Number(estimate.subTotal || 0).toFixed(2)}</td>
        </tr>
      </table>

      <p style="margin-top:100px"><b>Authorized Signature</b></p>

    </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm" },
    });

    return pdf;
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
};
