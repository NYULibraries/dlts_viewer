  function PjaxException (value) {
    this.value = value;
    this.message = "Does not conform to the expected format for a PJAX request";
    this.toString = function () {
      return this.value + ' ' + this.message;
    };
  }
