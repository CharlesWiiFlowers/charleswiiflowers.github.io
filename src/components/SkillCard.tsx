import Card from './card.tsx';
import './profileCard.css'

function SkillCard({title, data}:
        {title: string, data: Array<object>}){

        let language_row: string[] = []
        let techology_row: string[] = []

        data.forEach(element => {
            if(element.category == "languages"){language_row.push(element.source)}
            if(element.category == "technologies"){language_row.push(element.source)}
        });

        return (
            <Card title={title} subtitle='' content=' '>
                <div className='div-languages'>
                    <h2>Languages</h2>
                    <div className='div-image'>
                        {language_row.map((src, index) => (
                            <img key={index} src={src} className='skill-image'/>
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

export default SkillCard