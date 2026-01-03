import {useBearStore} from '../../store/store'

export function BearCounter() {
  const bears = useBearStore(state => state.bears)
  const increasePopulation = useBearStore(state => state.increasePopulation)
  const decreasePopulation = useBearStore(state => state.decreasePopulation)
  const removeBears = useBearStore(state => state.removeAllBears)

  return ( 
    <>
      <h1>{bears}</h1>
      <button onClick={increasePopulation}>Add a bear</button>
      <button onClick={decreasePopulation}>Remove one bear</button>
      <button onClick={removeBears}>Remove all bears</button>
  </>
 )
}