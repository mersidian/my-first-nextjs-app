// app/pokemon/[id]/page.js
import Link from "next/link";

// 1. Fetch function for a SINGLE Pokemon
async function getPokemonDetail(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();
}

export default async function PokemonDetail({ params }) {
  // 2. Unwrap the params to get the ID (e.g., "1", "25")
  const { id } = await params;
  
  // 3. Fetch the data
  const pokemon = await getPokemonDetail(id);

  // 4. Get the high-quality image
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
      
      {/* Back Button */}
      <Link href="/pokemon" style={{ textDecoration: "none", color: "#666", fontSize: "0.9rem" }}>
        ← Back to Pokedex
      </Link>

      <div style={{ margin: "30px auto", maxWidth: "400px", border: "1px solid #ddd", borderRadius: "15px", padding: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textTransform: "capitalize", fontSize: "2.5rem", margin: "10px 0" }}>
          {pokemon.name}
        </h1>

        <img 
          src={image} 
          alt={pokemon.name} 
          style={{ width: "200px", height: "200px" }} 
        />

        {/* Types (e.g., Grass, Poison) */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "20px 0" }}>
          {pokemon.types.map((t) => (
            <span key={t.type.name} style={{ 
              padding: "5px 15px", 
              background: "#333", 
              color: "white", 
              borderRadius: "20px", 
              textTransform: "capitalize" 
            }}>
              {t.type.name}
            </span>
          ))}
        </div>

        {/* Stats Table */}
        <div style={{ textAlign: "left", background: "#f9f9f9", padding: "15px", borderRadius: "10px" }}>
          <p><strong>Height:</strong> {pokemon.height * 10} cm</p>
          <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
          <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "10px 0" }} />
          <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        </div>

      </div>
    </div>
  );
}