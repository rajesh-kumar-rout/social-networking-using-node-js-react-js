export default function Image(props) {
    
    const { src, alt, ...others } = props

    const image = src ? src : alt

    return <img src={image} {...others}/>
}