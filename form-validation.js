class FormValidator {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.successMessage = document.getElementById('successMessage');
        this.submitBtn = document.getElementById('submitBtn');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Real-time validation
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
            this.updateSubmitButton();
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.handleFormSubmission();
            }
        });

        // Password strength indicator
        const passwordInput = document.getElementById('password');
        passwordInput.addEventListener('input', () => {
            this.updatePasswordStrength();
        });

        // Experience range output
        const experienceInput = document.getElementById('experience');
        const experienceOutput = document.getElementById('experienceOutput');
        experienceInput.addEventListener('input', () => {
            experienceOutput.textContent = `${experienceInput.value} years`;
        });

        // Reset form
        this.form.addEventListener('reset', () => {
            this.clearAllErrors();
            this.updateSubmitButton();
        });
    }

    validateField(field) {
        const errorElement = document.getElementById(`${field.id}Error`);
        
        if (!errorElement) return;

        const error = this.getFieldError(field);
        
        if (error) {
            this.showError(field, errorElement, error);
        } else {
            this.clearError(field, errorElement);
        }
    }

    getFieldError(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');

        if (isRequired && !value) {
            return 'This field is required';
        }

        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    return 'Please enter a valid email address';
                }
                break;
            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    return 'Please enter a valid 10-digit phone number';
                }
                break;
            case 'password':
                if (value && value.length < 8) {
                    return 'Password must be at least 8 characters long';
                }
                break;
        }

        switch (field.id) {
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (value !== password) {
                    return 'Passwords do not match';
                }
                break;
            case 'firstName':
            case 'lastName':
                if (value && !this.isValidName(value)) {
                    return 'Please enter a valid name';
                }
                break;
        }

        return null;
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], select[required]');

        fields.forEach(field => {
            this.validateField(field);
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement && errorElement.textContent) {
                isValid = false;
            }
        });

        return isValid;
    }

    showError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
    }

    clearError(field, errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }

    clearAllErrors() {
        const errorMessages = this.form.querySelectorAll('.error-message');
        const errorFields = this.form.querySelectorAll('.error');
        
        errorMessages.forEach(element => element.textContent = '');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    updateSubmitButton() {
        const requiredFields = this.form.querySelectorAll('input[required], select[required]');
        const allFilled = Array.from(requiredFields).every(field => field.value.trim() !== '');
        
        this.submitBtn.disabled = !allFilled;
    }

    updatePasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!password) {
            strengthBar.style.width = '0%';
            strengthBar.style.background = 'var(--border-color)';
            strengthText.textContent = 'Password strength';
            return;
        }

        const strength = this.calculatePasswordStrength(password);
        
        switch (strength.level) {
            case 'weak':
                strengthBar.style.width = '33%';
                strengthBar.style.background = 'var(--error-color)';
                strengthText.textContent = 'Weak password';
                break;
            case 'medium':
                strengthBar.style.width = '66%';
                strengthBar.style.background = 'var(--warning-color)';
                strengthText.textContent = 'Medium password';
                break;
            case 'strong':
                strengthBar.style.width = '100%';
                strengthBar.style.background = 'var(--success-color)';
                strengthText.textContent = 'Strong password';
                break;
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character variety
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        
        if (score <= 2) return { level: 'weak', score };
        if (score <= 4) return { level: 'medium', score };
        return { level: 'strong', score };
    }

    handleFormSubmission() {
        // Simulate API call
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Creating Account...';
        
        setTimeout(() => {
            this.form.hidden = true;
            this.successMessage.hidden = false;
        }, 1500);
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    isValidName(name) {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
        return nameRegex.test(name);
    }
}

// Global function to reset form
function resetForm() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    form.reset();
    form.hidden = false;
    successMessage.hidden = true;
    
    const validator = new FormValidator();
    validator.clearAllErrors();
    validator.updateSubmitButton();
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
});