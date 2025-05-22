(() => {
    'use strict';

    // Select all forms with the class "needs-validation"
    const forms = document.querySelectorAll('.needs-validation');

    // Loop through each form and apply custom validation
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        // Prevent submission if the form is invalid
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        // Add the Bootstrap class "was-validated" to show validation feedback
        form.classList.add('was-validated');
      }, false);
    });
  })();