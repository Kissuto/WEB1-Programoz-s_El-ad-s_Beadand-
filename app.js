const { useState, useEffect } = React;

const App = () => {
    // Alapadatok inicializálása az SQL struktúrának megfelelően
    const [klubok] = useState([
        { id: 1, csapatnev: "Ferencvárosi TC" },
        { id: 2, csapatnev: "Paksi FC" },
        { id: 3, csapatnev: "Puskás Akadémia" },
        { id: 4, csapatnev: "Debreceni VSC" }
    ]);

    const [posztok] = useState([
        { id: 1, nev: "kapus" },
        { id: 2, nev: "hátvéd" },
        { id: 3, nev: "középpályás" },
        { id: 4, nev: "csatár" }
    ]);

    const [labdarugok, setLabdarugok] = useState([
        { id: 1, mezszam: 1, klubid: 1, posztid: 1, utonev: "Dénes", vezeteknev: "Dibusz", ertek: 2500 },
        { id: 2, mezszam: 42, klubid: 2, posztid: 2, utonev: "Barna", vezeteknev: "Kinyik", ertek: 400 }
    ]);

    const [activeMenu, setActiveMenu] = useState("players");

    // --- SEGÉDFÜGGVÉNYEK ---
    const getKlubNev = (id) => klubok.find(k => k.id === id)?.csapatnev || "Ismeretlen";
    const getPosztNev = (id) => posztok.find(p => p.id === id)?.nev || "Ismeretlen";

    // --- KOMPONENSEK ---

    // 1. Menü: Játékos Kezelő (CRUD)
    const PlayerManager = () => {
        const [form, setForm] = useState({ vezeteknev: "", utonev: "", ertek: "", klubid: 1, posztid: 1 });

        const handleAdd = () => {
            if (!form.vezeteknev || !form.ertek) return;
            const newPlayer = { ...form, id: Date.now(), ertek: parseInt(form.ertek), klubid: parseInt(form.klubid), posztid: parseInt(form.posztid) };
            setLabdarugok([...labdarugok, newPlayer]);
            setForm({ vezeteknev: "", utonev: "", ertek: "", klubid: 1, posztid: 1 });
        };

        const handleDelete = (id) => setLabdarugok(labdarugok.filter(p => p.id !== id));

        return (
            <div className="container">
                <h2>Játékos Nyilvántartás (CRUD)</h2>
                <div className="form-group" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Vezetéknév" value={form.vezeteknev} onChange={e => setForm({...form, vezeteknev: e.target.value})} />
                    <input type="text" placeholder="Utónév" value={form.utonev} onChange={e => setForm({...form, utonev: e.target.value})} />
                    <input type="number" placeholder="Érték (k €)" value={form.ertek} onChange={e => setForm({...form, ertek: e.target.value})} />
                    <select value={form.klubid} onChange={e => setForm({...form, klubid: e.target.value})}>
                        {klubok.map(k => <option key={k.id} value={k.id}>{k.csapatnev}</option>)}
                    </select>
                    <button className="btn" onClick={handleAdd}>Hozzáadás</button>
                </div>

                <table>
                    <thead>
                        <tr><th>Név</th><th>Klub</th><th>Poszt</th><th>Érték</th><th>Műveletek</th></tr>
                    </thead>
                    <tbody>
                        {labdarugok.map(p => (
                            <tr key={p.id}>
                                <td>{p.vezeteknev} {p.utonev}</td>
                                <td>{getKlubNev(p.klubid)}</td>
                                <td>{getPosztNev(p.posztid)}</td>
                                <td>{p.ertek} k €</td>
                                <td><button onClick={() => handleDelete(p.id)}>Törlés</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // 2. Menü: Piaci Statisztika
    const MarketStats = () => {
        const totalValue = labdarugok.reduce((sum, p) => sum + p.ertek, 0);
        const avgValue = labdarugok.length > 0 ? (totalValue / labdarugok.length).toFixed(0) : 0;

        return (
            <div className="container">
                <h2>Piaci Elemzés</h2>
                <div className="team-grid">
                    <div className="team-card">
                        <h3>Összesített Érték</h3>
                        <p style={{fontSize: '24px', fontWeight: 'bold'}}>{totalValue.toLocaleString()} ezer €</p>
                    </div>
                    <div className="team-card">
                        <h3>Átlagos Érték</h3>
                        <p style={{fontSize: '24px', fontWeight: 'bold'}}>{avgValue.toLocaleString()} ezer € / fő</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <nav className="navbar" style={{ justifyContent: 'center', gap: '20px' }}>
                <button className="btn" onClick={() => setActiveMenu("players")}>Játékosok</button>
                <button className="btn" onClick={() => setActiveMenu("stats")}>Statisztika</button>
            </nav>
            <main>
                {activeMenu === "players" ? <PlayerManager /> : <MarketStats />}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('react-app'));
root.render(<App />);