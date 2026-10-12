
/* =====================================
   1. SELECT HTML ELEMENTS
===================================== */

const ticketForm = document.querySelector('#ticket-form');

const formSection = document.querySelector('#form-section');
const ticketSection = document.querySelector('#ticket-section');

const avatarInput = document.querySelector('#avatar');
const avatarPreview = document.querySelector('#avatar-preview');
const uploadIcon = document.querySelector('#upload-icon');
const uploadText = document.querySelector('#upload-text');
const uploadBox = document.querySelector('.upload-box');

const fullNameInput = document.querySelector('#full-name');
const emailInput = document.querySelector('#email');
const githubInput = document.querySelector('#github');

const backButton = document.querySelector('#back-button');

const ticketHeadingName =
  document.querySelector('#ticket-heading-name');

const ticketEmail = document.querySelector('#ticket-email');
const ticketName = document.querySelector('#ticket-name');
const ticketGithub = document.querySelector('#ticket-github');
const ticketAvatar = document.querySelector('#ticket-avatar');


/* =====================================
   2. STORE THE SELECTED AVATAR
===================================== */

let selectedAvatar = null;
let avatarPreviewUrl = null;
let ticketAvatarUrl = null;

const allowedTypes = ['image/jpeg', 'image/png'];
const maxFileSize = 500 * 1024;


/* =====================================
   3. SHOW VALIDATION ERRORS
===================================== */

function showError(input, errorId, message) {
  const errorElement = document.querySelector(`#${errorId}`);

  errorElement.textContent = message;

  if (input) {
    input.setAttribute(
      'aria-invalid',
      message ? 'true' : 'false'
    );
  }
}


/* =====================================
   4. CLEAR AN ERROR MESSAGE
===================================== */

function clearError(input, errorId) {
  showError(input, errorId, '');
}


/* =====================================
   5. VALIDATE AN AVATAR FILE
===================================== */

function validateAvatar(file) {
  if (!file) {
    showError(
      avatarInput,
      'avatar-error',
      'Please upload your avatar.'
    );

    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    showError(
      avatarInput,
      'avatar-error',
      'Please upload a JPG or PNG image.'
    );

    return false;
  }

  if (file.size > maxFileSize) {
    showError(
      avatarInput,
      'avatar-error',
      'Your image must be smaller than 500KB.'
    );

    return false;
  }

  clearError(avatarInput, 'avatar-error');

  return true;
}


/* =====================================
   6. PREVIEW THE UPLOADED AVATAR
===================================== */

avatarInput.addEventListener('change', function () {
  const file = avatarInput.files[0];

  if (!file) {
    return;
  }

  if (!validateAvatar(file)) {
    selectedAvatar = null;
    avatarInput.value = '';

    avatarPreview.removeAttribute('src');
    avatarPreview.hidden = true;

    uploadIcon.hidden = false;
    uploadText.textContent =
      'Drag and drop or click to upload';

    return;
  }

  selectedAvatar = file;

  // Remove the previous temporary preview URL.
  if (avatarPreviewUrl) {
    URL.revokeObjectURL(avatarPreviewUrl);
  }

  // Create a URL for the new avatar.
  avatarPreviewUrl = URL.createObjectURL(file);

  avatarPreview.src = avatarPreviewUrl;
  avatarPreview.hidden = false;

  uploadIcon.hidden = true;

  uploadText.textContent = 'Avatar uploaded successfully';
});


/* =====================================
   7. SUPPORT KEYBOARD UPLOAD
===================================== */

uploadBox.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    avatarInput.click();
  }
});


/* =====================================
   8. SUPPORT DRAG AND DROP
===================================== */

uploadBox.addEventListener('dragover', function (event) {
  event.preventDefault();

  uploadBox.classList.add('dragging');
});

uploadBox.addEventListener('dragleave', function () {
  uploadBox.classList.remove('dragging');
});

uploadBox.addEventListener('drop', function (event) {
  event.preventDefault();

  uploadBox.classList.remove('dragging');

  const files = event.dataTransfer.files;

  if (files.length > 0) {
    avatarInput.files = files;

    avatarInput.dispatchEvent(
      new Event('change', { bubbles: true })
    );
  }
});


/* =====================================
   9. VALIDATE THE FULL NAME
===================================== */

function validateName() {
  const fullName = fullNameInput.value.trim();

  if (fullName === '') {
    showError(
      fullNameInput,
      'name-error',
      'Full name cannot be empty.'
    );

    return false;
  }

  clearError(fullNameInput, 'name-error');

  return true;
}


/* =====================================
   10. VALIDATE THE EMAIL ADDRESS
===================================== */

function validateEmail() {
  const email = emailInput.value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === '') {
    showError(
      emailInput,
      'email-error',
      'Email address cannot be empty.'
    );

    return false;
  }

  if (!emailPattern.test(email)) {
    showError(
      emailInput,
      'email-error',
      'Please enter a valid email address.'
    );

    return false;
  }

  clearError(emailInput, 'email-error');

  return true;
}


/* =====================================
   11. VALIDATE THE GITHUB USERNAME
===================================== */

function validateGithub() {
  const github = githubInput.value.trim();

  if (github === '') {
    showError(
      githubInput,
      'github-error',
      'GitHub username cannot be empty.'
    );

    return false;
  }

  clearError(githubInput, 'github-error');

  return true;
}


/* =====================================
   12. VALIDATE WHILE TYPING
===================================== */

fullNameInput.addEventListener('input', function () {
  validateName();
});

emailInput.addEventListener('input', function () {
  validateEmail();
});

githubInput.addEventListener('input', function () {
  validateGithub();
});


/* =====================================
   13. GENERATE THE TICKET
===================================== */

ticketForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Validate every field.
  const nameIsValid = validateName();
  const emailIsValid = validateEmail();
  const githubIsValid = validateGithub();
  const avatarIsValid = validateAvatar(selectedAvatar);

  // Stop if any field is invalid.
  if (
    !nameIsValid ||
    !emailIsValid ||
    !githubIsValid ||
    !avatarIsValid
  ) {
    const firstInvalidField = ticketForm.querySelector(
      '[aria-invalid="true"]'
    );

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return;
  }

  // Get the final values.
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const github = githubInput.value.trim();

  // Display the attendee's name.
  ticketHeadingName.textContent = fullName;
  ticketName.textContent = fullName;

  // Display the attendee's email.
  ticketEmail.textContent = email;

  // Add @ if the username doesn't already have it.
  ticketGithub.textContent = github.startsWith('@')
    ? github
    : `@${github}`;

  // Create a separate URL for the ticket avatar.
  if (ticketAvatarUrl) {
    URL.revokeObjectURL(ticketAvatarUrl);
  }

  ticketAvatarUrl = URL.createObjectURL(selectedAvatar);
  ticketAvatar.src = ticketAvatarUrl;

  // Hide the form and show the generated ticket.
  formSection.hidden = true;
  ticketSection.hidden = false;

  // Move focus to the ticket heading.
  ticketHeadingName.focus();
});


/* =====================================
   14. CREATE ANOTHER TICKET
===================================== */

backButton.addEventListener('click', function () {
  // Reset the form fields.
  ticketForm.reset();

  // Clear all error messages.
  document.querySelectorAll('.error').forEach(function (error) {
    error.textContent = '';
  });

  // Remove validation states.
  ticketForm.querySelectorAll('[aria-invalid]').forEach(
    function (input) {
      input.removeAttribute('aria-invalid');
    }
  );

  // Clear the selected avatar.
  selectedAvatar = null;

  avatarInput.value = '';

  // Remove the preview image.
  avatarPreview.removeAttribute('src');
  avatarPreview.hidden = true;

  uploadIcon.hidden = false;

  uploadText.textContent =
    'Drag and drop or click to upload';

  // Release the temporary image URLs.
  if (avatarPreviewUrl) {
    URL.revokeObjectURL(avatarPreviewUrl);
    avatarPreviewUrl = null;
  }

  if (ticketAvatarUrl) {
    URL.revokeObjectURL(ticketAvatarUrl);
    ticketAvatarUrl = null;
  }

  ticketAvatar.removeAttribute('src');

  // Show the form again.
  ticketSection.hidden = true;
  formSection.hidden = false;

  // Focus the first field.
  fullNameInput.focus();
});