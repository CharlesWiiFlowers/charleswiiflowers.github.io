import Card from './card';

interface dataSocial {
    link:string,
    title:string,
    source:string
}

function SocialCard({title, data}: {title:string, data:Array<dataSocial>}){

    return (
        <Card title={title} subtitle='' content=''>
            <div className='div-social'>
                {data.map((value, index) => (
                    <div className="social-item" key={index}>
                        <a href={value.link} target='_blank' rel="noopener noreferrer" title={value.title}><img src={value.source} alt={value.title} className='skill-image'/></a>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default SocialCard