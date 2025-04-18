document.addEventListener('DOMContentLoaded', function() {
    // Initialize the confirmation page
    const confirmationPage = new ConfirmationPage();
    confirmationPage.init();
});

class ConfirmationPage {
    constructor() {
        // Elements
        this.orderIdElement = document.getElementById('order-id');
        this.transIdElement = document.getElementById('trans-id');
        this.purchaseDateElement = document.getElementById('purchase-date');
        this.paymentMethodElement = document.getElementById('payment-method');
        this.ticketItemsContainer = document.getElementById('ticket-items');
        this.totalAmountElement = document.getElementById('total-amount');
        this.downloadButton = document.getElementById('download-ticket');
        this.calendarButton = document.getElementById('add-to-calendar');
        this.confettiContainer = document.getElementById('confetti-container');
        
        // Get order data from localStorage
        this.orderData = JSON.parse(localStorage.getItem('afroFestOrderData')) || {
            orderId: 'AF123456',
            tickets: [],
            payment: {},
            totalAmount: 0
        };
    }
    
    init() {
        this.displayOrderDetails();
        this.displayTicketSummary();
        this.initEventListeners();
        this.createConfetti();
        
        // Set current date if not available
        if (!this.purchaseDateElement.textContent || this.purchaseDateElement.textContent === 'April 17, 2025') {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            this.purchaseDateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    displayOrderDetails() {
        // Set order ID
        if (this.orderData.orderId) {
            this.orderIdElement.textContent = this.orderData.orderId;
        }
        
        // Set transaction ID based on payment method
        if (this.orderData.payment && this.orderData.payment.method) {
            let transId = this.transIdElement.textContent; // Default value
            
            if (this.orderData.payment.method === 'mobile-money') {
                const provider = this.orderData.payment.provider || 'MTN';
                transId = `${provider.toUpperCase()}${Math.floor(Math.random() * 90000000) + 10000000}`;
                this.paymentMethodElement.textContent = `Mobile Money (${provider.toUpperCase()})`;
            } else if (this.orderData.payment.method === 'card-payment') {
                transId = `CARD${Math.floor(Math.random() * 90000000) + 10000000}`;
                this.paymentMethodElement.textContent = 'Credit/Debit Card';
            } else if (this.orderData.payment.method === 'bank-transfer') {
                const bank = this.orderData.payment.bankName || 'Bank';
                transId = `${bank.toUpperCase()}${Math.floor(Math.random() * 90000000) + 10000000}`;
                this.paymentMethodElement.textContent = `Bank Transfer (${bank})`;
            }
            
            this.transIdElement.textContent = transId;
        }
    }
    
    displayTicketSummary() {
        this.ticketItemsContainer.innerHTML = '';
        let total = 0;
        
        if (this.orderData.tickets && this.orderData.tickets.length > 0) {
            this.orderData.tickets.forEach(ticket => {
                const itemTotal = ticket.price * ticket.quantity;
                total += itemTotal;
                
                const ticketItem = document.createElement('div');
                ticketItem.className = 'ticket-item';
                ticketItem.innerHTML = `
                    <div class="ticket-info">
                        <span class="ticket-name">${ticket.type}</span>
                        <span class="ticket-qty">${ticket.quantity} ticket${ticket.quantity > 1 ? 's' : ''}</span>
                    </div>
                    <span class="ticket-price">${itemTotal} GHC</span>
                `;
                
                this.ticketItemsContainer.appendChild(ticketItem);
            });
        } else {
            // If no tickets in localStorage, use default values
            const ticketItem = document.createElement('div');
            ticketItem.className = 'ticket-item';
            ticketItem.innerHTML = `
                <div class="ticket-info">
                    <span class="ticket-name">General Admission</span>
                    <span class="ticket-qty">2 tickets</span>
                </div>
                <span class="ticket-price">140 GHC</span>
            `;
            
            this.ticketItemsContainer.appendChild(ticketItem);
            total = 140;
        }
        
        this.totalAmountElement.textContent = `${total} GHC`;
    }
    
    initEventListeners() {
        // Download ticket button
        this.downloadButton.addEventListener('click', () => {
            alert('Your ticket is being downloaded. Check your downloads folder!');
            // In a real application, this would trigger a PDF download
        });
        
        // Add to calendar button
        this.calendarButton.addEventListener('click', () => {
            const eventDetails = {
                title: 'Bubble Rave 2025',
                start: new Date('2025-07-15T18:00:00'),
                end: new Date('2025-07-15T23:00:00'),
                location: 'Accra International Conference Center',
                description: 'Your tickets have been confirmed for Bubble Rave 2025!'
            };
            
            this.addToCalendar(eventDetails);
        });
        
        // Share buttons
        document.querySelectorAll('.social-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = e.currentTarget.classList[1];
                this.shareEvent(platform);
            });
        });
        
        // Clear order data on leaving page
        window.addEventListener('beforeunload', () => {
            // In a real app, you might want to keep some data and clear others
            // localStorage.removeItem('afroFestOrderData');
        });
    }
    
    addToCalendar(eventDetails) {
        // This is a simplified example - in reality you'd generate an .ics file
        // or use a calendar API
        
        const formatDate = (date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, '');
        };
        
        const startDate = formatDate(eventDetails.start);
        const endDate = formatDate(eventDetails.end);
        
        const calendarUrl = encodeURI(
            'data:text/calendar;charset=utf8,' +
            [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                `DTSTART:${startDate}`,
                `DTEND:${endDate}`,
                `SUMMARY:${eventDetails.title}`,
                `DESCRIPTION:${eventDetails.description}`,
                `LOCATION:${eventDetails.location}`,
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\n')
        );
        
        window.open(calendarUrl);
    }
    
    shareEvent(platform) {
        const eventUrl = window.location.origin;
        const eventTitle = 'Join me at Bubble Rave 2025!';
        const eventDescription = 'I just got my tickets for Bubble Rave 2025! Join me for an amazing experience.';
        
        let shareUrl = '';
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventTitle)}&url=${encodeURIComponent(eventUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${eventTitle} ${eventUrl}`)}`;
                break;
            case 'instagram':
                // Instagram doesn't have a direct sharing API, this is just for demonstration
                alert('To share on Instagram, please take a screenshot and post it to your story!');
                return;
        }
        
        window.open(shareUrl, '_blank');
    }
    
    createConfetti() {
        const colors = ['#6C63FF', '#564FD6', '#38A169', '#C6F6D5', '#F8FAFC'];
        const confettiCount = 150;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.background = color;
            confetti.style.position = 'absolute';
            confetti.style.top = '-10px';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.opacity = Math.random();
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            const animationDuration = Math.random() * 3 + 2;
            confetti.style.animation = `fall ${animationDuration}s linear forwards`;
            
            // Add custom keyframes for this specific confetti
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(${Math.random() * 360 + 360}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            this.confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation completes
            setTimeout(() => {
                confetti.remove();
                style.remove();
            }, animationDuration * 1000);
        }
    }
}