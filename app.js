document.addEventListener("DOMContentLoaded", () => {
    // Gauti duomenis iš API
    fetch("https://in3.dev/inv/")
        .then(response => {
            if (!response.ok) {
                throw new Error("Nepavyko gauti duomenų iš API");
            }
            return response.json();
        })
        .then(data => {
            // Apdoroti gautus duomenis
            generateInvoice(data);
        })
        .catch(error => {
            console.error("Klaida:", error);
        });
});

// Generuojame atsitiktinius duomenis
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateInvoice(data) {
    const sellerData = [
        { name: "MB Pocius ir Jankauskas", address: "Saltoniškių g. 33, Panevėžys LT-39301", id: "27943193", vat: "LT585798003", phone: "+37068197175", email: "tstankeviciene@albertas.lt" },
        { name: "MB Šukė ir Stankevičius", address: "Gedimino pr. 10, Vilnius LT-01103", id: "39382742", vat: "LT299837408", phone: "+37068213987", email: "info@jankauskas.lt" }
    ];

    const buyerData = [
        { name: "IĮ Vasiliauskas", address: "Vilniaus alėja 94-84, Utena", id: "77018066", vat: "LT327493412", phone: "+370 655 07 264", email: "balciunaite.geda@verneris.lt" },
        { name: "UAB Pirkėjai", address: "Rinktinės g. 12, Vilnius", id: "111000911", vat: "LT100000045", phone: "+370 600 32 234", email: "pirkimai@pirkėjas.lt" }
    ];

    const randomSeller = getRandomItem(sellerData);
    const randomBuyer = getRandomItem(buyerData);

    document.getElementById("seller").innerHTML = `
        <p>${randomSeller.name}</p>
        <p>Adresas: ${randomSeller.address}</p>
        <p>Įmonės kodas: ${randomSeller.id}</p>
        <p>PVM kodas: ${randomSeller.vat}</p>
        <p>Telefonas: ${randomSeller.phone}</p>
        <p>El. paštas: ${randomSeller.email}</p>
    `;

    document.getElementById("buyer").innerHTML = `
        <p>${randomBuyer.name}</p>
        <p>Adresas: ${randomBuyer.address}</p>
        <p>Įmonės kodas: ${randomBuyer.id}</p>
        <p>PVM kodas: ${randomBuyer.vat}</p>
        <p>Telefonas: ${randomBuyer.phone}</p>
        <p>El. paštas: ${randomBuyer.email}</p>
    `;

    const invoiceNumber = "AB-" + Math.floor(Math.random() * 100000000);
    const invoiceDate = new Date().toLocaleDateString();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10); // Apmokėti iki 10 dienų po sąskaitos datos
    const dueDateStr = dueDate.toLocaleDateString();

    document.getElementById("invoiceNumber").textContent = invoiceNumber;
    document.getElementById("invoiceDate").textContent = invoiceDate;
    document.getElementById("dueDate").textContent = dueDateStr;

    // Apskaičiavimai ir prekės įterpimas
    let subtotal = 0;
    const tbody = document.querySelector("tbody");

    if (data.items && Array.isArray(data.items)) {
        data.items.forEach(item => {
            const discountValue = item.discount.type === "percentage" ? (item.price * item.discount.value) / 100 : 0;
            const priceAfterDiscount = item.price - discountValue;
            const total = priceAfterDiscount * item.quantity;
            subtotal += total;

            tbody.innerHTML += `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)} €</td>
                    <td>${item.discount.type === "percentage" ? `-${item.discount.value}% (-${discountValue.toFixed(2)} €)` : '-'}</td>
                    <td>${total.toFixed(2)} €</td>
                </tr>
            `;
        });
    }

    // Apskaičiuojame PVM ir galutinę sumą su PVM
    const shippingPrice = data.shippingPrice || 0;
    subtotal += shippingPrice;

    const vat = subtotal * 0.21;
    const totalWithVAT = subtotal + vat;

    const totals = document.querySelectorAll(".totals td:last-child");
    totals[0].textContent = `${subtotal.toFixed(2)} €`; // Tarpinė suma
    totals[1].textContent = `${shippingPrice.toFixed(2)} €`; // Transportavimo kaina
    totals[2].textContent = `${vat.toFixed(2)} €`; // PVM
    totals[3].textContent = `${totalWithVAT.toFixed(2)} €`; // Galutinė suma su PVM

    }