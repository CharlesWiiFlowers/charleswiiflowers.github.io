import "./card.css"

function Card({title, subtitle, content, children}: {title:string, subtitle:string,content:string, children?:React.ReactNode}){
    return (
        <div  className="card">
            <div>
                <h1>
                    {title}
                </h1>
                <h2>
                    {subtitle}
                </h2>
                <p>
                    {content}
                </p>
            </div>
            <div className='div-children'>
                {children && <div className="card-children">{children}</div>}
            </div>
        </div>
    )
}

export default Card