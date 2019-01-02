const createArray = (num, dimensions) => {
  var array = []
  for (var i = 0; i < dimensions; i++) {
    array.push([])
    for (var j = 0; j < dimensions; j++) {
      array[i].push(num)
    }
  }
  return array
}

export const generateMap = (dimensions, maxTunnels, maxLength) => {
  // set dimensions of dungeon, max number of tunnels and length of tunnels

  let map = createArray(1, dimensions)

  // select random row and column to start tunnel
  let currentRow = 1
  let currentColumn = 1

  // create directions to traverse the array
  const UP = [-1, 0]
  const DOWN = [1, 0]
  const LEFT = [0, -1]
  const RIGHT = [0, 1]

  let directions = [UP, DOWN, LEFT, RIGHT]

  // initialize random direction variable and last direction variable
  // to store the old randomDirection
  let lastDirection = []
  let randomDirection
  while (maxTunnels && dimensions && maxLength) {
    randomDirection = chooseRandomDirection(directions, lastDirection)

    // set random length of tunnel from maxLength.
    // tunnelLength is an iterator
    let randomLength = Math.ceil(Math.random() * maxLength)
    let tunnelLength = 0

    while (tunnelLength < randomLength) {
      if (
        (currentRow === 1 && randomDirection[0] === -1) ||
        (currentColumn === 1 && randomDirection[1] === -1) ||
        (currentRow === dimensions - 2 && randomDirection[0] === 1) ||
        (currentColumn === dimensions - 2 && randomDirection[1] === 1)
      ) {
        break
      } else {
        map[currentRow][currentColumn] = 0
        currentRow += randomDirection[0]
        currentColumn += randomDirection[1]
        tunnelLength++
      }
    }

    if (tunnelLength) {
      lastDirection = randomDirection
      maxTunnels--
    }
  }
  return map
}

export const createMapWithAssets = (dimensions, maxTunnels, maxLength) => {
  let map = generateMap(dimensions, maxTunnels, maxLength)
  var currentRow
  var currentColumn
  var max_eggs = 10
  // create egg spawn points
  while (max_eggs > 0) {
    do {
      currentRow = Math.floor(Math.random() * (map.length - 1))
      currentColumn = Math.floor(Math.random() * (map.length - 1))
      var randomSpot = map[currentRow][currentColumn]
      var spotBelowRandom = map[currentRow + 1][currentColumn]
    } while (randomSpot === 1 || spotBelowRandom === 0)
    map[currentRow][currentColumn] = 2
    max_eggs--
  }
  // create door spawn point
  do {
    currentRow = Math.floor(Math.random() * (map.length - 1))
    currentColumn = Math.floor(Math.random() * (map.length - 1))
    var randomSpot = map[currentRow][currentColumn]
    var spotBelowRandom = map[currentRow + 1][currentColumn]
  } while (randomSpot === 1 || spotBelowRandom === 0 || spotBelowRandom === 2)
  map[currentRow][currentColumn] = 3
  console.log(map)
  return map
}
const chooseRandomDirection = (directions, lastDirection) => {
  // set up a do-while loop to set a random direction that isn't back on it self or the same
  do {
    var randomDirection =
      directions[Math.floor(Math.random() * directions.length)]
  } while (
    (randomDirection[0] === -lastDirection[0] &&
      randomDirection[1] === -lastDirection[1]) ||
    (randomDirection[0] === lastDirection[0] &&
      randomDirection[1] === lastDirection[1])
  )
  return randomDirection
}
