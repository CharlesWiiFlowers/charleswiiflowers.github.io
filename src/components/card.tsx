import "./card.css"

function Card({title, content, children}: {title:string, content:string, children?:React.ReactNode}){
    return (
        <div  className="card">
            <div className='div-profile-card'>
                {children && <div className="card-children">{children}</div>}
            </div>
            <div>
                <h1>
                    {title}
                </h1>
                <p>
                    {content == '' ? ("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ligula in purus feugiat porta.") 
                    : (content)}
                </p>
            </div>
        </div>
    )
}

export default Card