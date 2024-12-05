import Card from './card.tsx';

function SkillCard({title, data}:
        {title: string, data: Array<object>}){

        let language_row: string[] = [];
        let techology_row: string[] = [];

        data.forEach(element => {
            if(element.category == "languages"){language_row.push(element.source)}
            if(element.category == "technologies"){techology_row.push(element.source)}
        });

        return (
            <Card title={title} subtitle='' content=''>
                <div className='div-languages'>
                    <h2>Languages</h2>
                    <div className='div-image'>
                        {language_row.map((src, index) => (
                            <img key={index} src={src} className='skill-image'/>
                        ))}
                    </div>
                </div>
                <div className='div-technologies'>
                    <h2>Technologies</h2>
                    <div className='div-image'>
                        {techology_row.map((src, index) => (
                            <div className={'div' + index.toString()}>
                                <img key={index} src={src} className='skill-image'/>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

export default SkillCard