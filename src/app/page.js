'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [count, setCount] = useState(null)
  const [words, setWords] = useState(null)
  const [error, setError] = useState(null)
  const [randomIndex, setRandomIndex] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    var formData = new FormData(e.target)
    const form_values = Object.fromEntries(formData)
    setWords(form_values.name)
  }

  useEffect(() => {
    if (words) {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${words}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data || !Array.isArray(data) || data.length === 0) {
            setError('Not a word')
            setCount(null)
            setRandomIndex(null)
          } else {
            setCount(data)
            setError(null)

            // Select a random definition index
            const randomIndex = Math.floor(
              Math.random() * data[0]?.meanings[0]?.definitions.length
            )
            setRandomIndex(randomIndex)
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          setError('Error fetching data')
        })
    }
  }, [words])

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-40">
        <h1 className="mb-4">Just OK Dictionary App</h1>
        <div>
          {error ? (
            <p>{error}</p>
          ) : count && count[0] && randomIndex !== null ? (
            <p>
              {count[0]?.meanings[0]?.definitions[randomIndex]?.definition ||
                'Definition not found'}
            </p>
          ) : null}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="text-black border border-gray-300 rounded-md py-1 px-4 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Search here(duh)"
            type={'text'}
            id="name"
            name="name"
          />
        </form>
      </main>
    </div>
  )
}
