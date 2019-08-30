function requestSequence (sequence) {

  const currentSequence = getSequence();

  const bookUrl = getBookUrl();

  if (currentSequence !== sequence) {

    // update loading message with the requested sequence
    updateLoadingMessage(sequence);

    // display loading message
    displayLoadingMessage();

    // request sequence
    fetch(`${bookUrl}/${sequence}?pjax=1`)
      .then(response => response.text())
      .then(data => {
        pjaxLoad(data);
      })
      .catch(error => {
        // Handle error
      });

  }

}
