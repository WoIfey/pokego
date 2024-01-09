import React, { useState, useEffect } from 'react'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [caughtPokemon, setCaughtPokemon] = useState([])
  const [message, setMessage] = useState(null)
  const [isShiny, setIsShiny] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    try {
      const randomPokemon = Math.floor(Math.random() * 1017) + 1
      setLoading(true)
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`)
      const data = await res.json()

      const isShiny = Math.random() < 0.1
      setIsShiny(isShiny)
      if (!isShiny) {
        setMessage(null)
      } else {
        data.sprites.front_default = data.sprites.front_shiny
        setMessage(`Wow! You found a shiny ${data.name}!`)
      }

      setPokemon(data)
    } catch (error) {
      setMessage(error.message)
      setPokemon(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedPokemon = localStorage.getItem('caughtPokemon')
    if (storedPokemon) {
      setCaughtPokemon(JSON.parse(storedPokemon))
    }
  }, [])

  const handleCatch = (exp) => {
    if (pokemon) {
      const catchRate = Math.random() * 100
      const shinySuffix = isShiny ? " (Shiny)" : ""
      const caughtPokemonName = pokemon.name.toUpperCase() + shinySuffix

      /*       const chance = Math.random()
            const catched = -0.00109090909090909 * exp + 0.549090909090909 */

      if (catchRate < 35) {
        setCaughtPokemon((prevCaughtPokemon) => {
          const newCaughtPokemon = [...prevCaughtPokemon, caughtPokemonName]
          localStorage.setItem('caughtPokemon', JSON.stringify(newCaughtPokemon))

          setMessage(`✅ You caught ${caughtPokemonName}!`)
          setPokemon(null)
          setIsShiny(false)
          return newCaughtPokemon
        })
        /*         return chance <= catched */
      } else {
        setMessage(`❌ Oh no! ${caughtPokemonName} ran away!`)
        setPokemon(null)
        setIsShiny(false)
        setTimeout(() => {
          handleSearch()
        }, 3000)
      }
    } else {
      setMessage("No Pokémon to catch. Search for a Pokémon first.")
    }
  }

  const showCaughtPokemon = () => {
    let caughtPokemonNames = ''
    caughtPokemon.forEach((pokemonName, index) => {
      const shinySuffix = isShiny ? " (Shiny)" : ""
      caughtPokemonNames += `${pokemonName}${shinySuffix}`
      if (index !== caughtPokemon.length - 1) {
        caughtPokemonNames += ', '
      }
    })

    setMessage(`Caught Pokémon:\n${caughtPokemonNames}`)
  }

  return (
    <div className="flex flex-col justify-center items-center h-dvh bg-slate-100 dark:bg-[url(bg.jpg)] text-white">
      <div className='bg-slate-700 min-w-max w-1/5 h-full flex justify-center items-center flex-col'>
        {message && (
          <div className='bg-slate-800 w-full p-6 mb-4 flex justify-center items-center'>
            <p className='max-w-80 max-h-32 overflow-y-auto'>{message}</p>
          </div>
        )}
        {pokemon && (
          <div className='bg-slate-800 w-full p-6 mb-4'>
            <div className='flex flex-col gap-2'>
              <div>
                <div className='flex gap-2'>
                  <img src={pokemon.sprites.front_default} alt={pokemon.name} className="bg-slate-500 rounded-md w-24 h-24 p-1" />
                  <div className='ml-1'>
                    <p>Type: <span className='uppercase'>{pokemon.types[0].type.name}</span></p>
                    <p>Height: {pokemon.height}</p>
                    <p>Weight: {pokemon.weight}</p>
                    <p>XP: {pokemon.base_experience}</p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='mt-1'>
                    <h2 className="text-2xl font-bold uppercase tracking-wide">{pokemon.name}</h2>
                    <p className='italic font-light'>ID: {pokemon.id}</p>
                  </div>
                </div>
              </div>
              <button onClick={handleCatch} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition-all">Throw Pokéball</button>
            </div>
          </div>
        )}
        <div className='flex gap-2'>
          <div className='flex gap-2'>
            <button type="submit" onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 h-10 rounded hover:bg-blue-800 transition-all flex justify-center items-center gap-1">
              <img src="public/search.svg" alt="" className='size-4' />
              <p>Search</p>
            </button>
            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
              </div>
            )}
          </div>
          <button onClick={showCaughtPokemon} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all">Pokémon Storage</button>
        </div>
      </div>
    </div>
  )
}

export default App
