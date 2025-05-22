// List of user profiles with credentials
const accounts = [
    { user: "user1", pass: "pass1" },
    { user: "user2", pass: "pass2" }
];

// Bus types and seating info
const busOptions = {
    luxury: [
        { busName: "Luxury-21", price: 600, availableSeats: 25 },
        { busName: "Luxury-22", price: 600, availableSeats: 25 },
        { busName: "Luxury-23", price: 600, availableSeats: 25 },
        { busName: "Luxury-24", price: 600, availableSeats: 25 }
    ],
    aircon: [
        { busName: "Aircon-31", price: 300, availableSeats: 25 },
        { busName: "Aircon-32", price: 300, availableSeats: 25 },
        { busName: "Aircon-33", price: 300, availableSeats: 25 },
        { busName: "Aircon-34", price: 300, availableSeats: 25 }
    ],
    minibus: [
        { busName: "Mini-41", price: 250, availableSeats: 20 },
        { busName: "Mini-42", price: 250, availableSeats: 20 },
        { busName: "Mini-43", price: 250, availableSeats: 20 },
        { busName: "Mini-44", price: 250, availableSeats: 20 }
    ],
    uvx: [
        { busName: "UVX-51", price: 100, availableSeats: 10 },
        { busName: "UVX-52", price: 100, availableSeats: 10 },
        { busName: "UVX-53", price: 100, availableSeats: 10 },
        { busName: "UVX-54", price: 100, availableSeats: 10 }
    ]
};

// Tracking booked data
const bookings = [];

// Log in process
function signIn() {
    const uname = prompt("Username:");
    const pword = prompt("Password:");
    
    for (let acct of accounts) {
        if (acct.user === uname && acct.pass === pword) {
            alert("Access granted");
            return uname;
        }
    }
    alert("Incorrect login details");
    return null;
}

// User selects bus category
function getBusType() {
    const category = prompt("Select type: luxury, aircon, minibus, uvx").toLowerCase();
    if (!busOptions[category]) {
        alert("Type not found");
        return null;
    }

    let show = "";
    busOptions[category].forEach((bus, idx) => {
        show += `${idx + 1}. ${bus.busName} - ₱${bus.price} - Seats Left: ${bus.availableSeats}\n`;
    });

    alert(show);
    const choice = parseInt(prompt("Enter number of preferred bus:")) - 1;

    if (choice < 0 || choice >= busOptions[category].length) {
        alert("Invalid selection");
        return null;
    }

    return { category, index: choice };
}

// Handle new reservation
function bookNow(user, category, index) {
    const seat = prompt("Seat #: ");
    const bus = busOptions[category][index];

    if (bookings.some(b => b.client === user && b.busName === bus.busName && b.seat === seat)) {
        alert("Seat already booked by you");
        return;
    }

    if (bus.availableSeats <= 0) {
        alert("Bus fully booked");
        return;
    }

    bookings.push({
        client: user,
        busName: bus.busName,
        seat,
        category,
        price: bus.price,
        paid: false,
        receipt: null
    });
    bus.availableSeats--;
    alert("Booking confirmed!");
}

// Delete existing reservation
function undoBooking(user) {
    const name = prompt("Bus name:");
    const seat = prompt("Seat #: ");

    const index = bookings.findIndex(r => r.client === user && r.busName === name && r.seat === seat);

    if (index === -1) {
        alert("No such booking found");
        return;
    }

    const item = bookings.splice(index, 1)[0];
    busOptions[item.category].find(b => b.busName === item.busName).availableSeats++;
    alert("Booking removed");
}

// Confirm payment
function confirmPayment(user) {
    const name = prompt("Bus:");
    const seat = prompt("Seat:");
    const file = prompt("Upload receipt (filename or URL):");

    const match = bookings.find(r => r.client === user && r.busName === name && r.seat === seat);

    if (!match) {
        alert("Booking not found");
        return;
    }

    match.paid = true;
    match.receipt = file;
    alert("Payment verified");
}

// View all bookings
function showAllBookings() {
    if (bookings.length === 0) {
        alert("No bookings to show");
        return;
    }

    let info = bookings.map(r => `User: ${r.client}\nBus: ${r.busName} (${r.category})\nSeat: ${r.seat}\nAmount: ₱${r.price}\nPaid: ${r.paid ? "Yes" : "No"}\nReceipt: ${r.receipt || "None"}\n-----`).join("\n");

    alert(info);
}

// Main interaction hub
function systemStart() {
    const currentUser = signIn();
    if (!currentUser) return;

    while (true) {
        const action = prompt("Select option:\n1. Book\n2. Cancel\n3. Pay\n4. View\n5. Logout");

        switch (action) {
            case "1":
                const result = getBusType();
                if (result) bookNow(currentUser, result.category, result.index);
                break;
            case "2": undoBooking(currentUser); break;
            case "3": confirmPayment(currentUser); break;
            case "4": showAllBookings(); break;
            case "5": alert("Session ended"); return;
            default: alert("Invalid option");
        }
    }
}

// Run the reservation system
systemStart();



