"use client";

import { useState } from "react";
import Link from "next/link";

export default function PokemonGrid({ pokemonList }) {
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all"); // NEW: State for Type
    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = 20;

    // 1. Get all unique types for the dropdown (e.g., grass, fire, water)
    // We use a Set to automatically remove duplicates
    const allTypes = ["all", ...new Set(pokemonList.flatMap(p => p.types))];

    // 2. FILTERING LOGIC (Name + Type)
    const filteredPokemon = pokemonList.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(query.toLowerCase());
        const matchesType = typeFilter === "all" || p.types.includes(typeFilter);

        return matchesName && matchesType;
    });

    // 3. PAGINATION
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);

    // Reset page when filters change
    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        setPage(1);
    };

    const handleTypeChange = (e) => {
        setTypeFilter(e.target.value);
        setPage(1);
    };

    return (
        <div>
            {/* --- CONTROLS SECTION --- */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>

                {/* Search Input */}
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search Pokemon..."
                    style={{
                        padding: "10px",
                        width: "200px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        fontSize: "16px"
                    }}
                />

                {/* Type Dropdown */}
                <select
                    value={typeFilter}
                    onChange={handleTypeChange}
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        textTransform: "capitalize",
                        cursor: "pointer"
                    }}
                >
                    {allTypes.map(type => (
                        <option key={type} value={type}>
                            {type === "all" ? "All Types" : type}
                        </option>
                    ))}
                </select>

            </div>

            {/* --- GRID --- */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "20px"
            }}>
                {paginatedPokemon.map((p) => (
                    <Link href={`/pokemon/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "10px",
                            textAlign: "center",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            background: "white",
                            cursor: "pointer",
                            transition: "transform 0.2s"
                        }}>
                            <img src={p.image} alt={p.name} style={{ width: "120px", height: "120px" }} />
                            <h3 style={{ textTransform: "capitalize", margin: "10px 0 5px 0" }}>
                                #{p.id} {p.name}
                            </h3>

                            {/* Show tiny type badges on the card */}
                            <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                                {p.types.map(t => (
                                    <span key={t} style={{ fontSize: "10px", background: "#eee", padding: "2px 6px", borderRadius: "4px" }}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </Link>
                ))}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        style={{ padding: "10px 20px", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1 }}
                    >
                        Previous
                    </button>

                    <span style={{ padding: "10px", fontWeight: "bold" }}>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        style={{ padding: "10px 20px", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1 }}
                    >
                        Next
                    </button>
                </div>
            )}

            {paginatedPokemon.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>No Pokemon found matching those filters.</p>
            )}
        </div>
    );
}