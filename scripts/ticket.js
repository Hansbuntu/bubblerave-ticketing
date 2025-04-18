class TicketSelection {
    constructor() {
        this.ticketPrices = {
            'early-bird': 70,
            'vip': 150
        };
        
        this.initElements();
        this.initEventListeners();
        this.loadSavedData();
        this.updateOrderSummary();
    }
    
    initElements() {
        this.ticketOptions = document.querySelectorAll('.ticket-card');
        this.toDetailsBtn = document.getElementById('to-details');
        this.ticketDisplay = document.getElementById('ticket-selection-display');
        this.orderTotalElement = document.getElementById('order-total');
        
        this.orderData = {
            tickets: [],
            orderId: this.generateOrderId()
        };
    }
    
    initEventListeners() {
        this.toDetailsBtn.addEventListener('click', () => this.proceedToDetails());
        
        this.ticketOptions.forEach(option => {
            const qtyInput = option.querySelector('input[type="number"]');
            const minusBtn = option.querySelector('.qty-minus');
            const plusBtn = option.querySelector('.qty-plus');
            
            qtyInput.addEventListener('change', () => this.handleQuantityChange());
            minusBtn.addEventListener('click', () => this.adjustQuantity(qtyInput, -1));
            plusBtn.addEventListener('click', () => this.adjustQuantity(qtyInput, 1));
        });
    }
    
    adjustQuantity(input, change) {
        let newValue = parseInt(input.value) + change;
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        if (newValue >= min && newValue <= max) {
            input.value = newValue;
            this.handleQuantityChange();
        }
    }
    
    handleQuantityChange() {
        this.collectTicketData();
        this.updateOrderSummary();
        this.saveData();
    }
    
    collectTicketData() {
        this.orderData.tickets = [];
        
        this.ticketOptions.forEach(option => {
            const type = option.dataset.type;
            const qtyInput = option.querySelector('input[type="number"]');
            const quantity = parseInt(qtyInput.value);
            
            if (quantity > 0) {
                this.orderData.tickets.push({
                    type: type.replace('-', ' '),
                    price: this.ticketPrices[type],
                    quantity: quantity
                });
            }
        });
    }
    
    updateOrderSummary() {
        this.ticketDisplay.innerHTML = '';
        let total = 0;
        
        this.orderData.tickets.forEach(ticket => {
            const ticketElement = document.createElement('div');
            ticketElement.className = 'ticket-item';
            const itemTotal = ticket.price * ticket.quantity;
            total += itemTotal;
            
            ticketElement.innerHTML = `
                <span>${ticket.quantity} × ${ticket.type}</span>
                <span>${itemTotal} GHC</span>
            `;
            this.ticketDisplay.appendChild(ticketElement);
        });
        
        this.orderTotalElement.textContent = `${total} GHC`;
        this.orderData.totalAmount = total;
    }
    
    loadSavedData() {
        const savedTickets = localStorage.getItem('afroFestTickets');
        if (savedTickets) {
            this.orderData.tickets = JSON.parse(savedTickets);
            
            // Update input values to match saved data
            this.ticketOptions.forEach(option => {
                const type = option.dataset.type;
                const qtyInput = option.querySelector('input[type="number"]');
                const savedTicket = this.orderData.tickets.find(t => t.type === type.replace('-', ' '));
                
                if (savedTicket) {
                    qtyInput.value = savedTicket.quantity;
                }
            });
        }
    }
    
    saveData() {
        localStorage.setItem('afroFestTickets', JSON.stringify(this.orderData.tickets));
    }
    
    generateOrderId() {
        return 'AF' + Date.now().toString().slice(-6);
    }
    
    validateSelection() {
        return this.orderData.tickets.length > 0;
    }
    
    proceedToDetails() {
        if (!this.validateSelection()) {
            alert('Please select at least one ticket');
            return;
        }
        
        localStorage.setItem('afroFestOrderData', JSON.stringify(this.orderData));
        window.location.href = 'details.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicketSelection();
});