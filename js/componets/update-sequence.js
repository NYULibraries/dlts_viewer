async function update(prop) {

  const dataset = document.querySelector('#openseadragon1').dataset

  const { sequenceCount } = dataset

  const sequence = Number(dataset.sequence) + 1

  let sequence_count =  Number(sequenceCount)

  if (sequence >= sequence_count) return sequence_count
  else {
    document.querySelector('#openseadragon1').dataset.sequence = sequence.toString()
    document.querySelector('#range_weight').value = 
      document.querySelector('#slider_value').value = sequence
  }

}

export { update }
