async function tiles(seqmap, dataset) {
  const current = dataset.sequence - 1
  return seqmap.sequences[current].map((sequence, x) => {
    return {
      tileSource: `${dataset.service}/${dataset.type}/${dataset.identifier}/${sequence}/info.json`,
      x: x
    }
  })
}

export { tiles }
