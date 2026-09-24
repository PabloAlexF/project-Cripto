import styles from "./header.module.css"
import imgLogo from "../../../assets/logo.svg"
import { Link } from "react-router-dom"

export function Header(){
    return(
        <>
            <header className={styles.container}>
               <Link to="/">
                <img src={imgLogo} alt="logoHeader" />
               </Link>
            </header>
        </>
    )
}