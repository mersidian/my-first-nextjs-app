export default function Loading() {
    return (
        <div style={{ padding: "100px", textAlign: "center" }}>
            <h2>Loading Pokedex...</h2>
            <div style={{
                width: "50px",
                height: "50px",
                border: "5px solid #ccc",
                borderTop: "5px solid #000",
                borderRadius: "50%",
                margin: "20px auto",
                animation: "spin 1s linear infinite"
            }}></div>

            {/* Add the animation keyframes locally */}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}