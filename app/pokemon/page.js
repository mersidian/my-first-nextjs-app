import PokemonGrid from './PokemonGrid';

async function getPokemonWithTypes() {
  // 1. Get the list of 151 Pokemon
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const listData = await res.json();
  
  // 2. FETCH DETAILS FOR ALL OF THEM IN PARALLEL
  // This is much faster than waiting for one, then the next, then the next.
  const detailedPokemon = await Promise.all(
    listData.results.map(async (p) => {
      const pRes = await fetch(p.url);
      return pRes.json(); // This returns the full object with 'types', 'stats', etc.
    })
  );

  return detailedPokemon;
}

export default async function PokemonPage() {
  const pokemonList = await getPokemonWithTypes();

  // We map it to a simpler format to keep our Client Component light
  const formattedPokemon = pokemonList.map(p => ({
    id: p.id,
    name: p.name,
    image: p.sprites.other['official-artwork'].front_default,
    types: p.types.map(t => t.type.name) // e.g., ["grass", "poison"]
  }));

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "30px" }}>
        Pokedex
      </h1>
      
      <PokemonGrid pokemonList={formattedPokemon} />
    </div>
  );
}