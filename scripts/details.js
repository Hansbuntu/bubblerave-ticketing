class DetailsPage {
    constructor() {
        this.initElements();
        this.loadOrderData();
        this.displayOrderSummary();
        this.initEventListeners();
    }
    
    initElements() {
        this.orderItemsContainer = document.getElementById('order-items');
        this.orderTotalElement = document.getElementById('order-total');
        this.proceedBtn = document.getElementById('to-step-2-from-details');
        
        // Form elements
        this.firstNameInput = document.getElementById('first-name');
        this.lastNameInput = document.getElementById('last-name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('contact-phone');
        
        // Payment method elements
        this.paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
        this.mobileMoneyDetails = document.getElementById('mobile-money-details');
        this.cardPaymentDetails = document.getElementById('card-payment-details');
        this.bankTransferDetails = document.getElementById('bank-transfer-details');
        
        // Mobile Money elements
        this.momoProviderSelect = document.getElementById('momo-provider');
        this.momoNumberInput = document.getElementById('momo-number');
        
        // Card elements
        this.cardNumberInput = document.getElementById('card-number');
        this.cardExpiryInput = document.getElementById('card-expiry');
        this.cardCvvInput = document.getElementById('card-cvv');
        
        // Bank elements
        this.bankNameSelect = document.getElementById('bank-name');
        this.accountNumberInput = document.getElementById('account-number');
        
        this.orderData = {
            tickets: [],
            customer: {},
            payment: {},
            orderId: this.generateOrderId()
        };
    }
    
    loadOrderData() {
        // Load tickets from previous page
        const savedTickets = localStorage.getItem('afroFestTickets');
        if (savedTickets) {
            this.orderData.tickets = JSON.parse(savedTickets);
        }
        
        // Load any saved customer data
        const savedData = localStorage.getItem('afroFestOrderData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData.customer) {
                    this.firstNameInput.value = parsedData.customer.firstName || '';
                    this.lastNameInput.value = parsedData.customer.lastName || '';
                    this.emailInput.value = parsedData.customer.email || '';
                    if (parsedData.customer.phone) {
                        this.phoneInput.value = parsedData.customer.phone.replace('+233', '') || '';
                    }
                }
                
                if (parsedData.payment) {
                    const paymentMethod = parsedData.payment.method;
                    if (paymentMethod) {
                        document.getElementById(paymentMethod).checked = true;
                        this.showPaymentDetails(paymentMethod);
                        
                        if (paymentMethod === 'mobile-money') {
                            this.momoProviderSelect.value = parsedData.payment.provider || '';
                            this.momoNumberInput.value = parsedData.payment.momoNumber ? parsedData.payment.momoNumber.replace('+233', '') : '';
                        } else if (paymentMethod === 'card-payment') {
                            this.cardNumberInput.value = parsedData.payment.cardNumber || '';
                            this.cardExpiryInput.value = parsedData.payment.cardExpiry || '';
                            this.cardCvvInput.value = parsedData.payment.cardCvv || '';
                        } else if (paymentMethod === 'bank-transfer') {
                            this.bankNameSelect.value = parsedData.payment.bankName || '';
                            this.accountNumberInput.value = parsedData.payment.accountNumber || '';
                        }
                    }
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
    
    displayOrderSummary() {
        this.orderItemsContainer.innerHTML = '';
        let total = 0;
        
        this.orderData.tickets.forEach(ticket => {
            const item = document.createElement('div');
            item.className = 'ticket-item';
            const itemTotal = ticket.price * ticket.quantity;
            total += itemTotal;
            
            item.innerHTML = `
                <span>${ticket.quantity} × ${ticket.type}</span>
                <span>${itemTotal} GHC</span>
            `;
            this.orderItemsContainer.appendChild(item);
        });
        
        this.orderTotalElement.textContent = `${total} GHC`;
        this.orderData.totalAmount = total;
    }
    
    generateOrderId() {
        return 'AF' + Date.now().toString().slice(-6);
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate personal details
        if (!this.firstNameInput.value.trim()) {
            document.getElementById('first-name-error').textContent = 'First name is required';
            isValid = false;
        } else {
            document.getElementById('first-name-error').textContent = '';
        }
        
        if (!this.lastNameInput.value.trim()) {
            document.getElementById('last-name-error').textContent = 'Last name is required';
            isValid = false;
        } else {
            document.getElementById('last-name-error').textContent = '';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.emailInput.value)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            document.getElementById('email-error').textContent = '';
        }
        
        if (!/^\d{9}$/.test(this.phoneInput.value)) {
            document.getElementById('phone-error').textContent = 'Please enter a valid 9-digit number';
            isValid = false;
        } else {
            document.getElementById('phone-error').textContent = '';
        }
        
        // Validate payment details
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (selectedPaymentMethod === 'mobile-money') {
            if (!this.momoProviderSelect.value) {
                document.getElementById('momo-provider-error').textContent = 'Please select a provider';
                isValid = false;
            } else {
                document.getElementById('momo-provider-error').textContent = '';
            }
            
            if (!/^\d{9}$/.test(this.momoNumberInput.value)) {
                document.getElementById('momo-number-error').textContent = 'Please enter a valid 9-digit number';
                isValid = false;
            } else {
                document.getElementById('momo-number-error').textContent = '';
            }
        } else if (selectedPaymentMethod === 'card-payment') {
            // Remove spaces for validation but keep them for display
            const cardNumber = this.cardNumberInput.value.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cardNumber)) {
                document.getElementById('card-number-error').textContent = 'Please enter a valid 16-digit card number';
                isValid = false;
            } else {
                document.getElementById('card-number-error').textContent = '';
            }
            
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(this.cardExpiryInput.value)) {
                document.getElementById('card-expiry-error').textContent = 'Please enter a valid expiry date (MM/YY)';
                isValid = false;
            } else {
                document.getElementById('card-expiry-error').textContent = '';
            }
            
            if (!/^\d{3}$/.test(this.cardCvvInput.value)) {
                document.getElementById('card-cvv-error').textContent = 'Please enter a valid 3-digit CVV';
                isValid = false;
            } else {
                document.getElementById('card-cvv-error').textContent = '';
            }
        } else if (selectedPaymentMethod === 'bank-transfer') {
            if (!this.bankNameSelect.value) {
                document.getElementById('bank-name-error').textContent = 'Please select a bank';
                isValid = false;
            } else {
                document.getElementById('bank-name-error').textContent = '';
            }
            
            if (!this.accountNumberInput.value.trim()) {
                document.getElementById('account-number-error').textContent = 'Please enter your account number';
                isValid = false;
            } else {
                document.getElementById('account-number-error').textContent = '';
            }
        }
        
        return isValid;
    }
    
    showPaymentDetails(paymentMethodId) {
        // Hide all payment details sections
        this.mobileMoneyDetails.style.display = 'none';
        this.cardPaymentDetails.style.display = 'none';
        this.bankTransferDetails.style.display = 'none';
        
        // Show the selected payment details section
        if (paymentMethodId === 'mobile-money') {
            this.mobileMoneyDetails.style.display = 'block';
        } else if (paymentMethodId === 'card-payment') {
            this.cardPaymentDetails.style.display = 'block';
        } else if (paymentMethodId === 'bank-transfer') {
            this.bankTransferDetails.style.display = 'block';
        }
    }
    
    formatCardNumber(input) {
        // Remove non-digit characters
        let value = input.value.replace(/\D/g, '');
        
        // Add spaces after every 4 digits
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        
        // Update the input value
        input.value = value;
    }
    
    formatExpiryDate(input) {
        // Remove non-digit characters
        let value = input.value.replace(/\D/g, '');
        
        // Add slash after month
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        // Update the input value
        input.value = value;
    }
    
    saveCustomerData() {
        // Save customer data
        this.orderData.customer = {
            firstName: this.firstNameInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            email: this.emailInput.value.trim(),
            phone: '+233' + this.phoneInput.value.trim()
        };
        
        // Save payment data
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        this.orderData.payment = {
            method: selectedPaymentMethod
        };
        
        if (selectedPaymentMethod === 'mobile-money') {
            this.orderData.payment.provider = this.momoProviderSelect.value;
            this.orderData.payment.momoNumber = '+233' + this.momoNumberInput.value.trim();
        } else if (selectedPaymentMethod === 'card-payment')
            // Save payment data (continued)
        if (selectedPaymentMethod === 'mobile-money') {
            this.orderData.payment.provider = this.momoProviderSelect.value;
            this.orderData.payment.momoNumber = '+233' + this.momoNumberInput.value.trim();
        } else if (selectedPaymentMethod === 'card-payment') {
            this.orderData.payment.cardNumber = this.cardNumberInput.value.replace(/\s/g, '');
            this.orderData.payment.cardExpiry = this.cardExpiryInput.value;
            this.orderData.payment.cardCvv = this.cardCvvInput.value;
        } else if (selectedPaymentMethod === 'bank-transfer') {
            this.orderData.payment.bankName = this.bankNameSelect.value;
            this.orderData.payment.accountNumber = this.accountNumberInput.value.trim();
        }
        
        localStorage.setItem('afroFestOrderData', JSON.stringify(this.orderData));
    }
    
    initEventListeners() {
        // Payment method selection
        this.paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.showPaymentDetails(radio.id);
            });
        });
        
        // Format card number with spaces
        if (this.cardNumberInput) {
            this.cardNumberInput.addEventListener('input', () => {
                this.formatCardNumber(this.cardNumberInput);
            });
        }
        
        // Format expiry date with slash
        if (this.cardExpiryInput) {
            this.cardExpiryInput.addEventListener('input', () => {
                this.formatExpiryDate(this.cardExpiryInput);
            });
        }
        
        // Proceed button click
        this.proceedBtn.addEventListener('click', () => {
            if (this.validateForm()) {
                this.saveCustomerData();
                window.location.href = 'confirmation.html';
            }
        });
        
        // Auto-save personal details on blur
        [this.firstNameInput, this.lastNameInput, this.emailInput, this.phoneInput].forEach(input => {
            input.addEventListener('blur', () => {
                if (this.validateForm()) {
                    this.saveCustomerData();
                }
            });
        });
        
        // Auto-save mobile money details on blur
        [this.momoProviderSelect, this.momoNumberInput].forEach(input => {
            input.addEventListener('blur', () => {
                if (document.getElementById('mobile-money').checked) {
                    if (this.validateForm()) {
                        this.saveCustomerData();
                    }
                }
            });
        });
        
        // Auto-save card details on blur
        [this.cardNumberInput, this.cardExpiryInput, this.cardCvvInput].forEach(input => {
            input.addEventListener('blur', () => {
                if (document.getElementById('card-payment').checked) {
                    if (this.validateForm()) {
                        this.saveCustomerData();
                    }
                }
            });
        });
        
        // Auto-save bank details on blur
        [this.bankNameSelect, this.accountNumberInput].forEach(input => {
            input.addEventListener('blur', () => {
                if (document.getElementById('bank-transfer').checked) {
                    if (this.validateForm()) {
                        this.saveCustomerData();
                    }
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DetailsPage();
});