import Card from './card.tsx';

function SkillCard({ title, data }:
    { title: string, data: Array<object> }) {

    const language_row: string[] = [];
    const techology_row: string[] = [];
    const language_name_row: string[] = [];
    const technology_name_row: string[] = [];

    data.forEach(element => {
        if (element.category == "languages") {
            language_row.push(element.source);
            language_name_row.push(element.name);
        }
        if (element.category == "technologies") {
            techology_row.push(element.source);
            technology_name_row.push(element.name);
        }
    });

    return (
        <Card title={title} subtitle='' content=''>
            <div className='div-languages'>
                <h2>Languages</h2>
                <div className='div-image'>
                    {language_row.map((src, index) => (
                        <div className='skill-container'>
                            <img key={index} src={src} className='skill-image' />
                            <span className='skill-name'>{language_name_row[index]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='div-technologies'>
                <h2>Technologies</h2>
                <div className='div-image'>
                    {techology_row.map((src, index) => (
                        <div className="skill-container">
                            <img key={index} src={src} className='skill-image' />
                            <span className='skill-name'>{technology_name_row[index]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default SkillCard