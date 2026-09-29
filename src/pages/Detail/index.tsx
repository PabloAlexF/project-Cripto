
import styles from "./details.module.css"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { type coinProps } from "../Home";

interface responseData {
    data: coinProps;
}

interface errorData{
    error: string;
}

type DataProps = responseData | errorData;

export function Detail(){

    const navigate = useNavigate();

    const {cripto} = useParams();

    const [coin,setCoin] = useState<coinProps>()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function GetCripto() {
        try {
            const apiKey = import.meta.env.VITE_API_KEY;

            const response = await fetch(
                `https://rest.coincap.io/v3/assets/${cripto}?apiKey=${apiKey}`
            );

            const data: DataProps = await response.json();

            if ("error" in data) {
                alert("Erro ao achar a página");
                navigate("/")
                return;
            }

            
                const price = Intl.NumberFormat("es-US", {
                style: "currency",
                currency: "USD",
            })
            const priceCompact = Intl.NumberFormat("es-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
            })

            const resultData = {
                ...data.data,
                    formatedPrice: price.format(Number(data.data.priceUsd)),
                    formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                    formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
                    formatedSupply: priceCompact.format(Number(data.data.supply)),
                    formatedMaxSupply: data.data.maxSupply ? priceCompact.format(Number(data.data.maxSupply)) : "—",
            }

            setCoin(resultData)
            setLoading(false);

        } catch (error) {
            console.log(`Erro na requisição!! ${error}`);
        }
    }

    GetCripto();
}, [cripto]);

    
    if (loading || !coin) {
        return (
            <div className={styles.ContainerLoading} role="status" aria-live="polite">
                <div className={styles.loadingRoot}>
                    <div className={styles.spinner} aria-hidden />
                    <div className={styles.loadingText}>Carregando...</div>
                </div>

            </div>
        )
    }

    return (
        <>
            <main className={styles.detailContainer}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>Voltar</button>

                {coin ? (
                    <>
                        <section className={styles.header}>
                            <img
                                className={styles.logo}
                                src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                                alt={coin.name}
                            />
                            <div>
                                <h1 className={styles.title}>{coin.name} <span className={styles.symbol}>| {coin.symbol}</span></h1>
                                <p className={styles.rank}>Rank #{coin.rank}</p>
                            </div>
                        </section>

                        <section className={styles.stats}>
                            <div className={styles.stat}>
                                <div className={styles.statLabel}>Preço</div>
                                <div className={styles.statValue}>{coin.formatedPrice}</div>
                            </div>

                            <div className={styles.stat}>
                                <div className={styles.statLabel}>Market Cap</div>
                                <div className={styles.statValue}>{coin.formatedMarket}</div>
                            </div>

                            <div className={styles.stat}>
                                <div className={styles.statLabel}>Volume 24h</div>
                                <div className={styles.statValue}>{coin.formatedVolume}</div>
                            </div>

                            <div className={styles.stat}>
                                <div className={styles.statLabel}>Mudança 24h</div>
                                <div className={Number(coin.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss}>{`${Number(coin.changePercent24Hr).toFixed(2)}%`}</div>
                            </div>

                            <div className={styles.stat}>
                                <div className={styles.statLabel}>Supply</div>
                                <div className={styles.statValue}>{coin.supply}</div>
                            </div>

                            <div className={styles.stat}>
                                <div className={styles.statLabel}>Max Supply</div>
                                <div className={styles.statValue}>{coin.maxSupply ?? '—'}</div>
                            </div>

                            <div className={styles.stat}>
                                <div className={styles.statLabel}>VWAP 24h</div>
                                <div className={styles.statValue}>{coin.vwap24Hr ?? '—'}</div>
                            </div>

                            <div className={styles.stat}>
                                <div className={styles.statLabel}>Explorer</div>
                                <div className={styles.statValue}><a href={coin.explorer} target="_blank" rel="noreferrer">Abrir</a></div>
                            </div>
                        </section>
                    </>
                ) : (
                    <p>Dados não disponíveis.</p>
                )}

            </main>
        </>
    )
}