import React, { useReducer } from 'react'

const ACTIONS = {
  ADD_PLAYER: 'add-player',
  UPDATE_POBLACION: 'update-poblacion',
  UPDATE_CIUDADES: 'update-ciudades',
}

// Reducer para manejar jugadores
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_PLAYER:
      return [
        ...state,
        { id: Date.now(), poblacion: 0, ciudades: 0 },
      ]
    case ACTIONS.UPDATE_POBLACION:
      return state.map(player =>
        player.id === action.payload.id
          ? { ...player, poblacion: action.payload.poblacion }
          : player
      )
    case ACTIONS.UPDATE_CIUDADES:
      return state.map(player =>
        player.id === action.payload.id
          ? { ...player, ciudades: action.payload.ciudades }
          : player
      )
    default:
      return state
  }
}

const initialState = []

const Catan = () => {
  const [players, dispatch] = useReducer(reducer, initialState)

  const addPlayer = () => {
    dispatch({ type: ACTIONS.ADD_PLAYER })
  }

  const handlePoblacionChange = (id, value) => {
    dispatch({
      type: ACTIONS.UPDATE_POBLACION,
      payload: { id, poblacion: Number(value) },
    })
  }

  const handleCiudadesChange = (id, value) => {
    dispatch({
      type: ACTIONS.UPDATE_CIUDADES,
      payload: { id, ciudades: Number(value) },
    })
  }

  return (
    <div>
      <h1>Catan</h1>
      <h2>Contador de puntos</h2>

      <button onClick={addPlayer}>Añadir Jugador</button>

      {players.map((player, index) => {
        const puntosTotales = player.ciudades * 2 + player.poblacion

        return (
          <div key={player.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <h3>Jugador {index + 1}</h3>
            <p>Puntos totales: {puntosTotales}</p>

            <label>
              Nro población:
              <input
                type="number"
                value={player.poblacion}
                onChange={(e) => handlePoblacionChange(player.id, e.target.value)}
                min="0"
              />
            </label>

            <br />

            <label>
              Nro ciudades:
              <input
                type="number"
                value={player.ciudades}
                onChange={(e) => handleCiudadesChange(player.id, e.target.value)}
                min="0"
              />
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default Catan
