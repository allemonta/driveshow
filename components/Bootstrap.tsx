
//carousels/Bootstrap.js
import { useState } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Bootstrap.module.css";

export default function BootstrapCarousel(props: {
    items: any[]
}) {
    const bootstrap = props.items;
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex: number, e: any) => {
    setIndex(selectedIndex);
    };
    return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
        {bootstrap.map((item) => (
        <Carousel.Item key={item.id} className={styles.itemP} interval={4000}>
            <img src={item.imageUrl} alt="slides" />
            <Carousel.Caption className={styles.caption}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <button className="btn btn-danger">Visit Docs</button>
            </Carousel.Caption>
        </Carousel.Item>
        ))}
    </Carousel>
    );
}

