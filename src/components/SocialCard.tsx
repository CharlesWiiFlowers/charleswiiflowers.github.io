import Card from './card';

function SocialCard({title, data}: {title:string, data:Array<object>}){

    return (
        <Card title={title} subtitle='' content=''>
            <div className='div-social'>
                {data.map((value, index) => (
                    <div className={'div-' + index.toString()} key={index}>
                        <a href={value.link} target='_blank' rel="noopener noreferrer" title={value.title}><img src={value.source} alt={value.title} className='skill-image'/></a>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default SocialCard