async function singlepage(props) {
  const { count } = props
  const sequences = []
  Array(Number(count)).fill().map((_, index) => {
    sequences.push([ index + 1])
  })
  return { sequences, count: sequences.length }
}

async function doublepage(props) {
  const { count } = props
  const sequences = []
  const seq = Math.ceil(Number(count) / 2) + 1
  Array(seq).fill().map((_, index) => {
    sequences.push([ index * 2, index * 2 + 1 ])
  })
  // Remove 0 from first index.
  sequences[0].shift()
  // Make sure last index does not includes outbound sequences.
  if (sequences[sequences.length - 1][1] > count) {
    sequences[sequences.length - 1].pop()
  }
  if (sequences[sequences.length - 1][0] > count) {
    sequences.pop()
  }
  return { sequences, count: sequences.length }
}

async function seqmap(props) {
  const { count, view } = props
  switch (view) {
    case 'doublepage':
      return await doublepage({count})
    default:
      return await singlepage({count})
  }
}

export { seqmap }
