const between = (num, start, end) => {
  return num >= start && num < end;
};

const getLevel = (currentLevel, points) => {
  const level = between(points, 0, 100)
    ? 1
    : between(points, 100, 200)
    ? 2
    : between(points, 200, 400)
    ? 3
    : between(points, 400, 800)
    ? 4
    : between(points, 800, 1600)
    ? 5
    : between(points, 1600, 3200)
    ? 6
    : between(points, 3200, 6400)
    ? 7
    : between(points, 6400, 12800)
    ? 8
    : between(points, 12800, 25600)
    ? 9
    : between(points, 25600, 51200)
    ? 10
    : currentLevel;
  return level;
};

module.exports = { getLevel };
