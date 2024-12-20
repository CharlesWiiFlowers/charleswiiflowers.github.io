import Card from "./card";

interface dataProject {
    name:string,
    content:string,
    platform:string,
    link:string,
    image:string,
    technologies: Array<string>
}

{/*Aspect of data array in json:
    {"name": "title of the project", "content": "what's the project","platform": "platform/icon", "link": "project's link", "image": "image path", "technologies": ["tag/icon tag"]}
    
    icon example: devicon-vscode-plain colored from https://devicon.dev/ declared on <head/> on index.html*/}
function ProjectCard({title, data}: {title:string, data:Array<dataProject>}){
    if(data.length == 0){
        return <div></div>
    } else {
        return (
            <Card title={title} subtitle="" content="">
                <div className="div-project">
                    {data.map((value, index) => (
                        <a className={"link-" + index.toString()} href={value.link} target='_blank' rel="noopener noreferrer" title={"Open " + value.name + " project!"} key={index}>
                            <div className="div-project-inside-link">
                                <div>
                                    <img className="image-project" src={value.image}/>
                                </div>
                                <div>
                                    <h1 className="project-title-text">
                                        {value.name}
                                    </h1>
                                    <h3 className="project-content-text">
                                        {value.content}
                                    </h3>
                                </div>
                                <div className="tags">
                                    {value.technologies.map((element:string, dex:number) => {
                                        const data: string[] = returnNameAndImage(element)
                                        return (
                                        <div key={dex} className="item-tag">
                                            <i className={data[1]}/>
                                            <p className="item-tag-name">{data[0]}</p>
                                        </div>)
                                    })}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </Card>
        )
    }
}

function returnNameAndImage(text:string): string[] {
    const number:number = text.search("/");
    const name = text.substring(0, number);
    const imageSource = text.substring(number + 1, text.length -1);
    
    return [name, imageSource];
}

export default ProjectCard