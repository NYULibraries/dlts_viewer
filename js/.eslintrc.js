module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "ecmaFeatures": {
    "modules": true,
    "spread": true,
    "restParams": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2016,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": 2,
    "no-undef": 2,
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
