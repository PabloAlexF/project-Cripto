import styles from "./home.module.css"
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, type SubmitEvent} from "react"

interface coinProps {
    id: string,
    rank: string,
    symbol: string,
    name: string,
    supply: string,
    maxSupply: string,
    marketCapUsd: string,
    volumeUsd24Hr: string,
    priceUsd: string,
    changePercent24Hr: string,
    vwap24Hr: string,
    explorer: string,
    status: string,
    frozenAt: boolean;
    formatedPrice: string|number;
    formatedMarket: string|number;
    formatedVolume: string|number;
}

interface dataProps{
    data: coinProps[];
}

export function Home(){

    const [input, setInput] = useState("");
    const [coins, setCoins] = useState<coinProps[]>([])
    const [offset, setOffset] = useState(0)

    const navigate = useNavigate();
    
    useEffect(() => {
        getData()
    }, [offset])
    
    function handleGetMore(){
        if(offset === 0) {
            setOffset(10);
            return;
        }
        setOffset(offset + 10);
        
    }


    async function getData(){
        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            const response = await fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=${apiKey}`);
            if(!response.ok) {
                throw new Error("Erro na requisição!");
            }

            const data:dataProps = await response.json();
            const coinsData = data.data;

            const price = Intl.NumberFormat("es-US", {
                style: "currency",
                currency: "USD",
            })
            const priceCompact = Intl.NumberFormat("es-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
            })
            
            const formatedResult = coinsData.map((item) => {
                const formated = {
                    ...item,
                    formatedPrice: price.format(Number(item.priceUsd)),
                    formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                    formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
                }
                return formated;
            })
            
            // console.log(formatedResult)
            const listCoins = [...coins, ...formatedResult]
            setCoins(listCoins);

        } catch (error) {
            console.log(`Erro de requisição detectado, ERRO: ${error}`)
        }
    }
    

    function handleSumit(e:SubmitEvent) {
        e.preventDefault();

        if(input === ""){
             alert("Por favor, preencha o campo!");
             return;
        } else{
            navigate(`/detail/${input}`)
        }
    }


    return(
        <>
            <main className={styles.container}>
                <form className={styles.form} onSubmit={handleSumit}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Digite o nome da moeda... EX bitcoin"
                        value={input}
                        onChange={(e) => setInput(e.target.value) }
                    />

                    <button className={styles.button} type="submit">
                        <BsSearch color="white" size={22} />
                    </button>
                </form>

                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr className={styles.tr}>
                            <th className={styles.th} scope="col">Moeda</th>
                            <th className={styles.th} scope="col">Valor Mercado</th>
                            <th className={styles.th} scope="col">Preço</th>
                            <th className={styles.th} scope="col">Volume</th>
                            <th className={styles.th} scope="col">Mundaça 24h</th>
                        </tr>
                    </thead>

                    <tbody className={styles.tbody}>
                        {coins.length > 0 && coins.map((item) => (
                            <tr key={item.id} className={styles.tr}>
                            <td data-label="Moeda" className={styles.td}>
                                <div className={styles.name}>
                                    <img className={styles.logoIcons} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`} alt="" />
                                    <Link to={`/detail/${item.id}`}><span>{item.name}</span> | {item.symbol}</Link>
                                </div>
                            </td>
                            <td data-label="Valor Mercado" className={styles.td}>{item.formatedMarket}</td>
                            <td data-label="Preço" className={styles.td}>{item.formatedPrice}</td>
                            <td data-label="Volume" className={styles.td}>{item.formatedVolume}</td>
                            <td data-label="Mudança" className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss}><span>{`${Number(item.changePercent24Hr).toFixed(2)}%`}</span></td>
                        </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={handleGetMore} className={styles.buttonMore}>
                    Carregar Mais...
                </button>
            </main>
        </>
    )
}
