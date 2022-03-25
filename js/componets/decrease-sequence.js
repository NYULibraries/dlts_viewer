async function decrease(props) {
  const sequence_current = Number(props.dataset.sequence)
  const sequence = sequence_current - 1
  if (sequence < 1) {
    return sequence
  } else {
    props.dataset.sequence = sequence.toString()
    document.querySelector('#range_weight').value = sequence  
    document.querySelector('#slider_value').value = sequence
  }
}

export { decrease }
