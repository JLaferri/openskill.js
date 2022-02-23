import { rating, predict } from '..'

describe('predict', () => {
  const precision = 7

  const a1 = rating()
  const a2 = rating({ mu: 32.444, sigma: 5.123 })

  const b1 = rating({ mu: 73.381, sigma: 1.421 })
  const b2 = rating({ mu: 25.188, sigma: 6.211 })

  const team1 = [a1, a2]
  const team2 = [b1, b2]

  it('predicts win outcome for two teams', () => {
    expect.assertions(2)
    const [prob1, prob2] = predict([team1, team2])
    expect(prob1).toBeCloseTo(0.34641823958165474, precision)
    expect(prob2).toBeCloseTo(0.6535817604183453, precision)
  })

  it('ignores rankings', () => {
    expect.assertions(1)
    const p1 = predict([[a2], [b1], [b2]], { rank: [2, 1, 3] })
    const p2 = predict([[a2], [b1], [b2]], { rank: [3, 2, 1] })
    expect(p1).toStrictEqual(p2)
  })

  it('predicts win outcome for multiple asymmetric teams', () => {
    expect.assertions(4)
    const [prob1, prob2, prob3, prob4] = predict([team1, team2, [a2], [b2]])
    // should denom 6
    expect(prob1).toBeCloseTo(0.2613515941642222, precision)
    expect(prob2).toBeCloseTo(0.41117430943389155, precision)
    expect(prob3).toBeCloseTo(0.1750905983112395, precision)
    expect(prob4).toBeCloseTo(0.15238349809064686, precision)
  })

  it('3 player newbie FFA', () => {
    expect.assertions(3)
    const [prob1, prob2, prob3] = predict([[a1], [a1], [a1]])
    // denom 3
    expect(prob1).toBeCloseTo(0.333333333333, precision)
    expect(prob2).toBeCloseTo(0.333333333333, precision)
    expect(prob3).toBeCloseTo(0.333333333333, precision)
  })

  it('4 player newbie FFA', () => {
    expect.assertions(4)
    const [p1, p2, p3, p4] = predict([[a1], [a1], [a1], [a1]])
    // denom 6
    expect(p1).toBeCloseTo(0.25, precision)
    expect(p2).toBeCloseTo(0.25, precision)
    expect(p3).toBeCloseTo(0.25, precision)
    expect(p4).toBeCloseTo(0.25, precision)
  })

  it('4 players of varying skill', () => {
    expect.assertions(4)
    const r1 = rating({ mu: 1, sigma: 0.1 })
    const r2 = rating({ mu: 2, sigma: 0.1 })
    const r3 = rating({ mu: 3, sigma: 0.1 })
    const r4 = rating({ mu: 4, sigma: 0.1 })
    const [p1, p2, p3, p4] = predict([[r1], [r2], [r3], [r4]])
    expect(p1).toBeCloseTo(0.2028051110543726, precision)
    expect(p2).toBeCloseTo(0.23419421333676907, precision)
    expect(p3).toBeCloseTo(0.2658057866632309, precision)
    expect(p4).toBeCloseTo(0.29719488894562746, precision)
  })

  it('5 player newbie FFA', () => {
    expect.assertions(5)
    // denom 10
    const [p1, p2, p3, p4, p5] = predict([[a1], [a1], [a1], [a1], [a1]])
    expect(p1).toBeCloseTo(0.2, precision)
    expect(p2).toBeCloseTo(0.2, precision)
    expect(p3).toBeCloseTo(0.2, precision)
    expect(p4).toBeCloseTo(0.2, precision)
    expect(p5).toBeCloseTo(0.2, precision)
  })

  it('5 player FFA with an impostor', () => {
    expect.assertions(5)
    const [p1, p2, p3, p4, p5] = predict([[a1], [a1], [a1], [a2], [a1]])
    expect(p1).toBeCloseTo(0.196037416522638, precision)
    expect(p2).toBeCloseTo(0.196037416522638, precision)
    expect(p3).toBeCloseTo(0.196037416522638, precision)
    expect(p4).toBeCloseTo(0.21585034503812, precision)
    expect(p5).toBeCloseTo(0.196037416522638, precision)
  })
})
