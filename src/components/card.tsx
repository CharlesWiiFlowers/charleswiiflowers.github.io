import "./card.css"

function Card({title, content}: {title:string, content:string}){
    return (
        <div className="card">
            <h2>
                {title}
            </h2>
            <p>
                {content == '' ? (<p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ligula in purus feugiat porta."</p>) 
                : (content)}
            </p>
        </div>
    )
}

export default Card