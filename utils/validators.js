module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'username should not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'email should not be empty';
  } else {
    const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(regEx)) {
      errors.email = 'Invalid email';
    }
  }
  if (password === '') {
    errors.password = 'password should not be empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passowrds does not match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'username should not be empty';
  }
  if (password.trim() === '') {
    errors.password = 'password should not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
